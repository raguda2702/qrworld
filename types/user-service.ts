export type ServiceKey =
  | "date"
  | "pet"
  | "car"
  | "door"
  | "kids"
  | "stuff";

export type UserService = {
  id: string;
  userId: string;
  service: ServiceKey;
  title: string;
  slug: string;
  targetUrl: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
};