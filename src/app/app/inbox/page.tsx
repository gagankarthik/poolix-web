"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { TopBar } from "@/components/app/TopBar";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useMyChats } from "@/lib/queries";
import type { Chat } from "@/lib/firestore-types";

type Message = {
  id: string;
  senderId: string;
  text: string;
  sentAt: Timestamp | null;
};

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

export default function InboxPage() {
  const { user } = useAuth();
  const { chats, loading } = useMyChats();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Auto-select the first thread when the list lands.
  useEffect(() => {
    if (!activeId && chats.length > 0) setActiveId(chats[0].chatId);
  }, [chats, activeId]);

  const active = useMemo(
    () => chats.find((c) => c.chatId === activeId) ?? null,
    [chats, activeId]
  );

  return (
    <>
      <TopBar eyebrow="· Conversations" title="Inbox" />

      <div className="flex flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[24rem_1fr]">
        {/* Thread list */}
        <ul className="scroll-elegant max-h-64 overflow-y-auto border-b border-line lg:max-h-none lg:border-b-0 lg:border-r">
          {loading && (
            <li className="px-6 py-5 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
              Loading…
            </li>
          )}
          {!loading && chats.length === 0 && (
            <li className="px-6 py-12 text-center">
              <div className="font-display text-xl font-semibold">
                No conversations yet
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Message a driver after booking — threads land here, one per
                person.
              </p>
            </li>
          )}
          {chats.map((c) => (
            <ThreadRow
              key={c.chatId}
              chat={c}
              active={c.chatId === activeId}
              selfUid={user?.uid ?? ""}
              onClick={() => setActiveId(c.chatId)}
            />
          ))}
        </ul>

        {/* Open thread */}
        <section className="flex min-h-0 flex-col">
          {active && user ? (
            <ChatPane chat={active} selfUid={user.uid} />
          ) : (
            <div className="grid flex-1 place-items-center text-ink-muted">
              <span className="font-mono text-xs uppercase tracking-[0.24em]">
                Select a conversation
              </span>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function ThreadRow({
  chat,
  active,
  selfUid,
  onClick,
}: {
  chat: Chat;
  active: boolean;
  selfUid: string;
  onClick: () => void;
}) {
  const otherName = useMemo(() => {
    if (selfUid === chat.driverId) return chat.riderName ?? "Rider";
    return chat.driverName ?? "Driver";
  }, [chat, selfUid]);
  const unread = chat.unread?.[selfUid] ?? 0;
  const hue = hueFromId(
    selfUid === chat.driverId ? chat.riderId : chat.driverId
  );

  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-start gap-4 border-b border-line/60 px-6 py-5 text-left transition hover:bg-cream-soft ${
          active ? "bg-cream-soft" : ""
        }`}
      >
        <div
          className="grid size-12 place-items-center rounded-full font-display text-lg font-semibold text-ink"
          style={{ background: `hsl(${hue} 60% 75%)` }}
        >
          {otherName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate font-display text-base font-semibold">
              {otherName}
            </span>
            <span className="font-mono text-[10px] text-ink-muted">
              {formatRelative(chat.lastMessageAt)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`truncate text-sm ${
                unread > 0 ? "text-ink font-medium" : "text-ink-soft"
              }`}
            >
              {chat.lastMessage || "No messages yet"}
            </span>
            {unread > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[10px] font-bold text-cream">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

function ChatPane({ chat, selfUid }: { chat: Chat; selfUid: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const otherName =
    selfUid === chat.driverId
      ? chat.riderName ?? "Rider"
      : chat.driverName ?? "Driver";
  const otherUid =
    selfUid === chat.driverId ? chat.riderId : chat.driverId;
  const hue = hueFromId(otherUid);

  // Live messages for the open chat. Resets on chat change.
  useEffect(() => {
    const q = query(
      collection(db, "chats", chat.chatId, "messages"),
      orderBy("sentAt", "asc")
    );
    const unsub = onSnapshot(q, (qs) => {
      setMessages(
        qs.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Message, "id">),
        }))
      );
    });
    return unsub;
  }, [chat.chatId]);

  // Reset my unread counter when the thread is open or new messages arrive.
  useEffect(() => {
    setDoc(
      doc(db, "chats", chat.chatId),
      { unread: { [selfUid]: 0 } },
      { merge: true }
    ).catch(() => {});
  }, [chat.chatId, selfUid, messages.length]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const chatRef = doc(db, "chats", chat.chatId);
      const msgRef = doc(collection(db, "chats", chat.chatId, "messages"));
      const batch = writeBatch(db);
      batch.set(msgRef, {
        senderId: selfUid,
        text,
        sentAt: serverTimestamp(),
      });
      // Mirror the Android sendMessage pattern: bump lastMessage + bump the
      // other participant's unread counter atomically with the new message.
      batch.set(
        chatRef,
        {
          lastMessage: text,
          lastMessageAt: serverTimestamp(),
          unread: { [otherUid]: incrementMap(chat.unread, otherUid) },
        },
        { merge: true }
      );
      await batch.commit();
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 border-b border-line bg-paper/60 px-8 py-4">
        <div
          className="grid size-12 place-items-center rounded-full font-display text-lg font-semibold text-ink"
          style={{ background: `hsl(${hue} 60% 75%)` }}
        >
          {otherName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-display text-lg font-semibold">{otherName}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />{" "}
            Active conversation
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 px-8 py-8 scroll-elegant">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-ink-muted">
            <span className="font-mono text-xs uppercase tracking-[0.24em]">
              Say hi 👋
            </span>
          </div>
        )}
        {messages.map((m, i) => {
          const mine = m.senderId === selfUid;
          const next = messages[i + 1];
          const groupBreak =
            !next ||
            next.senderId !== m.senderId ||
            (m.sentAt && next.sentAt &&
              next.sentAt.toMillis() - m.sentAt.toMillis() > 5 * 60_000);
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-2.5 ${
                  mine
                    ? "bg-ink text-cream"
                    : "border border-line bg-paper text-ink"
                }`}
              >
                {m.text}
              </div>
              {groupBreak && m.sentAt && (
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {m.sentAt.toDate().toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="border-t border-line bg-paper px-8 py-5"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-cream-soft px-5 py-3">
          <input
            type="text"
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 bg-transparent font-medium placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || draft.trim().length === 0}
            aria-label="Send"
            className="grid size-10 place-items-center rounded-full bg-ink text-cream transition hover:bg-coral disabled:opacity-40"
          >
            →
          </button>
        </div>
      </form>
    </>
  );
}

function formatRelative(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d`;
  return ts.toDate().toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function incrementMap(unread: Chat["unread"], uid: string): number {
  return (unread?.[uid] ?? 0) + 1;
}
