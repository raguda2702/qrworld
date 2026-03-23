export default async function DoorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="container-page max-w-3xl"><div className="surface p-8"><h1 className="section-title">QR Door</h1><p className="section-subtitle">Record ID: {id}</p><p className="mt-4 text-slate-600">Visitor routing and remote communication flow.</p></div></div>;
}
