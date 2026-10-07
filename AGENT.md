# AGENT.md — AI-Assisted Development Documentation

## Project: FleetTrack
## Date: October 2026

---

## AI Tools Used

- **Google Antigravity (Gemini/Claude Sonnet 4.6 with Thinking)**
  - Digunakan sebagai agentic coding assistant melalui Antigravity IDE

---

## AI Usage Summary

Seluruh project FleetTrack dikembangkan dengan bantuan agentic AI secara ekstensif. Berikut bagian-bagian yang dibantu oleh AI:

### Project Scaffolding
- Setup struktur direktori frontend dan backend
- Inisialisasi Vite React TypeScript project
- Konfigurasi Tailwind CSS, PostCSS

### Backend (Go)
- Arsitektur layered: Handler → Service → Repository → Model
- GORM model dengan BeforeCreate hook untuk UUID
- Repository pattern dengan interface untuk testability
- Custom validator dengan pesan error yang informatif
- Seed data dengan 10 kendaraan di berbagai kota Indonesia
- Middleware CORS, logger, recovery
- REST API dengan HTTP status code yang benar
- Consistent error response format

### Frontend (React + TypeScript)
- Feature-based architecture (`src/features/vehicles/`)
- TanStack Query hooks (`useVehicles`, `useCreateVehicle`, dll.)
- Zustand store untuk global UI state (modal, selected vehicle)
- Zod schema untuk form validation
- React Hook Form integration dengan zodResolver
- Reusable components: Modal, ConfirmDialog, StatusBadge, Skeleton
- React Leaflet map dengan custom div icons per status
- Location picker dari map ke form
- Auto-fly map ke kendaraan yang dipilih
- Responsive layout (desktop sidebar + mobile stacked)
- Loading skeleton, error state, empty state

### Validation
- Zod schema yang mirror dengan backend validation rules
- Inline error messages di bawah setiap field

### Documentation
- README.md dengan setup guide lengkap
- API endpoint documentation
- Architecture overview
- Definition of Done checklist

---

## Human Oversight & Review

Meskipun AI menghasilkan sebagian besar kode, proses berikut tetap dilakukan secara manusiawi:

1. **Review arsitektur** — Memastikan pemisahan layer yang tepat (handler/service/repository)
2. **Review API contract** — Memastikan request/response format konsisten antara backend dan frontend
3. **Review validasi** — Memastikan validasi frontend dan backend sinkron
4. **Review UX** — Memastikan flow pengguna (add → list → map → detail → edit → delete) berjalan natural
5. **Testing manual** — Menguji setiap fitur end-to-end

---

## Rationale for AI Usage

AI digunakan karena:
- Project memiliki scope yang besar (full-stack, multi-layer)
- AI membantu menghasilkan boilerplate yang konsisten dan tidak repetitif
- AI membantu memastikan best practices (error handling, validation, CORS)
- Memungkinkan fokus lebih pada arsitektur dan UX daripada sintaks

---

## AI Limitations Encountered

- Perlu memverifikasi kompatibilitas versi library (TanStack Query v5 memiliki API berbeda dari v4)
- AI kadang generate kode yang perlu disesuaikan dengan requirement spesifik
- Perlu review manual untuk memastikan tidak ada credential yang hardcoded

---

> Dokumen ini dibuat secara jujur sesuai permintaan technical test.
> AI adalah alat; tanggung jawab kualitas kode tetap pada developer.
