# Task: Admin Dashboard Infrastructure & Security

## Objective
Implement the backend logic, security guards, and data fetching for the OriginShield Admin Dashboard.

## Requirements
1. **Admin Configuration**:
   - Create `src/config/admin.ts`.
   - Export an `ADMIN_EMAILS` array. Include `admin@originshield.com` as a placeholder.

2. **Middleware Security**:
   - Create `src/middleware.ts` in the `src/` directory.
   - Implement logic to protect all `/admin/*` routes.
   - Use Supabase Auth to check the session.
   - If the user is logged in but their email is NOT in `ADMIN_EMAILS`, redirect them to the home page.
   - If not logged in, redirect to `/auth`.

3. **Admin Actions (Server Actions)**:
   - Create `src/app/actions/admin.ts`.
   - Implement `getAdminStats()`: Returns total scans, total users, and success rate.
   - Implement `getGlobalRecentScans()`: Fetches the latest scans across all users.
   - Implement `getScanDistribution()`: Returns counts grouped by `DetectionType`.

4. **Base Layout**:
   - Create `src/app/admin/layout.tsx`.
   - Implement a server-side check for the admin email.

5. **Auth Integration**:
   - Update the post-login logic to check if the user is an admin and show an "Admin Dashboard" link if applicable.

## Technical Notes
- Use the existing Supabase server client from `src/lib/supabase/server.ts`.
- Ensure all admin actions are protected by checking the user's email against `ADMIN_EMAILS` server-side.
