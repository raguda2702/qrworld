import { ReactNode } from "react";
export function FormField({ label, error, helper, children }: { label: string; error?: string; helper?: string; children: ReactNode; }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
      {!error && helper ? <p className="helper">{helper}</p> : null}
    </div>
  );
}
