# Technical Spec: 3-Scan Freemium Limit

## Objective
Implement a usage limit where anonymous (guest) users are capped at 3 scans across all types (Text, Image, URL). Once the limit is reached, the user must be prompted to log in or upgrade.

---

## Phase 1: API Enforcement (Usage Counting)

### 1. Create Usage Checker Helper
Create `src/lib/services/usageService.ts`:
- Function `checkUsageLimit(req: NextRequest)`:
  - Get the user from Supabase (`getAuthenticatedUser`).
  - If user exists: Return `allow`.
  - If user is Guest:
    - Get IP address from headers (`x-forwarded-for` or `req.ip`).
    - Query Supabase `scans` table for rows where `ip_address` matches and `user_id` is null.
    - If count >= 3, return `forbidden`.

### 2. Update API Routes
Modify `/api/verify/text`, `/api/verify/media`, and `/api/verify/url`:
- Call `checkUsageLimit(req)` at the very beginning.
- If it returns `forbidden`, return a `403` status with:
  `{ error: "Usage limit reached", code: "LIMIT_REACHED" }`.
- In the `POST` logic, ensure the `ip_address` is saved into the `scans` table for every request.

---

## Phase 2: Frontend "Paywall" UI

### 1. Create UsageLimitModal
Create `src/components/scanner/UsageLimitModal.tsx`:
- Design: High-end glassmorphism card.
- Text: "You've reached your free limit."
- Benefits List:
  - [x] Unlimited professional scans
  - [x] Deep forensic metadata analysis
  - [x] Permanent scan history
- Buttons:
  - **"Create Free Account"** (Link to `/auth`)
  - **"View Pricing"** (Link to `#pricing`)

### 2. Handle Error in ScannerHub
Modify `src/components/scanner/ScannerHub.tsx`:
- Add a state `showPaywall: boolean`.
- In the `handleScan` function, catch the error.
- If `error.code === "LIMIT_REACHED"`, set `showPaywall(true)`.
- Render the `UsageLimitModal` when `showPaywall` is true.

---

## Phase 3: Database Update
Ensure the Supabase `scans` table has an `ip_address` column:
- **Action**: Add a column `ip_address` (text) to the `scans` table via the Supabase Dashboard SQL Editor if it is not already present.

---

## Design Requirements
- Use the **Cyber-Clean** aesthetic.
- Modal should have a `backdrop-blur-xl` and a `border-cyan-500/20`.
- Buttons must use the existing `btn-neon` and `btn-ghost` classes.
