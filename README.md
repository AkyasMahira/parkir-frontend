# Parkir Frontend

Aplikasi antarmuka pengguna (frontend) untuk sistem manajemen parkir yang modern dan responsif. Dibangun menggunakan teknologi web terbaru seperti **Next.js 16**, **React 19**, dan **Tailwind CSS v4** untuk memberikan pengalaman pengguna yang cepat dan mulus bagi Admin, Petugas, maupun Pemilik (Owner).

Project ini berkomunikasi dengan [Parkir Backend API](https://github.com/username/parkir-backend) untuk pengelolaan data.

## 🚀 Fitur Utama

Berdasarkan struktur halaman (`src/app`), aplikasi ini memiliki fitur berbasis peran (Role-Based):

* **Autentikasi**: Halaman Login terintegrasi dengan sistem token (Bearer Auth).
* **Dashboard Admin**:
    * Manajemen User (CRUD Pengguna).
    * Manajemen Tarif Parkir.
    * Manajemen Area/Lokasi Parkir.
    * Melihat Log Aktivitas Sistem.
* **Dashboard Petugas**:
    * Pencatatan Transaksi (Parkir Masuk & Keluar).
    * Melihat Riwayat Transaksi.
* **Dashboard Owner**:
    * Monitoring ringkasan operasional.

## 🛠 Teknologi yang Digunakan

Project ini dibangun dengan stack teknologi modern:

* **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router)
* **Library UI**: [React 19](https://react.dev/)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Linting**: ESLint

## 📋 Prasyarat Instalasi

Pastikan Anda telah menginstal:

* [Node.js](https://nodejs.org/) (Versi LTS disarankan, min v20 untuk Next.js 16).
* [npm](https://www.npmjs.com/) atau package manager lain (yarn/pnpm/bun).

## ⚙️ Cara Instalasi & Menjalankan

Ikuti langkah berikut untuk menjalankan aplikasi di komputer lokal:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/parkir-frontend.git](https://github.com/username/parkir-frontend.git)
    cd parkir-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Koneksi API**
    Secara default, konfigurasi API mengarah ke `http://parkir-backend.test/api` (lihat `src/lib/axios.ts`).
    
    Disarankan untuk membuat file `.env.local` untuk konfigurasi yang fleksibel:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
    *(Catatan: Anda mungkin perlu menyesuaikan `src/lib/axios.ts` agar membaca dari `process.env.NEXT_PUBLIC_API_URL`)*.

4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```

5.  **Buka Aplikasi**
    Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## 📂 Susunan Project

Struktur direktori utama menggunakan **App Router** Next.js:

```text
parkir-frontend/
├── src/
│   ├── app/
│   │   ├── admin/          # Halaman khusus Admin (Users, Tarif, Logs)
│   │   ├── owner/          # Halaman khusus Owner
│   │   ├── petugas/        # Halaman Transaksi & Riwayat Petugas
│   │   ├── login/          # Halaman Login
│   │   └── page.tsx        # Landing Page
│   ├── components/
│   │   ├── layouts/        # Layout Dashboard, dll
│   │   └── ui/             # Komponen Reusable (Button, Input, Navbar)
│   ├── hooks/              # Custom Hooks (useAuth)
│   ├── lib/
│   │   └── axios.ts        # Konfigurasi Axios & Interceptors
│   └── types/              # Definisi Tipe TypeScript
├── public/                 # Aset Statis (Gambar/SVG)
├── package.json            # Dependensi Project
└── next.config.ts          # Konfigurasi Next.js

```

## 🔧 Scripts

Berikut adalah perintah standar yang tersedia di `package.json`:

* `npm run dev`: Menjalankan server development (Hot Reloading).
* `npm run build`: Membuild aplikasi untuk produksi.
* `npm run start`: Menjalankan server produksi setelah build.
* `npm run lint`: Menjalankan pemeriksaan kode dengan ESLint.

## 🤝 Kontribusi

Jika Anda ingin berkontribusi:

1. Fork repository ini.
2. Buat branch fitur (`git checkout -b fitur-baru`).
3. Commit perubahan (`git commit -m 'Menambah fitur UI baru'`).
4. Push ke branch (`git push origin fitur-baru`).
5. Buat Pull Request.

## 📄 Lisensi

Project ini dilisensikan di bawah **MIT License**.
