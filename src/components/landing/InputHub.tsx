"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import {
  Type,
  Image as ImageIcon,
  Link2,
  ShieldCheck,
  Upload,
  FileImage,
  X,
} from "lucide-react";
import { useDetection } from "@/context/DetectionContext";
import { API_ROUTES, INPUT_LIMITS } from "@/constants";
import type { DetectionType } from "@/types";
import ResultCard from "@/components/ui/ResultCard";
import Spinner from "@/components/ui/Spinner";

type TabMode = DetectionType;

const TABS: { id: TabMode; label: string; icon: React.ReactNode }[] = [
  { id: "text", label: "Text", icon: <Type size={16} /> },
  { id: "image", label: "Image", icon: <ImageIcon size={16} /> },
  { id: "url", label: "URL", icon: <Link2 size={16} /> },
];

export default function InputHub() {
  const { result, setResult } = useDetection();

  const [activeTab, setActiveTab] = useState<TabMode>("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // --- File handlers ---
  const handleFile = (file: File) => {
    if (file.type.startsWith("image/") && file.size <= INPUT_LIMITS.imageSizeBytes) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canSubmit =
    !loading &&
    ((activeTab === "text" && textInput.trim().length >= INPUT_LIMITS.textMin) ||
      (activeTab === "image" && selectedFile !== null) ||
      (activeTab === "url" && urlInput.trim().length >= INPUT_LIMITS.urlMin));

  // --- Submission ---
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      let content = "";
      if (activeTab === "text") {
        content = textInput.trim();
      } else if (activeTab === "url") {
        content = urlInput.trim();
      } else if (activeTab === "image" && selectedFile) {
        // Convert image to base64 for API transport
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      }

      const res = await fetch(API_ROUTES.detect, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, content }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="input-hub" className="relative z-10 py-16 sm:py-20 px-4">
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

        {/* Card */}
        <div className="glass-card-strong p-6 sm:p-8 animate-glow-pulse">
          {/* Tab bar */}
          <div
            id="input-hub-tabs"
            className="flex items-center gap-2 p-1.5 rounded-xl mb-6"
            style={{
              background: "rgba(2, 6, 23, 0.5)",
              border: "1px solid rgba(0, 240, 255, 0.08)",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
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
              <div className="animate-fade-in" key="text-tab">
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
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-600">
                    {textInput.length} characters
                    {textInput.length > 0 && textInput.length < INPUT_LIMITS.textMin && (
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
              <div className="animate-fade-in" key="image-tab">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Upload an image
                </label>

                {!selectedFile ? (
                  <div
                    id="image-drop-zone"
                    className={`drop-zone ${dragActive ? "active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-xl"
                      style={{
                        background: "rgba(0, 240, 255, 0.06)",
                        border: "1px solid rgba(0, 240, 255, 0.12)",
                      }}
                    >
                      <Upload size={24} className="text-[#00f0ff]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-300 font-medium">
                        Drag & drop or{" "}
                        <span className="text-[#00f0ff] cursor-pointer">browse</span>
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
                      id="image-file-input"
                    />
                  </div>
                ) : (
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(0, 240, 255, 0.15)" }}
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
              <div className="animate-fade-in" key="url-tab">
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
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  We&apos;ll extract and analyze the page content for AI generation signals.
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              id="scan-button"
              className="btn-neon"
              disabled={!canSubmit}
              onClick={handleSubmit}
              style={{
                opacity: canSubmit ? 1 : 0.4,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <>
                  <Spinner size={18} />
                  <span>Analyzing…</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Analyze Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && <ResultCard result={result} />}
      </div>
    </section>
  );
}
