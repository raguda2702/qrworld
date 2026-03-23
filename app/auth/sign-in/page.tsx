import SignInClient from "./SignInClient";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const next =
    typeof sp.next === "string" && sp.next.trim() ? sp.next : "/dashboard";

  return <SignInClient nextPath={next} />;
}