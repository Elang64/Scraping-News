# Frontend EWS Monitoring Media - TNI AD (Early Warning System)

Frontend antarmuka web modern dengan gaya **UI Glassmorphism** untuk sistem **EWS Monitoring Media & Isu Potensial TNI AD**, terintegrasi dengan backend FastAPI (`ews-be`) pada IP target `10.10.100.10:8000`.

## Fitur Utama

1. **Dashboard & Radar Komando Utama**:
   - Status Uptime, Total Berita di-scrape, Total Alert, dan Isu Kritis (Skor &ge; 6.0).
   - Kontrol langsung Scraper (Start, Stop, Scrape Sekarang) dengan indikator jadwal scrape berikutnya.
   - Distribusi tingkat resiko (Tinggi, Sedang, Rendah) & Berita terkini yang masuk.

2. **Pusat Radar Peringatan Dini (Alerts)**:
   - Pencarian real-time dan penyaringan berbasis kategori (`pelanggaran_hukum`, `kekerasan`, `ham`, `disiplin_internal`, `isu_viral`).
   - Filter tingkat skor severity (&ge; 6, 4-5.9, &lt; 4) dan status pengiriman Telegram Bot.
   - Modal inspeksi detail alert dengan penyorotan kata kunci (*matched keywords*), skor, dan tautan berita asli.

3. **Feed Berita Media & Arsip (Articles Explorer)**:
   - Filter berdasarkan wilayah kepulauan (Sumatra, Jawa, Kalimantan, Sulawesi, Bali-Nusra, Maluku-Papua, Nasional) dan media asal.
   - Tampilan ganda: Mode Tabel (*List*) & Mode Kartu (*Grid*).

4. **Radar Monitoring Regional Nusantara**:
   - Pemetaan visual 26 RSS Feed ANTARA per wilayah pulau dan komando teritorial (Kodam).

5. **Topologi Infrastruktur Sistem**:
   - Visualisasi arsitektur interaktif sesuai topologi final: Host Ubuntu, Nginx 80/443, BIND9 DNS 53, Netdata 19999, Docker Bridge Network (172.20.0.0/24), Frontend 5173, Backend 8000, PostgreSQL 5432, dan Telegram Notifier.

6. **Manajemen Operator & Hak Akses (CRUD User)**:
   - Pengelolaan akun petugas (*Administrator*, *Staff*, *Viewer*), status aktif/nonaktif akun, serta login/logout sesi.

7. **Konfigurasi IP & Koneksi Backend**:
   - Pengaturan dinamis alamat target backend (default: `http://10.10.100.10:8000`).
   - Tombol pengujian koneksi (*Test Ping /api/status*) dengan kalkulasi latensi ms.
   - Pilihan preset IP cepat (`10.10.100.10:8000`, `10.10.100.1:8000`, `localhost:8000`, dan Same-Origin Nginx).
   - Pengaturan interval auto-refresh data.

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
