import type { ScanResult } from "@/types";

interface BreakdownSectionProps {
  result: ScanResult;
}

interface MetricTileProps {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}

function MetricTile({ label, value, hint, color = "#00f0ff" }: MetricTileProps) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-xl"
      style={{
        background: "rgba(2,6,23,0.5)",
        border: "1px solid rgba(0,240,255,0.08)",
      }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <span
        className="text-lg font-bold font-mono tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
      {hint && (
        <span className="text-[10px] text-slate-600 leading-tight">{hint}</span>
      )}
    </div>
  );
}

function pct(v: number | undefined) {
  return v !== undefined ? `${(v * 100).toFixed(1)}%` : "—";
}

function num(v: number | undefined, decimals = 1) {
  return v !== undefined ? v.toFixed(decimals) : "—";
}

export default function BreakdownSection({ result }: BreakdownSectionProps) {
  const { type, breakdown } = result;

  const tiles: MetricTileProps[] = [];

  if (type === "text") {
    tiles.push(
      {
        label: "Burstiness",
        value: num(breakdown.burstiness),
        hint: "Variance in sentence-level information density",
        color: (breakdown.burstiness ?? 0) > 0.5 ? "#22c55e" : "#ef4444",
      },
      {
        label: "Perplexity",
        value: num(breakdown.perplexity),
        hint: "Surprisal of token sequence (higher = more human-like)",
        color: (breakdown.perplexity ?? 0) > 50 ? "#22c55e" : "#ef4444",
      },
      {
        label: "Repetition",
        value: pct(breakdown.repetitionScore),
        hint: "Proportion of repeated n-gram structures",
        color: (breakdown.repetitionScore ?? 1) < 0.4 ? "#22c55e" : "#ef4444",
      },
      {
        label: "Style Consistency",
        value: pct(breakdown.styleConsistency),
        hint: "Uniformity of stylistic markers across the text",
        color:
          (breakdown.styleConsistency ?? 0) > 0.85 ? "#ef4444" : "#22c55e",
      }
    );
  } else if (type === "image") {
    const exif = breakdown.exifData ?? {};
    const hasExif = Object.keys(exif).length > 0;

    tiles.push(
      {
        label: "EXIF Data",
        value: hasExif ? "Present" : "Missing",
        hint: hasExif
          ? `Camera: ${exif.Make ?? "?"} ${exif.Model ?? "?"}`
          : "No metadata — possible synthetic origin",
        color: hasExif ? "#22c55e" : "#ef4444",
      },
      {
        label: "Noise Pattern",
        value: breakdown.noisePattern ?? "Unknown",
        hint: "Sensor noise fingerprint analysis",
        color: breakdown.noisePattern?.startsWith("Organic")
          ? "#22c55e"
          : "#ef4444",
      },
      {
        label: "Compression",
        value: breakdown.compressionArtifacts ? "Anomalous" : "Normal",
        hint: "DCT block artifact consistency check",
        color: breakdown.compressionArtifacts ? "#ef4444" : "#22c55e",
      },
      {
        label: "Metadata Integrity",
        value: breakdown.metadataConsistency ? "Consistent" : "Inconsistent",
        hint: "Cross-field EXIF/XMP correlation",
        color: breakdown.metadataConsistency ? "#22c55e" : "#ef4444",
      }
    );

    if (hasExif) {
      if (exif.ISO)
        tiles.push({ label: "ISO", value: exif.ISO, color: "#00f0ff" });
      if (exif.FocalLength)
        tiles.push({ label: "Focal Length", value: exif.FocalLength, color: "#00f0ff" });
      if (exif.Aperture)
        tiles.push({ label: "Aperture", value: exif.Aperture, color: "#00f0ff" });
      if (exif.ShutterSpeed)
        tiles.push({ label: "Shutter", value: exif.ShutterSpeed, color: "#00f0ff" });
    }
  } else if (type === "url") {
    tiles.push(
      {
        label: "Style Consistency",
        value: pct(breakdown.styleConsistency),
        hint: "Uniformity across page sections",
        color:
          (breakdown.styleConsistency ?? 0) > 0.85 ? "#ef4444" : "#22c55e",
      },
      {
        label: "Repetition Score",
        value: pct(breakdown.repetitionScore),
        hint: "Repeated phrase patterns detected",
        color: (breakdown.repetitionScore ?? 1) < 0.4 ? "#22c55e" : "#ef4444",
      },
      {
        label: "Sentence Variance",
        value: pct(breakdown.sentenceVariance),
        hint: "Diversity of sentence structures",
        color:
          (breakdown.sentenceVariance ?? 0) > 0.5 ? "#22c55e" : "#ef4444",
      },
      {
        label: "Link Pattern",
        value: pct(breakdown.linkPatternScore),
        hint: "Internal vs external link ratio score",
        color: "#00f0ff",
      }
    );
  }

  return (
    <div>
      <h3
        className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3"
        style={{ letterSpacing: "0.15em" }}
      >
        Signal Breakdown
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiles.map((tile) => (
          <MetricTile key={tile.label} {...tile} />
        ))}
      </div>
    </div>
  );
}
