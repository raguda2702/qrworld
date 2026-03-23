"use client";

import Link from "next/link";
import { getQrsByUser, getUserServices } from "@/lib/dataStore";
import { useMemo } from "react";

interface Props {
  userId: string;
  refreshKey?: number;
}

function serviceLabel(serviceKey: string) {
  switch (serviceKey) {
    case "qr-date":
      return "QR Date";
    case "qr-door":
      return "QR Door";
    case "qr-pet":
      return "QR Pet";
    case "qr-car":
      return "QR Car";
    case "qr-kids":
      return "QR Kids";
    case "qr-stuff":
      return "QR Stuff";
    default:
      return serviceKey;
  }
}

export default function QrServiceList({ userId, refreshKey = 0 }: Props) {
  const services = useMemo(() => getUserServices(userId), [userId, refreshKey]);
  const qrs = useMemo(() => getQrsByUser(userId), [userId, refreshKey]);

  function findQrForService(serviceId: string) {
    return qrs.find((item) => item.serviceId === serviceId) ?? null;
  }

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">My QR services</h2>
            <p className="mt-1 text-sm text-slate-500">
              Services connected to your profile and generated QR codes.
            </p>
          </div>

          <Link href="/qr/create" className="btn-primary">
            Create QR
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              No QR services yet. Create your first one.
            </div>
          ) : (
            services.map((service) => {
              const qr = findQrForService(service.id);

              return (
                <div
                  key={service.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {serviceLabel(service.serviceKey)}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {service.title}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        service.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <p className="mt-3 min-h-[44px] text-sm text-slate-600">
                    {service.description || "No description yet."}
                  </p>

                  {service.qrCodeUrl ? (
                    <div className="mt-4 flex items-center gap-4">
                      <img
                        src={service.qrCodeUrl}
                        alt={service.title}
                        className="h-24 w-24 rounded-2xl border border-slate-200 bg-white object-contain p-2"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          QR connected
                        </div>

                        {service.qrValue ? (
                          <a
                            href={service.qrValue}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block truncate text-sm font-medium text-blue-600 hover:underline"
                          >
                            Open public page
                          </a>
                        ) : (
                          <div className="mt-2 text-sm text-slate-500">No public URL</div>
                        )}

                        {service.qrCodeUrl ? (
                          <a
                            href={service.qrCodeUrl}
                            download={`${service.serviceKey}-${service.id}.png`}
                            className="mt-2 inline-block text-sm text-slate-600 hover:underline"
                          >
                            Download QR
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      QR not generated yet
                    </div>
                  )}

                  {qr ? (
                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                      Created: {new Date(qr.createdAt).toLocaleString()}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}