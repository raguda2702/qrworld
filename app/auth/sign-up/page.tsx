import SignUpClient from "./SignUpClient";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const next =
    typeof sp.next === "string" && sp.next.trim() ? sp.next : "/dashboard";

  return <SignUpClient nextPath={next} />;
}