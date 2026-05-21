<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&pause=1000&color=F7F7F7&center=true&vCenter=true&width=900&lines=🛡️+OriginShield+—+AI+Content+Detection+Platform" alt="Title" />
</div>

A powerful AI content detection platform built with Next.js and Supabase. It enables users to verify the authenticity of text, images, and web content through cutting-edge deep learning models.

---

### 📦 Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Supabase (Auth & Database)
- Stripe (Payments)
- Sapling AI (Text & URL Detection)
- Sightengine (Image/Deepfake Analysis)

---

### ✨ Quick start
```bash
# Clone the repository
git clone https://github.com/wayne2604/originshield.git

# Navigate to the directory
cd originshield

# Install dependencies
npm install

# Copy the example config and add your credentials
cp .env.example .env.local

# Start the development server
npm run dev
```
Ensure you have Node.js 18+ installed and a Supabase project with the required schema to get started.

---

### ⚙️ Features
- **Multi-Format Scanning** — Analyze text, images, and URLs for AI-generated content.
- **Secure Auth** — Login and registration via Supabase with Google & Facebook OAuth.
- **Freemium Model** — 3 free guest scans with IP-based tracking, then upgrade via Stripe.
- **Admin Dashboard** — System-wide oversight and user management for administrators.
- **Scan History** — Authenticated users can view and revisit past scan results.
- **Password Recovery** — Secure reset flow powered by Supabase email templates.

---

### 🛠️ How it works
The system follows a modular Next.js App Router architecture designed for security and scalability:
- **Server-Side API Routes**: All detection calls go through `/api/verify/*` routes so provider credentials (Sapling, Sightengine) never reach the client.
- **Content Provenance**: Checks image metadata and C2PA signals to verify content origin.
- **Rate Limiting**: In-memory per-IP quota protection prevents abuse on detection endpoints.
- **Stripe Integration**: Webhook-driven subscription management for Pro tier upgrades.

---

### 📁 Project structure
```text
/
├── public/                     # Static assets and brand mark
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/       # Stripe checkout session creation
│   │   │   ├── verify/
│   │   │   │   ├── text/       # Text AI detection via Sapling
│   │   │   │   ├── media/      # Image/deepfake analysis via Sightengine
│   │   │   │   └── url/        # URL content fetching and detection
│   │   │   └── webhooks/       # Stripe webhook handlers
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── auth/               # Login, signup, and password recovery
│   │   ├── profile/            # User scan history and settings
│   │   ├── privacy/            # Privacy policy page
│   │   ├── terms/              # Terms of service page
│   │   └── layout.tsx          # Root layout with metadata and fonts
│   ├── components/
│   │   ├── admin/              # Admin-specific UI components
│   │   ├── auth/               # Auth forms and OAuth buttons
│   │   ├── landing/            # Landing page sections
│   │   ├── layout/             # Shared layout components (Navbar, Footer)
│   │   ├── scanner/            # Scanner hub and result display
│   │   └── ui/                 # Reusable UI primitives
│   ├── lib/                    # Supabase clients, Stripe, rate limiter, utils
│   ├── services/               # Business logic and external API wrappers
│   ├── hooks/                  # Custom React hooks
│   ├── context/                # React context providers
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Auth and route protection middleware
├── .env.example                # Template for environment variables
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

---

### 👤 Author
**Wayne** — [github.com/wayne2604](https://github.com/wayne2604)
