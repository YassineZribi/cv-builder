# CV Builder

A premium, multilingual CV / résumé editor built with Next.js. Create, edit, and export professional CVs directly in the browser — no account required.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)

---

## Features

- **Live preview** — see your CV update in real time as you type
- **PDF export** — generate a print-ready PDF with one click
- **JSON import / export** — save and restore your CV data
- **3 templates** — Modern, Classic, Minimal, each with distinct styling
- **2 CV formats** — Canadian Resume and European (Europass)
- **9 sections** — Personal Info, Summary, Experience, Education, Skills, Languages, Certifications, Projects, References
- **Section manager** — show or hide any section
- **Drag-and-drop reordering** — reorder entries within any section
- **Multilingual** — English and French UI + CV labels
- **Autosave** — automatically saves to `localStorage` with a 1-second debounce
- **Dark / Light mode** — via `next-themes`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| State | Zustand 5 (with Immer, persist middleware) |
| PDF | @react-pdf/renderer 4 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Validation | Zod 4 |
| Icons | Hugeicons |
| Package Manager | pnpm |

---

## Project Structure

```
cv-builder/
├── app/
│   ├── layout.tsx               # Root layout (fonts, providers)
│   ├── page.tsx                 # Redirects to /{locale}/editor
│   └── [locale]/
│       ├── layout.tsx           # Locale validation & static params
│       ├── page.tsx             # Redirects to /{locale}/editor
│       └── editor/
│           └── page.tsx         # Main editor page
│
├── components/
│   ├── editor/
│   │   ├── panels/
│   │   │   ├── form-panel.tsx   # Tabbed section editors
│   │   │   ├── preview-panel.tsx
│   │   │   └── section-manager.tsx  # Show/hide sections
│   │   └── sections/            # One editor component per section
│   ├── preview/
│   │   └── cv-preview.tsx       # Live HTML preview (A4)
│   └── shared/
│       ├── import-dialog.tsx
│       └── export-dialog.tsx
│
├── dictionaries/
│   ├── en/
│   │   ├── ui.json              # UI labels (English)
│   │   └── cv.json              # CV labels, months, validation messages
│   └── fr/
│       ├── ui.json              # UI labels (French)
│       └── cv.json              # CV labels (French)
│
├── hooks/
│   ├── use-pdf-export.ts        # PDF generation hook
│   ├── use-autosave.ts          # Autosave to localStorage
│   └── use-mobile.ts
│
├── lib/
│   ├── cv/
│   │   └── schema.ts            # Zod schemas, types, DEFAULT_SECTIONS
│   ├── i18n/
│   │   ├── config.ts            # Locales config
│   │   └── dictionaries.ts      # Dictionary loader
│   ├── pdf/
│   │   ├── cv-document.tsx      # react-pdf document component
│   │   └── generator.tsx        # PDF generation & download
│   ├── store/
│   │   └── cv-store.ts          # Zustand store (state + actions)
│   └── templates/
│       └── themes.ts            # Per-template color/font/spacing config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install & run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/en/editor`.

### Build for production

```bash
pnpm build
pnpm start
```

---

## CV Sections

| Section | Key fields |
|---|---|
| Personal Info | Name, title, photo, contact links (email, phone, LinkedIn, GitHub, …) |
| Summary | Professional summary paragraph |
| Work Experience | Company, position, dates, description, achievements |
| Education | Institution, degree, field, grade |
| Skills | Name, level (Beginner → Expert), category |
| Languages | Name, CEFR proficiency (A1 → C2, Native) |
| Certifications | Name, issuer, dates, credential ID & URL |
| Projects | Name, description, technologies, dates, URL |
| References | Name, position, company, contact, relationship |

All sections except Personal Info can be hidden via the **Section Manager**.

---

## Templates

| Template | Header | Fonts | Style |
|---|---|---|---|
| **Modern** | Full-bleed dark (gray-900) with blue accents | Helvetica | Bold, high contrast |
| **Classic** | White with bottom border | Times New Roman | Traditional, serif |
| **Minimal** | White, no border | Helvetica | Clean, spacious |

---

## CV Formats

| Format | Description |
|---|---|
| **Canadian Resume** | Standard North-American résumé |
| **European (Europass)** | Includes photo, date of birth, nationality, gender |

---

## Internationalization

The app is fully translated in **English** and **French**. The active locale is encoded in the URL:

```
/en/editor   →  English
/fr/editor   →  French
```

All validation messages, CV labels, month names, date separators, and UI strings are dictionary-driven — nothing is hardcoded.

---

## State Management

The Zustand store (`lib/store/cv-store.ts`) is persisted to `localStorage` under the key `cv-builder-storage`. It exposes actions for every CV operation:

- `updatePersonalInfo` / `updateContact`
- `addExperience` / `updateExperience` / `removeExperience` / `reorderExperience`
- *(same pattern for Education, Skills, Languages, Certifications, Projects, References)*
- `toggleSection` / `reorderSections`
- `setTemplate` / `setFormat` / `setLocale`
- `resetCV` / `setCV`

---

## PDF Export

PDFs are generated client-side via `@react-pdf/renderer`. The exported document:

- Applies the selected template's colors, fonts, and spacing
- Renders all visible sections in their configured order
- Uses localized month names and date separators
- Disables automatic hyphenation for clean word-wrapping
- Includes Europass fields (photo, DOB, nationality) when the European format is active
- Filename format: `{FirstName}_{LastName}_{YYYY-MM-DD}.pdf`

