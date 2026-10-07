# FleetTrack

> Fleet Tracking & Vehicle Location Management System

FleetTrack adalah aplikasi dashboard untuk membantu perusahaan memantau dan mengelola kendaraan operasional berdasarkan lokasi geografis secara real-time.

---

## Features

- 🗺️ **Interactive Map** — Tampilkan semua kendaraan pada peta OpenStreetMap menggunakan Leaflet
- 🚗 **Vehicle Management** — CRUD lengkap: tambah, lihat, edit, hapus kendaraan
- 📍 **Location Picker** — Klik peta untuk memilih koordinat kendaraan secara visual
- 🔍 **Search & Filter** — Cari berdasarkan plat, nama, atau driver; filter berdasarkan status dan tipe
- 📊 **Dashboard Summary** — Ringkasan total, active, idle, offline
- 🎨 **Status Markers** — Marker warna berbeda berdasarkan status (hijau/kuning/merah)
- 📱 **Responsive** — Mobile-friendly layout
- ✅ **Validation** — Frontend (Zod) + Backend (go-playground/validator)
- 🔔 **Toast Notifications** — Feedback visual untuk setiap aksi
- 💾 **Persistent Data** — PostgreSQL via GORM

---

## Tech Stack

### Frontend

| Library | Versi | Alasan |
|---|---|---|
| **React + TypeScript** | 18 + 5 | Component-based UI dengan type safety |
| **Vite** | 5 | Build tool modern, HMR cepat |
| **Tailwind CSS** | 3 | Utility-first styling yang konsisten dan responsive |
| **TanStack Query** | 5 | Server state management, caching, mutation, loading state |
| **React Hook Form** | 7 | Performant form management |
| **Zod** | 3 | Schema validation dengan TypeScript inference |
| **React Leaflet** | 4 | Integrasi peta React |
| **Leaflet** | 1.9 | Map library berbasis OpenStreetMap (gratis, tanpa API key) |
| **Zustand** | 5 | Lightweight global UI state (selected vehicle, modal states) |
| **Axios** | 1 | HTTP client dengan interceptor |
| **react-hot-toast** | 2 | Toast notifications |
| **Lucide React** | — | Icon library |

### Backend

| Library | Alasan |
|---|---|
| **Go** | Performa tinggi, concurrent, cocok untuk REST API |
| **Gin** | HTTP framework ringan dengan routing yang efisien |
| **GORM** | ORM yang mature, mendukung PostgreSQL, auto-migrate |
| **PostgreSQL** | Relational database cocok untuk data kendaraan terstruktur |
| **go-playground/validator** | Validasi struct dengan tag yang ekspresif |
| **google/uuid** | UUID sebagai primary key untuk keamanan |
| **joho/godotenv** | Loading environment variables dari `.env` |

### Map

| Library | Alasan |
|---|---|
| **Leaflet** | Open-source, tidak memerlukan API key berbayar |
| **OpenStreetMap** | Tile gratis, komunitas besar |

---

## Architecture

```text
fleettrack/
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── components/  # Reusable UI components
│       │   ├── ui/      # Generic: Modal, Badge, Skeleton
│       │   ├── map/     # FleetMap, MarkerIcon
│       │   └── vehicle/ # VehicleTypeIcon
│       ├── features/    # Feature-based modules
│       │   └── vehicles/
│       │       ├── api/        # API calls (vehicle.api.ts)
│       │       ├── components/ # VehicleForm, VehicleCard, etc.
│       │       ├── hooks/      # useVehicles, useCreateVehicle, etc.
│       │       ├── schemas/    # Zod schemas
│       │       └── types/      # TypeScript types
│       ├── pages/       # DashboardPage
│       ├── store/       # Zustand global state
│       └── lib/         # Utilities, API client
│
├── backend/           # Go + Gin + GORM
│   ├── cmd/server/    # Entry point (main.go)
│   └── internal/
│       ├── config/     # Environment config
│       ├── database/   # DB connection + migrations + seed
│       ├── handler/    # HTTP handlers
│       ├── middleware/ # CORS, logger, recovery
│       ├── model/      # GORM models + request types
│       ├── repository/ # Database queries
│       ├── service/    # Business logic
│       └── validator/  # Custom validation messages
│
├── docker-compose.yml
├── README.md
└── AGENT.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- PostgreSQL 14+ (atau Docker)

### 1. Database Setup

**Opsi A — Docker (recommended):**
```bash
docker-compose up -d
```

**Opsi B — PostgreSQL yang sudah terinstall:**

Buat database:
```sql
CREATE DATABASE fleettrack;
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
copy .env.example .env
# Edit .env sesuai konfigurasi database Anda

# Download dependencies
go mod download

# Jalankan server
go run ./cmd/server
```

Server akan berjalan di `http://localhost:8080`

Database akan di-migrate dan di-seed secara otomatis.

