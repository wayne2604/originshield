"use client";

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  Type,
  Image as ImageIcon,
  Link2,
  ShieldCheck,
  Upload,
  FileImage,
  X,
  ScanLine,
} from "lucide-react";
import { DetectionError, runDetection } from "@/lib/services/detectionService";
import type { DetectionType, ScanStatus, ScanResult } from "@/types";
import { INPUT_LIMITS } from "@/constants";
import ResultView from "./ResultView";
import UsageLimitModal from "./UsageLimitModal";

// ── Tab config ─────────────────────────────────────────────────────────────

const TABS: { id: DetectionType; label: string; icon: React.ReactNode }[] = [
  { id: "text", label: "Text", icon: <Type size={16} /> },
  { id: "image", label: "Image", icon: <ImageIcon size={16} /> },
  { id: "url", label: "URL", icon: <Link2 size={16} /> },
];

// ── Scanning overlay ───────────────────────────────────────────────────────

function ScanningOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[1.25rem] overflow-hidden">
      {/* Blurred glass backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(3,7,18,0.85)",
          backdropFilter: "blur(12px)",
        }}
      />

      {/* Animated scan line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00f0ff, transparent)",
          boxShadow: "0 0 12px 2px rgba(0,240,255,0.4)",
          animation: "scan-line 1.8s linear infinite",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{
            background: "rgba(0,240,255,0.08)",
            border: "1px solid rgba(0,240,255,0.25)",
            animation: "glow-pulse 1.5s ease-in-out infinite",
          }}
        >
          <ScanLine size={32} className="text-[#00f0ff]" />
        </div>

        <div className="text-center">
          <p className="text-base font-bold text-white mb-1">
            Analyzing Content
          </p>
          <p className="text-sm text-slate-400">
            Running deep-learning inference…
          </p>
        </div>

        {/* Pulsing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#00f0ff]"
              style={{
                animation: `pulse-neon 1.2s ease-in-out ${i * 0.2}s infinite`,
                boxShadow: "0 0 8px rgba(0,240,255,0.6)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ScannerHub() {
  // State machine
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Input state
  const [activeTab, setActiveTab] = useState<DetectionType>("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── File handlers ──────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (
      file.type.startsWith("image/") &&
      file.size <= INPUT_LIMITS.imageSizeBytes
    ) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────

  const canSubmit =
    status === "idle" &&
    ((activeTab === "text" &&
      textInput.trim().length >= INPUT_LIMITS.textMin) ||
      (activeTab === "image" && selectedFile !== null) ||
      (activeTab === "url" && urlInput.trim().length >= INPUT_LIMITS.urlMin));

  // ── Submission ─────────────────────────────────────────────────────────

  const handleAnalyze = useCallback(async () => {
    if (!canSubmit) return;
    setStatus("loading");
    setError(null);
    setShowPaywall(false);

    try {
      const content =
        activeTab === "text"
          ? textInput.trim()
          : activeTab === "url"
          ? urlInput.trim()
          : selectedFile!;

      const result = await runDetection(activeTab, content);
      setScanResult(result);
      setStatus("success");
    } catch (err) {
      if (err instanceof DetectionError && err.code === "LIMIT_REACHED") {
        setStatus("idle");
        setShowPaywall(true);
        return;
      }

      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStatus("error");
    }
  }, [canSubmit, activeTab, textInput, urlInput, selectedFile]);

  const handleScanAgain = useCallback(() => {
    setStatus("idle");
    setScanResult(null);
    setError(null);
    setShowPaywall(false);
  }, []);

  // ── Success view ───────────────────────────────────────────────────────

  if (status === "success" && scanResult) {
    return (
      <section id="input-hub" className="relative z-10 py-16 sm:py-20 px-4">
        {showPaywall && <UsageLimitModal onClose={() => setShowPaywall(false)} />}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Scan Results
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Detection complete — review the authenticity analysis below.
            </p>
          </div>
          <ResultView result={scanResult} onScanAgain={handleScanAgain} />
        </div>
      </section>
    );
  }

  // ── Input view (idle + loading) ────────────────────────────────────────

  return (
    <section id="input-hub" className="relative z-10 py-16 sm:py-20 px-4">
      {showPaywall && <UsageLimitModal onClose={() => setShowPaywall(false)} />}
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Input Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Paste text, upload an image, or enter a URL to scan for
            AI-generated content.
          </p>
        </div>

        {/* Card — position relative so scanning overlay can sit on top */}
        <div className="relative glass-card-strong p-6 sm:p-8 animate-glow-pulse">
          {status === "loading" && <ScanningOverlay />}

          {/* Tab bar */}
          <div
            className="flex items-center gap-2 p-1.5 rounded-xl mb-6"
            style={{
              background: "rgba(2,6,23,0.5)",
              border: "1px solid rgba(0,240,255,0.08)",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={status === "loading"}
                className={`tab-toggle flex-1 justify-center ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[220px]">
            {/* TEXT */}
            {activeTab === "text" && (
              <div className="animate-fade-in">
                <label
                  htmlFor="text-input"
                  className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2"
                >
                  Paste your content
                </label>
                <textarea
                  id="text-input"
                  className="input-cyber"
                  placeholder="Paste the text you want to analyze for AI-generated content…"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={7}
                  disabled={status === "loading"}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-600">
                    {textInput.length} characters
                    {textInput.length > 0 &&
                      textInput.length < INPUT_LIMITS.textMin && (
                        <span className="text-amber-500/70 ml-2">
                          (minimum {INPUT_LIMITS.textMin})
                        </span>
                      )}
                  </span>
                </div>
              </div>
            )}

            {/* IMAGE */}
            {activeTab === "image" && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Upload an image
                </label>

                {!selectedFile ? (
                  <div
                    className={`drop-zone ${dragActive ? "active" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-xl"
                      style={{
                        background: "rgba(0,240,255,0.06)",
                        border: "1px solid rgba(0,240,255,0.12)",
                      }}
                    >
                      <Upload size={24} className="text-[#00f0ff]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-300 font-medium">
                        Drag & drop or{" "}
                        <span className="text-[#00f0ff]">browse</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        PNG, JPG, WEBP — max 10 MB
                      </p>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={INPUT_LIMITS.imageAccept}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(0,240,255,0.15)" }}
                  >
                    {previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-64 object-contain bg-black/40"
                      />
                    )}
                    <div className="flex items-center justify-between px-4 py-3 bg-[rgba(2,6,23,0.7)]">
                      <div className="flex items-center gap-2">
                        <FileImage size={14} className="text-[#00f0ff]" />
                        <span className="text-sm text-slate-300 truncate max-w-[200px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-slate-600">
                          ({(selectedFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        onClick={clearFile}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL */}
            {activeTab === "url" && (
              <div className="animate-fade-in">
                <label
                  htmlFor="url-input"
                  className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2"
                >
                  Enter a URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Link2 size={16} />
                  </div>
                  <input
                    id="url-input"
                    type="url"
                    className="input-cyber !pl-10"
                    placeholder="https://example.com/article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  We&apos;ll extract and analyze the page content for AI
                  generation signals.
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {status === "error" && error && (
            <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              className="btn-neon"
              disabled={!canSubmit}
              onClick={handleAnalyze}
              style={{
                opacity: canSubmit ? 1 : 0.4,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              <ShieldCheck size={18} />
              <span>Analyze Content</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
