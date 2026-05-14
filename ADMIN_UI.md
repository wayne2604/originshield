# Task: Admin Dashboard UI & UX Design

## Objective
Design and build a premium, high-tech Admin Dashboard for OriginShield that matches its "Cyber-Clean" aesthetic.

## Requirements
1. **Admin Sidebar**:
   - Create a collapsible sidebar in `src/components/admin/AdminSidebar.tsx`.
   - Links: Overview, All Scans, Users, Settings.
   - Use Lucide icons and sleek hover effects.

2. **Dashboard Overview (`/admin/page.tsx`)**:
   - **Stat Cards**: Display "Total Scans", "AI Detection Rate", "Active Users", and "API Usage". Use vibrant gradients and glassmorphism.
   - **Main Chart**: A "Scans Over Time" area chart. Use Recharts or a similar lightweight library.
   - **Distribution Chart**: A pie or bar chart showing the split between Text, Image, and URL scans.

3. **Global Scan History (`/admin/scans/page.tsx`)**:
   - A paginated table showing scans from all users.
   - Columns: User (Email), Type, Result (AI/Human), Confidence, Timestamp.
   - Include a search filter by user email or scan ID.

4. **User Management (`/admin/users/page.tsx`)**:
   - A list of registered users with their last login date and total scans performed.

5. **Aesthetics & UX**:
   - Follow the "OriginShield" design system (Dark mode, neon accents, Inter font).
   - Add subtle micro-animations using Framer Motion (if available) or CSS transitions.
   - Ensure the layout is responsive (mobile-friendly sidebar).

## Technical Notes
- Use the Server Actions from `src/app/actions/admin.ts` (to be implemented by the Gemini agent) to fetch data.
- Use `shadcn/ui` components if available in the project, or build custom vanilla CSS/Tailwind components.
- Focus on making the UI feel "Premium" and "State of the art".
