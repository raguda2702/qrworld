"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

type CameraDevice = {
  id: string;
  label: string;
};

export default function QrScanner() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";

  const [ready, setReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  useEffect(() => {
    setReady(true);
    loadCameras();

    return () => {
      void stopScanner();
    };
  }, []);

  async function loadCameras() {
    try {
      setError("");

      const devices = await Html5Qrcode.getCameras();

      const mapped = devices.map((device) => ({
        id: device.id,
        label: device.label || `Camera ${device.id.slice(0, 6)}`,
      }));

      setCameras(mapped);

      if (mapped.length > 0) {
        const backCamera =
          mapped.find((cam) => /back|rear|environment/i.test(cam.label)) || mapped[0];
        setSelectedCameraId(backCamera.id);
      } else {
        setError("No camera found on this device.");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not access camera list. Check browser permissions."
      );
    }
  }

  async function startScanner() {
    try {
      setError("");
      setResult("");

      if (!selectedCameraId) {
        setError("No camera selected.");
        return;
      }

      if (scannerRef.current) {
        await stopScanner();
      }

      const scanner = new Html5Qrcode(regionId);
      scannerRef.current = scanner;

      await scanner.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        (decodedText) => {
          setResult(decodedText);
          void stopScanner();
          handleScanResult(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (e) {
      setScanning(false);
      setError(
        e instanceof Error ? e.message : "Failed to start camera. Check permissions."
      );
    }
  }

  async function stopScanner() {
    try {
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        try {
          await scanner.stop();
        } catch {}
        try {
          await scanner.clear();
        } catch {}
        scannerRef.current = null;
      }
    } finally {
      setScanning(false);
    }
  }

  function handleScanResult(decodedText: string) {
    try {
      const url = new URL(decodedText, window.location.origin);
      const isInternalQrRoute =
        url.pathname.startsWith("/u/") && url.pathname.includes("/s/");

      if (isInternalQrRoute) {
        router.push(url.pathname + url.search);
        return;
      }

      setResult(url.toString());
    } catch {
      setResult(decodedText);
    }
  }

  function openScannedValue() {
    if (!result) return;

    try {
      const url = new URL(result, window.location.origin);
      const isInternalQrRoute =
        url.pathname.startsWith("/u/") && url.pathname.includes("/s/");

      if (isInternalQrRoute) {
        router.push(url.pathname + url.search);
        return;
      }

      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
      navigator.clipboard.writeText(result).catch(() => {});
    }
  }

  if (!ready) {
    return <div className="surface p-6">Loading scanner...</div>;
  }

  return (
    <div className="surface p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">QR Scanner</h2>
        <p className="mt-1 text-sm text-slate-500">
          Scan QR codes with your device camera.
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Camera
        </label>
        <select
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          value={selectedCameraId}
          onChange={(e) => setSelectedCameraId(e.target.value)}
          disabled={scanning}
        >
          <option value="">Select camera</option>
          {cameras.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.label}
            </option>
          ))}
        </select>
      </div>

      <div
        id={regionId}
        className="min-h-[280px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        {!scanning ? (
          <button className="btn-primary" onClick={startScanner}>
            Start camera
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => void stopScanner()}>
            Stop camera
          </button>
        )}

        <button className="btn-secondary" onClick={loadCameras} disabled={scanning}>
          Refresh cameras
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 rounded-3xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-900">Scanned result</div>
          <div className="mt-2 break-all text-sm text-slate-600">{result}</div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={openScannedValue}>
              Open result
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigator.clipboard.writeText(result).catch(() => {})}
            >
              Copy
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setResult("");
                setError("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}