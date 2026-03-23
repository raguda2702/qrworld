export type AccountSettings = {
  uid?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  plan?: string;
  subscriptionStatus?: string;
  createdAt?: string;
};

export type DateProfile = {
  id: string;
  ownerUid?: string;
  userId?: string;
  name: string;
  age?: string;
  city?: string;
  bio?: string;
  photoUrl?: string;
  avatarUrl?: string;
  interests: string[];
  visibility: "public" | "private" | "matches";
  createdAt: string;
  updatedAt?: string;
};

export type QRCodeRecord = {
  id: string;
  ownerUid?: string;
  userId: string;
  serviceId?: string;
  serviceSlug?: string;
  service: string;
  title: string;
  description?: string;
  targetId?: string;
  targetUrl: string;
  qrCodeUrl: string;
  createdAt: string;
};

export type QRScanRecord = {
  id: string;
  ownerUid?: string;
  qrId: string;
  scannedAt: string;
  city?: string;
  device?: string;
};

export type ScanRecord = QRScanRecord;

export type QRServiceKey = string;