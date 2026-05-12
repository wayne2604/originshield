// OriginShield application constants

export const APP_NAME = "OriginShield";
export const APP_TAGLINE = "Verify what's authentically human";

export const INPUT_LIMITS = {
  textMin: 20,
  textMax: 50_000,
  urlMin: 6,
  imageSizeBytes: 10 * 1024 * 1024,
  imageAccept: "image/*",
} as const;
