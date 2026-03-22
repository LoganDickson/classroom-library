"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
  onScan: (isbn: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({ onScan, onClose }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          if (isRunningRef.current) {
            isRunningRef.current = false;
            scanner.stop().then(() => {
              onScan(decodedText);
            });
          }
        },
        undefined
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });

    return () => {
      if (isRunningRef.current) {
        isRunningRef.current = false;
        scanner.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Scan Barcode</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Point your camera at the barcode on the back of the book
        </p>
        <div id="reader" className="w-full rounded-lg overflow-hidden" />
      </div>
    </div>
  );
}