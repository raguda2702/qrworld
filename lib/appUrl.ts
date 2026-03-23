export function getAppUrl() {
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (publicUrl) return publicUrl.replace(/\/+$/, "");

  const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodUrl) return `https://${prodUrl.replace(/^https?:\/\//, "")}`;

  const deploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (deploymentUrl) return `https://${deploymentUrl.replace(/^https?:\/\//, "")}`;

  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
