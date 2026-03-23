"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { ServiceKey, createUserService, saveQrRecord, updateUserService } from "@/lib/dataStore";
import { getAppUrl } from "@/lib/appUrl";

type Props = {
  userId: string;
  refreshKey?: number;
  onCreated?: () => void;
};

const SERVICE_OPTIONS: Array<{ key: ServiceKey; title: string; description: string }> = [
  { key: "qr-date", title: "QR Date", description: "Dating profile or social connection page" },
  { key: "qr-door", title: "QR Door", description: "Access, guest entry, or smart door page" },
  { key: "qr-pet", title: "QR Pet", description: "Pet profile, contacts, and info page" },
  { key: "qr-car", title: "QR Car", description: "Car contact card or vehicle info page" },
  { key: "qr-kids", title: "QR Kids", description: "Child safety and emergency info page" },
  { key: "qr-stuff", title: "QR Stuff", description: "Product, object, or item landing page" },
];

function titleFromKey(serviceKey: ServiceKey) {
  return SERVICE_OPTIONS.find((item) => item.key === serviceKey)?.title || "QR Service";
}
function descriptionFromKey(serviceKey: ServiceKey) {
  return SERVICE_OPTIONS.find((item) => item.key === serviceKey)?.description || "QR service page";
}

export default function QrGeneratorForm({ userId, onCreated }: Props) {
  const [serviceKey, setServiceKey] = useState<ServiceKey>("qr-date");
  const [title, setTitle] = useState(titleFromKey("qr-date"));
  const [description, setDescription] = useState(descriptionFromKey("qr-date"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [createdServiceId, setCreatedServiceId] = useState("");

  const servicePreview = useMemo(() => SERVICE_OPTIONS.find((item) => item.key === serviceKey), [serviceKey]);

  async function handleGenerate() {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const finalTitle = title.trim() || titleFromKey(serviceKey);
      const finalDescription = description.trim() || descriptionFromKey(serviceKey);
      const service = createUserService({ userId, serviceKey, title: finalTitle, description: finalDescription, isActive: true });
      const appUrl = getAppUrl();
      if (!appUrl) throw new Error("App URL is missing. Set NEXT_PUBLIC_APP_URL.");
      const generatedQrValue = `${appUrl}/u/${userId}/s/${serviceKey}/${service.id}`;
      const generatedQrCodeUrl = await QRCode.toDataURL(generatedQrValue, { width: 720, margin: 2 });
      updateUserService(service.id, { qrValue: generatedQrValue, qrCodeUrl: generatedQrCodeUrl });
      saveQrRecord({ userId, serviceId: service.id, serviceKey, title: finalTitle, qrValue: generatedQrValue, qrCodeUrl: generatedQrCodeUrl });
      setQrValue(generatedQrValue);
      setQrCodeUrl(generatedQrCodeUrl);
      setCreatedServiceId(service.id);
      setSuccess("QR code created successfully.");
      onCreated?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="surface p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold">QR generator</h2>
        <p className="mt-1 text-sm text-slate-500">Create a public QR-linked service page for your account.</p>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm font-medium">Service</span>
        <select
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          value={serviceKey}
          onChange={(e) => {
            const nextKey = e.target.value as ServiceKey;
            setServiceKey(nextKey);
            setTitle(titleFromKey(nextKey));
            setDescription(descriptionFromKey(nextKey));
          }}
        >
          {SERVICE_OPTIONS.map((item) => <option key={item.key} value={item.key}>{item.title}</option>)}
        </select>
      </label>

      <label className="space-y-2 block">
        <span className="text-sm font-medium">Title</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="space-y-2 block">
        <span className="text-sm font-medium">Description</span>
        <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        <div className="font-medium text-slate-900">Preview</div>
        <div className="mt-2">{servicePreview?.title}</div>
        <div className="mt-1 text-slate-500">{servicePreview?.description}</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={handleGenerate} disabled={isLoading}>{isLoading ? "Generating..." : "Generate QR"}</button>
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
      {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

      {qrCodeUrl ? (
        <div className="rounded-3xl border border-slate-200 p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <img src={qrCodeUrl} alt="Generated QR" className="h-40 w-40 rounded-2xl border border-slate-200 bg-white p-2" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900">Public URL</div>
              <a href={qrValue} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm text-blue-600 hover:underline">{qrValue}</a>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={qrCodeUrl} download={`${serviceKey}-${createdServiceId}.png`} className="btn-secondary">Download PNG</a>
                <a href={qrValue} target="_blank" rel="noreferrer" className="btn-primary">Open public page</a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { QrGeneratorForm };
