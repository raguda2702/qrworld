import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [{ url: `${url}/`, priority: 1 }, { url: `${url}/support`, priority: 0.6 }, { url: `${url}/legal/privacy`, priority: 0.4 }, { url: `${url}/legal/terms`, priority: 0.4 }, { url: `${url}/billing`, priority: 0.7 }];
}
