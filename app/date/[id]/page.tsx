import DatePublicClient from "./view";
export default async function DatePublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DatePublicClient id={id} />;
}
