"use client";

import type { AccountSettings, DateProfile, QRCodeRecord, QRScanRecord } from "@/types";

export type PlanKey = "free" | "starter" | "pro" | "business";
export type ServiceKey = "qr-date" | "qr-door" | "qr-pet" | "qr-car" | "qr-kids" | "qr-stuff";

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  age?: number;
  bio?: string;
  avatarUrl?: string;
  gender?: "male" | "female" | "other";
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserServiceRecord {
  id: string;
  userId: string;
  serviceKey: ServiceKey;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  qrCodeUrl?: string;
  qrValue?: string;
}

export interface QrRecord {
  id: string;
  userId: string;
  serviceId: string;
  serviceKey: ServiceKey;
  title: string;
  qrValue: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface ChatRecord {
  id: string;
  memberIds: [string, string];
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface BlockedUser {
  id: string;
  userId: string;
  blockedUserId: string;
  createdAt: string;
}

interface AppState {
  planByUser: Record<string, PlanKey>;
  accounts: AccountSettings[];
  profiles: UserProfile[];
  userServices: UserServiceRecord[];
  qrs: QrRecord[];
  dateProfiles: DateProfile[];
  scans: QRScanRecord[];
  friendRequests: FriendRequest[];
  chats: ChatRecord[];
  messages: ChatMessage[];
  blockedUsers: BlockedUser[];
}

const STORAGE_KEY = "qrworld_store_v5";

const defaultState: AppState = {
  planByUser: {},
  accounts: [],
  profiles: [],
  userServices: [],
  qrs: [],
  dateProfiles: [],
  scans: [],
  friendRequests: [],
  chats: [],
  messages: [],
  blockedUsers: [],
};

function isBrowser() { return typeof window !== "undefined"; }
function uid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`; }
function now() { return new Date().toISOString(); }

function readState(): AppState {
  if (!isBrowser()) return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      planByUser: parsed.planByUser ?? {},
      accounts: parsed.accounts ?? [],
      profiles: parsed.profiles ?? [],
      userServices: parsed.userServices ?? [],
      qrs: parsed.qrs ?? [],
      dateProfiles: parsed.dateProfiles ?? [],
      scans: parsed.scans ?? [],
      friendRequests: parsed.friendRequests ?? [],
      chats: parsed.chats ?? [],
      messages: parsed.messages ?? [],
      blockedUsers: parsed.blockedUsers ?? [],
    };
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }
}

function writeState(state: AppState) { if (isBrowser()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

export function getAppState() { return readState(); }
export function resetAppState() { writeState(defaultState); }
export function getPlan(userId: string): PlanKey { return readState().planByUser[userId] ?? "free"; }

export function updatePlan(userId: string, plan: PlanKey): PlanKey;
export function updatePlan(plan: PlanKey): PlanKey;
export function updatePlan(userIdOrPlan: string, maybePlan?: PlanKey) {
  const plan = maybePlan ?? (userIdOrPlan as PlanKey);
  const userId = maybePlan ? userIdOrPlan : undefined;
  const state = readState();
  if (userId) state.planByUser[userId] = plan;
  if (userId) {
    const account = state.accounts.find((item) => item.uid === userId);
    if (account) {
      account.plan = plan;
      account.subscriptionStatus = plan === "free" ? "inactive" : "active";
    }
  }
  writeState(state);
  return plan;
}

export async function ensureAccount(uid: string, displayName?: string, email?: string, photoURL?: string) {
  const state = readState();
  const existing = state.accounts.find((item) => item.uid === uid);
  if (existing) {
    const updated: AccountSettings = {
      ...existing,
      displayName: displayName || existing.displayName,
      email: email || existing.email,
      photoURL: photoURL || existing.photoURL,
      plan: existing.plan || getPlan(uid),
      subscriptionStatus: existing.subscriptionStatus || (getPlan(uid) === "free" ? "inactive" : "active"),
    };
    state.accounts = state.accounts.map((item) => item.uid === uid ? updated : item);
    writeState(state);
    return updated;
  }
  const created: AccountSettings = {
    uid,
    displayName: displayName || email?.split("@")[0] || "User",
    email,
    photoURL,
    plan: getPlan(uid),
    subscriptionStatus: getPlan(uid) === "free" ? "inactive" : "active",
    createdAt: now(),
  };
  state.accounts.unshift(created);
  writeState(state);
  return created;
}
export async function getAccount(uid: string) {
  const state = readState();
  return state.accounts.find((item) => item.uid === uid) || (await ensureAccount(uid));
}

export function getUserProfile(userId: string) { return readState().profiles.find((p) => p.id === userId) ?? null; }
export function ensureUserProfile(userId: string, email?: string) {
  const state = readState();
  const existing = state.profiles.find((p) => p.id === userId);
  if (existing) return existing;
  const created: UserProfile = { id: userId, email, name: email?.split("@")[0] || "New user", bio: "", avatarUrl: "", city: "", gender: "other", createdAt: now(), updatedAt: now() };
  state.profiles.unshift(created); writeState(state); return created;
}
export function upsertUserProfile(input: Omit<UserProfile, "createdAt" | "updatedAt"> & { id: string }) {
  const state = readState(); const existing = state.profiles.find((p) => p.id === input.id);
  if (existing) {
    const updated: UserProfile = { ...existing, ...input, updatedAt: now() };
    state.profiles = state.profiles.map((p) => p.id === input.id ? updated : p);
    writeState(state); return updated;
  }
  const created: UserProfile = { ...input, createdAt: now(), updatedAt: now() };
  state.profiles.unshift(created); writeState(state); return created;
}

export function createUserService(input: Omit<UserServiceRecord, "id" | "createdAt" | "updatedAt">) {
  const state = readState(); const item: UserServiceRecord = { ...input, id: uid("service"), createdAt: now(), updatedAt: now() };
  state.userServices.unshift(item); writeState(state); return item;
}
export function updateUserService(serviceId: string, patch: Partial<Omit<UserServiceRecord, "id" | "createdAt">>) {
  const state = readState(); const existing = state.userServices.find((s) => s.id === serviceId); if (!existing) return null;
  const updated: UserServiceRecord = { ...existing, ...patch, updatedAt: now() };
  state.userServices = state.userServices.map((s) => s.id === serviceId ? updated : s); writeState(state); return updated;
}
export function getUserService(serviceId: string) { return readState().userServices.find((s) => s.id === serviceId) ?? null; }
export function getUserServices(userId: string) { return readState().userServices.filter((s) => s.userId === userId); }

export function saveQrRecord(input: Omit<QrRecord, "id" | "createdAt" | "updatedAt">) {
  const state = readState();
  const item: QrRecord = { ...input, id: uid("qr"), createdAt: now(), updatedAt: now() };
  state.qrs.unshift(item); writeState(state);
  const qrCode: QRCodeRecord = { id: item.id, ownerUid: item.userId, userId: item.userId, serviceId: item.serviceId, serviceSlug: item.serviceKey, service: item.serviceKey, title: item.title, description: item.title, targetId: item.serviceId, targetUrl: item.qrValue, qrCodeUrl: item.qrCodeUrl, createdAt: item.createdAt };
  return qrCode;
}
export function getQrsByUser(userId: string) { return readState().qrs.filter((q) => q.userId === userId); }
export async function listQRCodes(userId: string) {
  return readState().qrs.filter((q) => q.userId === userId).map((q) => ({
    id: q.id, ownerUid: q.userId, userId: q.userId, serviceId: q.serviceId, serviceSlug: q.serviceKey, service: q.serviceKey, title: q.title, description: q.title, targetId: q.serviceId, targetUrl: q.qrValue, qrCodeUrl: q.qrCodeUrl, createdAt: q.createdAt,
  } satisfies QRCodeRecord));
}
export async function deleteQRCode(qrId: string) { const state = readState(); state.qrs = state.qrs.filter((q) => q.id !== qrId); writeState(state); }

export async function upsertDateProfile(input: { id?: string; ownerUid: string; name: string; age?: string; city?: string; bio?: string; interests?: string[]; visibility?: "public" | "private" | "matches"; }) {
  const state = readState(); const timestamp = now();
  if (input.id) {
    const existing = state.dateProfiles.find((p) => p.id === input.id);
    if (existing) {
      const updated: DateProfile = { ...existing, ...input, avatarUrl: getUserProfile(input.ownerUid)?.avatarUrl, photoUrl: getUserProfile(input.ownerUid)?.avatarUrl, interests: input.interests ?? existing.interests ?? [], visibility: input.visibility ?? existing.visibility ?? "public", updatedAt: timestamp };
      state.dateProfiles = state.dateProfiles.map((p) => p.id === input.id ? updated : p); writeState(state);
      upsertUserProfile({ id: input.ownerUid, email: getUserProfile(input.ownerUid)?.email, name: input.name, age: input.age ? Number(input.age) : undefined, bio: input.bio, city: input.city, avatarUrl: updated.avatarUrl, gender: getUserProfile(input.ownerUid)?.gender ?? "other" });
      return updated;
    }
  }
  const created: DateProfile = { id: input.id || uid("date"), ownerUid: input.ownerUid, userId: input.ownerUid, name: input.name, age: input.age, city: input.city, bio: input.bio, photoUrl: getUserProfile(input.ownerUid)?.avatarUrl, avatarUrl: getUserProfile(input.ownerUid)?.avatarUrl, interests: input.interests ?? [], visibility: input.visibility ?? "public", createdAt: timestamp, updatedAt: timestamp };
  state.dateProfiles.unshift(created); writeState(state);
  upsertUserProfile({ id: input.ownerUid, email: getUserProfile(input.ownerUid)?.email, name: input.name, age: input.age ? Number(input.age) : undefined, bio: input.bio, city: input.city, avatarUrl: created.avatarUrl, gender: getUserProfile(input.ownerUid)?.gender ?? "other" });
  return created;
}
export async function getDateProfile(id: string) {
  const state = readState();
  return state.dateProfiles.find((p) => p.id === id) || state.dateProfiles.find((p) => p.ownerUid === id || p.userId === id) || null;
}
export async function listDateProfiles(ownerUid?: string) {
  const state = readState();
  return ownerUid ? state.dateProfiles.filter((p) => p.ownerUid === ownerUid || p.userId === ownerUid) : state.dateProfiles;
}
export async function listScansForOwner(ownerUid: string) { return readState().scans.filter((scan) => scan.ownerUid === ownerUid); }
export async function getScanCountForTarget(targetId: string) { return readState().scans.filter((scan) => scan.qrId === targetId || scan.ownerUid === targetId).length; }
export async function recordScan(input: { ownerUid: string; qrId: string; city?: string; device?: string }) {
  const state = readState();
  const item: QRScanRecord = { id: uid("scan"), ownerUid: input.ownerUid, qrId: input.qrId, scannedAt: now(), city: input.city, device: input.device };
  state.scans.unshift(item); writeState(state); return item;
}

export function isBlocked(userId: string, otherUserId: string) { return readState().blockedUsers.some((b) => b.userId === userId && b.blockedUserId === otherUserId); }
export function blockUser(userId: string, blockedUserId: string) {
  const state = readState(); const exists = state.blockedUsers.find((b) => b.userId === userId && b.blockedUserId === blockedUserId);
  if (exists) return exists;
  const item: BlockedUser = { id: uid("block"), userId, blockedUserId, createdAt: now() };
  state.blockedUsers.unshift(item); writeState(state); return item;
}
export function unblockUser(userId: string, blockedUserId: string) {
  const state = readState(); state.blockedUsers = state.blockedUsers.filter((b) => !(b.userId === userId && b.blockedUserId === blockedUserId)); writeState(state);
}
export function createFriendRequest(input: { fromUserId: string; toUserId: string; message?: string }) {
  const state = readState();
  if (input.fromUserId === input.toUserId) throw new Error("You cannot send request to yourself");
  if (isBlocked(input.fromUserId, input.toUserId) || isBlocked(input.toUserId, input.fromUserId)) throw new Error("This user is blocked");
  const existing = state.friendRequests.find((r) => r.fromUserId === input.fromUserId && r.toUserId === input.toUserId && r.status === "pending");
  if (existing) return existing;
  const request: FriendRequest = { id: uid("request"), fromUserId: input.fromUserId, toUserId: input.toUserId, message: input.message, status: "pending", createdAt: now(), updatedAt: now() };
  state.friendRequests.unshift(request); writeState(state); return request;
}
export function getIncomingFriendRequests(userId: string) { return readState().friendRequests.filter((r) => r.toUserId === userId && r.status === "pending"); }
export function getOutgoingFriendRequests(userId: string) { return readState().friendRequests.filter((r) => r.fromUserId === userId && r.status === "pending"); }
export function findDirectChat(userA: string, userB: string) { return readState().chats.find((c) => c.memberIds.includes(userA) && c.memberIds.includes(userB)) ?? null; }
export function createOrGetDirectChat(userA: string, userB: string) {
  const state = readState();
  const existing = state.chats.find((c) => c.memberIds.includes(userA) && c.memberIds.includes(userB));
  if (existing) return existing;
  const chat: ChatRecord = { id: uid("chat"), memberIds: [userA, userB], createdAt: now(), updatedAt: now() };
  state.chats.unshift(chat); writeState(state); return chat;
}
export function respondToFriendRequest(requestId: string, action: "accepted" | "declined" | "cancelled") {
  const state = readState(); const request = state.friendRequests.find((r) => r.id === requestId); if (!request) return null;
  const updated: FriendRequest = { ...request, status: action, updatedAt: now() };
  state.friendRequests = state.friendRequests.map((r) => r.id === requestId ? updated : r);
  let chat: ChatRecord | null = null;
  if (action === "accepted") {
    const existingChat = state.chats.find((c) => c.memberIds.includes(request.fromUserId) && c.memberIds.includes(request.toUserId));
    if (existingChat) chat = existingChat;
    else { chat = { id: uid("chat"), memberIds: [request.fromUserId, request.toUserId], createdAt: now(), updatedAt: now() }; state.chats.unshift(chat); }
  }
  writeState(state); return { request: updated, chat };
}
export function getChatsForUser(userId: string) { return readState().chats.filter((c) => c.memberIds.includes(userId)).sort((a, b) => new Date(b.lastMessageAt || b.updatedAt).getTime() - new Date(a.lastMessageAt || a.updatedAt).getTime()); }
export function getChat(chatId: string) { return readState().chats.find((c) => c.id === chatId) ?? null; }
export function getChatMessages(chatId: string) { return readState().messages.filter((m) => m.chatId === chatId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); }
export function sendChatMessage(input: { chatId: string; senderId: string; text: string }) {
  const text = input.text.trim(); if (!text) throw new Error("Message is empty");
  const state = readState(); const chat = state.chats.find((c) => c.id === input.chatId); if (!chat) throw new Error("Chat not found");
  const recipientId = chat.memberIds.find((id) => id !== input.senderId);
  if (recipientId && (isBlocked(input.senderId, recipientId) || isBlocked(recipientId, input.senderId))) throw new Error("Messaging is unavailable");
  const message: ChatMessage = { id: uid("msg"), chatId: input.chatId, senderId: input.senderId, text, createdAt: now() };
  state.messages.push(message);
  state.chats = state.chats.map((c) => c.id === input.chatId ? { ...c, updatedAt: now(), lastMessage: text, lastMessageAt: message.createdAt } : c);
  writeState(state); return message;
}

export type { DateProfile };
