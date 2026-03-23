import DateCreateClient from "./DateCreateClient";

export default async function DateCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const nextPath =
    typeof sp.next === "string" && sp.next.trim() ? sp.next : "/dashboard";

  return <DateCreateClient nextPath={nextPath} />;
}