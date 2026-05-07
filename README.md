# IAT Agenda

Aplikasi untuk sistem pendaftaran event dan validasi sertifikat Prodi Ilmu Al-Qur'an dan Tafsir dengan dukungan Progressive Web Apps (PWA).

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Struktur Folder](#struktur-folder)
- [Instalasi & Setup](#instalasi--setup)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Teknologi](#teknologi)
- [PWA Features](#pwa-features)
- [Troubleshooting](#troubleshooting)

## ✨ Fitur

### Untuk Publik
- 📅 **Daftar Event** - Lihat dan daftar pada event yang tersedia
- 🎓 **Validasi Sertifikat** - Verifikasi dan unduh sertifikat dengan CertID
- 📱 **Responsive Design** - Optimal di desktop, tablet, dan mobile
- 🌐 **Offline Support** - Akses halaman cached saat offline

### Untuk Admin
- 🛠️ **Dashboard Admin** - Kelola semua event dan pendaftar
- ➕ **Tambah Event** - Buat event baru dengan mudah
- 👥 **Manage Peserta** - Lihat data pendaftar dengan pagination
- 📧 **Distribusi Sertifikat** - Generate dan kirim PDF sertifikat massal
- 🔐 **Admin Authentication** - Login dengan email dan password

## 📁 Struktur Folder

```
AGENDA IAT/MPA/
├── index.html                      # Halaman utama (Home)
├── register.html                   # Halaman pendaftaran event
├── login.html                      # Halaman login admin
├── admin.html                      # Dashboard admin
│
├── manifest.json                   # PWA Manifest
├── service-worker.js               # Service Worker (Caching & Offline)
├── README.md                       # Dokumentasi ini
│
└── assets/
    ├── css/
    │   └── common-styles.css       # Styling umum (Tailwind utility classes)
    └── js/
        ├── common-app.js           # Shared API & UI utilities
        ├── home.js                 # (Optional) Home page logic
        ├── register.js             # (Optional) Register page logic
        ├── login.js                # (Optional) Login page logic
        └── admin.js                # (Optional) Admin page logic
```

## 🚀 Instalasi & Setup

### 1. Deploy ke Server/Hosting

MPA ini dapat di-host di:
- **Google Cloud Storage** (GCS)
- **Firebase Hosting**
- **Netlify**
- **Vercel**
- **Apache/Nginx Server**
- **GitHub Pages**

### 2. Konfigurasi Google Apps Script URL

Buka file HTML manapun dan cari baris:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Ganti `YOUR_SCRIPT_ID` dengan ID dari Google Apps Script Anda.

### 3. Setup PWA (Opsional tapi Direkomendasikan)

Untuk mengaktifkan PWA features:

- Pastikan domain menggunakan **HTTPS** (required untuk PWA)
- Semua file harus accessible (termasuk manifest.json)
- Service Worker akan otomatis teregister saat halaman dimuat

### 4. Verifikasi Setup

Buka DevTools (F12) → Application tab:
- ✓ Manifest file loaded
- ✓ Service Worker registered & active
- ✓ Cache storage bekerja

## 📖 Panduan Penggunaan

### Untuk End User

#### Halaman Home (index.html)
1. Lihat daftar event yang tersedia
2. Klik "Daftar Sekarang" pada event yang ingin diikuti
3. Isi form pendaftaran dengan data lengkap
4. Dapatkan ID Sertifikat setelah berhasil mendaftar

#### Validasi Sertifikat
1. Di halaman home, scroll ke bagian "Validasi Sertifikat"
2. Masukkan ID Sertifikat (CertID)
3. Klik "Cek" untuk verifikasi
4. Jika valid, download PDF sertifikat

### Untuk Admin

#### Login Admin
1. Buka halaman Admin Panel (tombol di navbar)
2. Gunakan email & password dari Sheet 'AkunAdmin'
3. Klik "Masuk Sistem"

#### Tab 1: Daftar Event
- Lihat semua event yang telah dibuat
- Buka/tutup pendaftaran event dengan button toggle

#### Tab 2: Data Pendaftar
1. Pilih event dari dropdown
2. Lihat daftar peserta dengan pagination
3. Klik "Distribusi Sertifikat" untuk generate & kirim PDF ke semua peserta

#### Tab 3: Tambah Event Baru
1. Isi form dengan data event
2. Klik "Simpan Event Baru"
3. Event otomatis muncul di halaman home

## 🛠️ Teknologi

### Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Tailwind CSS (via CDN)
- **JavaScript (Vanilla)** - Tanpa framework
- **Lucide Icons** - Icon library (via CDN)
- **Google Fonts** - Typography

### Backend Integration
- **Google Apps Script** - Untuk backend logic & database
- **Google Sheets** - Database

### PWA & Service Worker
- **Service Worker API** - Offline support & caching
- **Cache API** - Asset caching
- **Manifest API** - PWA installation

## 🌐 PWA Features

### Installation
- Install aplikasi di home screen (Android/iOS/Desktop)
- Akses seperti aplikasi native
- Custom splash screen

### Offline Support
- Halaman HTML di-cache untuk offline access
- Semua assets penting di-cache pada install
- Network-first strategy untuk local resources
- Cache-first strategy untuk external CDN

### Caching Strategy

| Resource Type | Strategy | Fallback |
|---|---|---|
| HTML pages | Network First | Cache |
| Local assets (CSS, JS) | Network First | Cache |
| External CDN | Cache First | Network |
| Google Apps Script | Network Only | Offline message |

### Push Notifications (Optional)
- Basic notification support sudah siap
- Dapat dikembangkan untuk real-time updates

## ⚙️ Konfigurasi & Customization

### Ubah Tema Warna

Edit di setiap file HTML, bagian `<script>`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: { 
                brand: { 
                    50: '#eff6ff',    // Lightest
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',   // Main color
                    900: '#1e3a8a'    // Darkest
                } 
            }
        }
    }
}
```

### Ubah Nama Aplikasi PWA

Edit `manifest.json`:

```json
{
  "name": "Nama Aplikasi Baru",
  "short_name": "Nama Pendek",
  "description": "Deskripsi aplikasi"
}
```

### Tambah Halaman Baru

1. Buat file HTML baru (misal: `about.html`)
2. Copy struktur dari `index.html`
3. Ubah content sesuai kebutuhan
4. Link ke navbar atau halaman lain
5. Service Worker otomatis cache file baru

## 🔐 Keamanan

### Best Practices
- ✓ Gunakan HTTPS untuk production
- ✓ Validasi input di backend (Google Apps Script)
- ✓ Jangan store password di localStorage/sessionStorage
- ✓ Gunakan sessionStorage untuk admin auth (cleared on browser close)
- ✓ CORS headers di Google Apps Script untuk security

### Admin Authentication
- Login credentials disimpan di Sheet 'AkunAdmin'
- Session validity disimpan di sessionStorage (temporary)
- Logout otomatis menghapus session

## 📊 Performance

### Optimasi Sudah Diterapkan
- ✓ Minimal external dependencies
- ✓ CSS dari Tailwind CDN (compressed)
- ✓ Icons dari Lucide (lightweight SVG)
- ✓ Service Worker caching
- ✓ Lazy loading images (manual)
- ✓ Responsive images

### Metrics Target
- Lighthouse Score: 85+
- First Contentful Paint: < 2s
- Time to Interactive: < 3.5s

## 🐛 Troubleshooting

### Service Worker Tidak Terdaftar

**Masalah:** SW tidak muncul di DevTools

**Solusi:**
```javascript
// Check di browser console
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
        console.log(regs);
    });
}
```

### Cache Tidak Update

**Masalah:** File lama masih di-cache

**Solusi:**
```javascript
// Clear cache lewat DevTools:
// 1. Application > Cache Storage > Klik kanan > Delete
// 2. Atau refresh halaman beberapa kali

