import { redirect } from "next/navigation";
export default async function EditDatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/date/create?edit=${id}`);
}
