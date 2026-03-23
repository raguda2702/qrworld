export default async function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="container-page max-w-3xl"><div className="surface p-8"><h1 className="section-title">QR Pet</h1><p className="section-subtitle">Record ID: {id}</p><p className="mt-4 text-slate-600">Pet passport, vaccination info and owner contact.</p></div></div>;
}