// Atau programmatically:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister());
    });
    caches.delete('iat-agenda-v1');
}
```

### PWA Tidak Install

**Masalah:** Tombol install tidak muncul

**Solusi:**
- ✓ Pastikan HTTPS active
- ✓ Verify manifest.json accessible
- ✓ Check manifest syntax (gunakan validator online)
- ✓ Tunggu beberapa detik, tombol muncul setelah criteria terpenuhi

### Koneksi Google Apps Script Gagal

**Masalah:** API error "Koneksi gagal"

**Solusi:**
- ✓ Verify SCRIPT_URL correct
- ✓ Google Apps Script harus published as web app
- ✓ Check CORS settings di Apps Script
- ✓ Verify network connectivity

## 📱 Testing

### Desktop Testing
```bash
# Gunakan local server
python3 -m http.server 8000
# Akses http://localhost:8000
```

### Mobile Testing
```bash
# Install ngrok
ngrok http 8000

# Akses via mobile browser dengan HTTPS tunnel
https://xxx-yyy-zzz.ngrok.io
```

### DevTools Simulation
1. Chrome DevTools → Application tab
2. Gunakan offline mode
3. Test cache strategy
4. View manifest

## 📚 Resources

- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://www.w3.org/TR/appmanifest/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## 📝 Lisensi

Proprietary - Prodi Ilmu Al-Qur'an dan Tafsir

## 👨‍💻 Support

Untuk pertanyaan atau masalah, hubungi admin system atau development team.

---

**Last Updated:** Mei 2026
**Version:** 1.0.0 (MPA)
**Status:** Production Ready ✓
