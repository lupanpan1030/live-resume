"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Mail } from "lucide-react";

type ContactEmailActionsProps = {
  copiedLabel: string;
  copyAriaLabel: string;
  copyErrorLabel: string;
  copyLabel: string;
  email: string;
  mailAriaLabel: string;
  mailLabel: string;
  mailtoHref: string;
};

type CopyStatus = "idle" | "copied" | "error";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back for browsers that expose the API but still deny clipboard writes.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.readOnly = true;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("Unable to copy text");
  }
}

export function ContactEmailActions({
  copiedLabel,
  copyAriaLabel,
  copyErrorLabel,
  copyLabel,
  email,
  mailAriaLabel,
  mailLabel,
  mailtoHref,
}: ContactEmailActionsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const queueReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
      resetTimerRef.current = null;
    }, 2200);
  };

  const handleCopy = async () => {
    try {
      await copyText(email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    } finally {
      queueReset();
    }
  };

  const statusLabel =
    copyStatus === "copied"
      ? copiedLabel
      : copyStatus === "error"
        ? copyErrorLabel
        : "";
  const visibleCopyLabel =
    copyStatus === "copied"
      ? copiedLabel
      : copyStatus === "error"
        ? copyErrorLabel
        : copyLabel;

  return (
    <div className="folio-contact-actions">
      <Link
        href={mailtoHref}
        className="folio-button folio-contact-primary"
        aria-label={mailAriaLabel}
      >
        <span>{mailLabel}</span>
        <Mail className="h-4 w-4 shrink-0" />
      </Link>
      <button
        type="button"
        className="folio-button-secondary folio-contact-copy"
        data-state={copyStatus}
        aria-label={copyAriaLabel}
        onClick={handleCopy}
      >
        <span>{visibleCopyLabel}</span>
        {copyStatus === "copied" ? (
          <Check className="h-4 w-4 shrink-0" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {statusLabel}
      </span>
    </div>
  );
}