### 3. Frontend Setup

```bash
cd frontend

# Copy environment file
copy .env.example .env

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 4. Build Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
go build -o fleettrack ./cmd/server
./fleettrack
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/vehicles` | Get all vehicles (support filter & search) |
| `GET` | `/api/v1/vehicles/summary` | Get vehicle count summary |
| `GET` | `/api/v1/vehicles/:id` | Get vehicle by ID |
| `POST` | `/api/v1/vehicles` | Create new vehicle |
| `PUT` | `/api/v1/vehicles/:id` | Update vehicle |
| `DELETE` | `/api/v1/vehicles/:id` | Delete vehicle |

### Query Parameters (GET /vehicles)

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search by license plate, name, or driver |
| `status` | string | Filter by ACTIVE, IDLE, OFFLINE |
| `vehicleType` | string | Filter by CAR, VAN, TRUCK, PICKUP, MOTORCYCLE |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fields": {
      "latitude": "latitude must be between -90 and 90"
    }
  }
}
```

---

## Search Strategy

Search dilakukan secara **server-side** di backend menggunakan query SQL `LIKE`.

**Alasan:**
- Data bisa terus bertambah → client-side search tidak scalable
- Server sudah memiliki database index
- Menghindari transfer data besar ke client hanya untuk disaring

---

## Validation

### Frontend (Zod)
- `license_plate`: required, min 3 karakter
- `name`: required, min 3 karakter  
- `vehicle_type`: one of `CAR|VAN|TRUCK|PICKUP|MOTORCYCLE`
- `driver_name`: required
- `status`: one of `ACTIVE|IDLE|OFFLINE`
- `latitude`: required, -90 ≤ lat ≤ 90
- `longitude`: required, -180 ≤ lng ≤ 180

### Backend (go-playground/validator)
Backend melakukan validasi ulang yang identik menggunakan struct tags `validate:"..."` untuk mencegah bypass frontend validation.

---

## Workflow Penggunaan Agentic AI

Pada pengerjaan test ini, Agentic AI digunakan secara ekstensif (sebagai *pair-programmer* / *autonomous developer*). Berikut adalah sejauh mana AI dilibatkan dalam proses pengerjaan:

1. **Inisiasi & Setup Project**: AI membantu melakukan scaffolding struktur proyek (frontend & backend), serta setup konfigurasi `docker-compose.yml` untuk environment PostgreSQL.
2. **Pengembangan Backend (Go)**: AI menulis kode RESTful API secara utuh menggunakan arsitektur *repository pattern*, mengintegrasikan GORM untuk interaksi database, Gin untuk HTTP router, dan melakukan setup sistem seeder/migrasi.
3. **Pengembangan Frontend (React/Vite)**: AI membangun antarmuka pengguna, termasuk integrasi peta (*map*) menggunakan Leaflet, manajemen state dengan Zustand dan TanStack Query, serta setup validasi form secara *end-to-end* menggunakan Zod.
4. **Testing, Debugging, & Refactoring**: AI secara mandiri memverifikasi kode, mengeksekusi *command* di terminal untuk melihat log error, dan memperbaiki masalah seperti dependensi yang *missing* atau *typo* pada variabel.
5. **Dokumentasi & Version Control**: AI menyusun dokumentasi komprehensif (`README.md`) yang mencakup cara menjalankan aplikasi dan rasionalisasi library, serta menjalankan *command* Git untuk inisialisasi repositori dan push ke GitHub.

Secara keseluruhan, proses pengerjaan (*coding*, desain arsitektur, dan *troubleshooting*) dilakukan oleh Agentic AI dari hulu ke hilir (*end-to-end*), sedangkan *user* berperan sebagai pemberi instruksi (prompt), pengarah kebutuhan proyek, dan *reviewer*.

---

## Definition of Done

- [x] React + TypeScript berjalan
- [x] Go backend berjalan
- [x] PostgreSQL berjalan
- [x] Frontend dapat mengambil data dari backend
- [x] Kendaraan muncul di map
- [x] User dapat melihat detail kendaraan
- [x] User dapat menambahkan kendaraan
- [x] User dapat mengedit kendaraan
- [x] User dapat menghapus kendaraan
- [x] User dapat mengubah lokasi kendaraan
- [x] User dapat mencari kendaraan
- [x] User dapat filter kendaraan
- [x] Status kendaraan ditampilkan dengan jelas
- [x] Frontend validation tersedia
- [x] Backend validation tersedia
- [x] Loading state tersedia
- [x] Error state tersedia
- [x] Empty state tersedia
- [x] Responsive
- [x] Database menggunakan PostgreSQL
- [x] Seed data tersedia (10 kendaraan)
- [x] README tersedia
- [x] AGENT.md tersedia
- [x] `.env.example` tersedia
- [x] Project dapat dijalankan oleh developer lain

---

## License

MIT
