# Frontend EWS Monitoring Media - TNI AD (Early Warning System)

Frontend antarmuka web modern dengan gaya **UI Glassmorphism** untuk sistem **EWS Monitoring Media & Isu Potensial TNI AD**, terintegrasi dengan backend FastAPI (`ews-be`) pada IP target `10.10.100.10:8000`.

## Fitur & Penyesuaian Terbaru (Update Commit `ea768ea`)

1. **Klasifikasi Alert Level 1–5**:
   - **Level 1**: Skor < 3 (Rendah / Informasi Awal)
   - **Level 2**: Skor 3–4 (Sedang-Rendah / Perhatian Ringan)
   - **Level 3**: Skor 5–6 (Sedang / Perlu Pemantauan)
   - **Level 4**: Skor 7–8 (Tinggi / Prioritas Penanganan Segera)
   - **Level 5**: Skor &ge; 9 (Kritis / Atensi Pimpinan Mabes)
   - Filter cepat level pada pusat radar alert dan integrasi parameter query `/api/alerts?level=...`.

2. **Dashboard & Radar Komando Utama**:
   - Status Uptime, Total Berita di-scrape, Total Alert, dan Isu Prioritas Tinggi (Level 4 & 5).
   - Kontrol langsung Scraper (Start, Stop, Scrape Sekarang) dengan indikator jadwal berikutnya.
   - Grafik distribusi Level 1 s.d. Level 5 secara visual.

3. **Pusat Radar Peringatan Dini (Alerts)**:
   - Filter instan level 1–5, kategori isu (`pelanggaran_hukum`, `kekerasan`, `ham`, `disiplin_internal`, `isu_viral`), dan pencarian teks.
   - Kolom tabel Level dan Skor numerik.
   - Modal detail inspeksi alert dan tautan ke artikel berita asli.

4. **Feed Berita Media & Arsip (Articles Explorer)**:
   - Filter berdasarkan wilayah kepulauan (Sumatra, Jawa, Kalimantan, Sulawesi, Bali-Nusra, Maluku-Papua, Nasional) dan media asal.
   - Mode tampilan ganda: Mode Tabel (*List*) & Mode Kartu (*Grid*).

5. **Radar Monitoring Regional Nusantara**:
   - Pemetaan visual 26 RSS Feed ANTARA per wilayah pulau dan komando teritorial (Kodam).

6. **Topologi Infrastruktur Sistem**:
   - Visualisasi arsitektur interaktif sesuai topologi: Ubuntu Host (10.10.100.1 / 10.10.100.10), Nginx 80/443, BIND9 DNS 53, Netdata 19999, Docker Bridge Network (172.20.0.0/24), Frontend 5173, Backend 8000, dan PostgreSQL 5432.

7. **Manajemen Operator & Hak Akses (CRUD User)**:
   - Pengelolaan akun petugas (*Administrator*, *Staff*, *Viewer*), status aktif/nonaktif akun, serta login/logout sesi.

8. **Pengaturan IP & Koneksi Backend**:
   - Pengaturan dinamis alamat target backend (default: `http://10.10.100.10:8000`).
   - Tombol pengujian koneksi (*Test Ping /api/status*) beserta informasi latensi ms.
   - Pilihan preset IP cepat (`10.10.100.10:8000`, `10.10.100.1:8000`, `localhost:8000`, dan Same-Origin Nginx).
   - Pengaturan interval auto-refresh data (15s, 30s, 60s, Nonaktif).

---

## Cara Menjalankan

### 1. Mode Pengembangan (Development)
```bash
cd ews-fe
npm install
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173` atau `http://10.10.100.10:5173`.

### 2. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` ke `.env`:
```env
VITE_API_BASE_URL=http://10.10.100.10:8000
```

### 3. Build Produksi
```bash
npm run build
```
Hasil build siap di-*deploy* berada di folder `dist/`.

### 4. Menjalankan via Docker
```bash
docker build -t ews-frontend:latest .
docker run -d --name ews-frontend -p 5173:5173 ews-frontend:latest
```
