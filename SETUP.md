# Setup Guide - IAT Agenda MPA

Panduan lengkap untuk setup dan deploy aplikasi MPA.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:
- [ ] Google Account (untuk Google Apps Script & Google Sheets)
- [ ] Text Editor atau IDE (VS Code, Sublime, etc)
- [ ] Web hosting / Server (Firebase, Netlify, Vercel, Apache, etc)
- [ ] HTTPS enabled (required untuk PWA)
- [ ] Basic knowledge of JavaScript & Google Apps Script

## 🔧 Step-by-Step Setup

### Step 1: Prepare Google Apps Script Backend

#### 1.1 Create Google Sheet
1. Buka [Google Drive](https://drive.google.com)
2. Create New → Google Sheet
3. Rename menjadi "IAT Agenda Database" atau nama pilihan
4. Buat sheet tabs dengan nama:
   - `Events` - menyimpan data event
   - `Registrations` - menyimpan data pendaftar
   - `Certificates` - menyimpan data sertifikat
   - `AkunAdmin` - menyimpan credentials admin

#### 1.2 Setup Sheet Structure

**Events Sheet:**
```
| ID | Nama | Tema | Tempat | Tanggal | Status |
| evt1 | Workshop Coding | Python | Zoom | 2026-05-15 | Aktif |
```

**Registrations Sheet:**
```
| ID | EventID | Nama | Email | WhatsApp | Institusi | Timestamp |
| reg1 | evt1 | John Doe | john@email.com | 08123456789 | PT ABC | 2026-05-01 10:30 |
```

**Certificates Sheet:**
```
| CertID | UserID | EventID | NamaEvent | Nama | Institusi | PDFUrl | Status |
| IAT-1234-ABCD | reg1 | evt1 | Workshop | John | PT ABC | https://... | Terkirim |
```

**AkunAdmin Sheet:**
```
| Email | Password |
| admin@email.com | password123 |
| admin2@email.com | password456 |
```

#### 1.3 Create Google Apps Script
1. Di Google Sheet, klik Extensions → Apps Script
2. Hapus semua code default
3. Copy-paste backend code dari template (lihat di bawah)
4. Klik Deploy → New Deployment
5. Select type: Web App
6. Execute as: Your account
7. Who has access: Anyone
8. Deploy & copy Script ID

**Copy Script ID from URL:**
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercache
                           ↑ SCRIPT_ID di sini ↑
```

### Step 2: Update Configuration

#### 2.1 Update SCRIPT_URL
Setiap file HTML, ganti baris:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Dengan URL yang sudah Anda deploy.

### Step 3: Upload to Hosting

#### Option A: Firebase Hosting (Recommended)
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Create project
firebase init hosting

# 4. Deploy
firebase deploy
```

#### Option B: Netlify
```bash
# 1. Drag & drop folder MPA ke Netlify
# atau gunakan Netlify CLI

netlify deploy --prod --dir=./MPA
```

#### Option C: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option D: Manual Upload (cPanel/Apache)
1. Zip folder MPA
2. Upload via FTP/cPanel File Manager
3. Extract di public_html directory
4. Configure HTTPS (SSL Certificate)

### Step 4: Configure HTTPS

**Penting:** PWA requires HTTPS

#### For Free HTTPS:
- Firebase Hosting: ✓ Automatic
- Netlify: ✓ Automatic
- Vercel: ✓ Automatic
- cPanel: Use Let's Encrypt (Auto)
- Apache: Use certbot

```bash
# Apache with Let's Encrypt
sudo apt-get install certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com
```

### Step 5: Verify Setup

#### 5.1 Check Manifest
1. Buka aplikasi di browser
2. DevTools (F12) → Application → Manifest
3. Verify manifest.json terbaca

#### 5.2 Check Service Worker
1. DevTools → Application → Service Workers
2. Service Worker harus "active and running"
3. Klik "Skip waiting" untuk update

#### 5.3 Check Cache
1. DevTools → Application → Cache Storage
2. Verify `iat-agenda-v1` cache ada

#### 5.4 Test API Connection
1. Buka Home page
2. Lihat di Network tab bahwa API calls berhasil
3. Check response status 200

#### 5.5 Lighthouse Audit
1. DevTools → Lighthouse
2. Run audit untuk PWA
3. Target score: 85+

### Step 6: Test Features

#### 6.1 Test Registration
1. Buka halaman home
2. Click event registration
3. Fill form & submit
4. Verify data di Google Sheet `Registrations`

#### 6.2 Test Certificate Validation
1. Di halaman home, scroll ke validasi
2. Input ID sertifikat yang ada
3. Verify data tampil

#### 6.3 Test Admin Panel
1. Buka login page
2. Input credentials dari `AkunAdmin` sheet
3. Verify dapat masuk ke dashboard
4. Test add event, manage peserta, distribute certificates

#### 6.4 Test Offline Mode
1. DevTools → Network → Offline
2. Refresh halaman
3. Verify halaman tetap accessible
4. Check cached version loading

#### 6.5 Test PWA Installation
1. Desktop: Click install icon di address bar
2. Mobile: Add to home screen
3. Verify app installed & accessible

### Step 7: Deploy to Production

#### Pre-deployment Checklist
- [ ] SCRIPT_URL updated dengan production ID
- [ ] HTTPS enabled
- [ ] manifest.json accessible
- [ ] All links working
- [ ] Forms tested
- [ ] Offline mode tested
- [ ] PWA installable
- [ ] Lighthouse score 85+
- [ ] Admin login tested

#### Deployment
```bash
# Build (if using bundler)
npm run build

# Deploy
firebase deploy
# atau netlify deploy --prod
# atau vercel
```

#### Post-deployment
- [ ] Test production URL
- [ ] Verify HTTPS
- [ ] Check Service Worker registered
- [ ] Monitor error logs
- [ ] Set up monitoring/analytics

## 🗄️ Google Apps Script Template

Berikut adalah template minimal Google Apps Script backend:

```javascript
// Global configuration
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ========================================
// API ROUTER
// ========================================

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    try {
        const action = e.parameter.action;
        let response;

        switch(action) {
            case 'getEvents':
                response = getEvents();
                break;
            case 'register':
                response = registerEvent(e.parameter);
                break;
            case 'validateCert':
                response = validateCertificate(e.parameter.certId);
                break;
            case 'login':
                response = adminLogin(e.parameter);
                break;
            case 'getAdminData':
                response = getAdminData();
                break;
            case 'addEvent':
                response = addEvent(e.parameter);
                break;
            case 'updateEventStatus':
                response = updateEventStatus(e.parameter);
                break;
            case 'sendCertificates':
                response = sendCertificates(e.parameter.eventId);
                break;
            default:
                response = { status: 'error', message: 'Action not found' };
        }

        return ContentService.createTextOutput(JSON.stringify(response))
            .setMimeType(ContentService.MimeType.JSON);
    } catch(error) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getSheet(sheetName) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}

function getEvents() {
    const sheet = getSheet('Events');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const events = [];

    for (let i = 1; i < data.length; i++) {
        events.push({
            id: data[i][0],
            nama: data[i][1],
            tema: data[i][2],
            tempat: data[i][3],
            tanggal: data[i][4],
            status: data[i][5]
        });
    }

    return { status: 'success', data: events };
}

function registerEvent(params) {
    try {
        const sheet = getSheet('Registrations');
        const id = 'REG-' + Date.now();
        const certId = 'IAT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        sheet.appendRow([
            id,
            params.eventId,
            params.nama,
            params.email,
            params.whatsapp,
            params.institusi,
            new Date()
        ]);

        return { status: 'success', certId: certId };
    } catch(error) {
        return { status: 'error', message: error.toString() };
    }
}

function validateCertificate(certId) {
    try {
        const sheet = getSheet('Certificates');
        const data = sheet.getDataRange().getValues();

        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === certId) {
                return {
                    status: 'success',
                    data: {
                        nama: data[i][4],
                        institusi: data[i][5],
                        namaEvent: data[i][3],
                        pdfUrl: data[i][6]
                    }
                };
            }
        }

        return { status: 'error', message: 'Sertifikat tidak ditemukan' };
    } catch(error) {
        return { status: 'error', message: error.toString() };
    }
}

function adminLogin(params) {
    try {
        const sheet = getSheet('AkunAdmin');
        const data = sheet.getDataRange().getValues();

        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === params.email && data[i][1] === params.password) {
                return { status: 'success' };
            }
        }

        return { status: 'error', message: 'Email atau password salah' };
    } catch(error) {
        return { status: 'error', message: error.toString() };
    }
}

// ========================================
// Continue with other functions...
// ========================================

function getAdminData() {
    const events = getEvents().data;
    const sheet = getSheet('Registrations');
    const data = sheet.getDataRange().getValues();
    const peserta = [];

    for (let i = 1; i < data.length; i++) {
        peserta.push({
            id: data[i][0],
            eventId: data[i][1],
            nama: data[i][2],
            email: data[i][3],
            whatsapp: data[i][4],
            institusi: data[i][5]
        });
    }

    return { status: 'success', events: events, peserta: peserta };
}

function addEvent(params) {
    try {
        const sheet = getSheet('Events');
        const id = 'EVT-' + Date.now();

        sheet.appendRow([
            id,
            params.namaEvent,
            params.temaEvent,
            params.tempat,
            params.tanggal,
            'Aktif'
        ]);

        return { status: 'success', eventId: id };
    } catch(error) {
        return { status: 'error', message: error.toString() };
    }
}

function updateEventStatus(params) {
    try {
        const sheet = getSheet('Events');
        const data = sheet.getDataRange().getValues();

        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === params.eventId) {
                sheet.getRange(i + 1, 6).setValue(params.status);
                return { status: 'success' };
            }
        }

        return { status: 'error', message: 'Event tidak ditemukan' };
    } catch(error) {
        return { status: 'error', message: error.toString() };
    }
}

function sendCertificates(eventId) {
    // Implement certificate generation & sending
    // This is a complex function - implement based on your needs
    return { status: 'success', message: 'Sertifikat berhasil dikirim' };
}
```

## 🔍 Troubleshooting Setup

### Manifest not loading
- [ ] Verify file di root folder
- [ ] Check file extension `.json` (bukan `.txt`)
- [ ] Verify HTTPS enabled
- [ ] Check JSON syntax (use validator)

### Service Worker not registered
- [ ] Check HTTPS enabled
- [ ] Verify service-worker.js di root
- [ ] Check browser console untuk errors
- [ ] Try hard refresh (Ctrl+Shift+R)

### API calls failing
- [ ] Verify SCRIPT_URL correct
- [ ] Check Apps Script published as Web App
- [ ] Verify CORS settings
- [ ] Check network tab untuk error details

### PWA not installable
- [ ] HTTPS required
- [ ] manifest.json must be valid
- [ ] Minimum size & icon requirements
- [ ] Wait 30+ seconds after first load
- [ ] Check DevTools Manifest tab

## 📝 Environment Variables (Optional)

Untuk security, bisa menggunakan environment variables:

```javascript
// In common-app.js
const SCRIPT_URL = process.env.SCRIPT_URL || 'https://script.google.com/macros/s/...';

// Build time configuration
const CONFIG = {
    API_URL: process.env.API_URL,
    ENV: process.env.NODE_ENV,
    VERSION: process.env.APP_VERSION
};
```

## ✅ Final Verification Checklist

Sebelum launch:
- [ ] All pages load without errors
- [ ] API connectivity working
- [ ] Forms submit successfully
- [ ] Admin login working
- [ ] Offline mode working
- [ ] PWA installable
- [ ] Mobile responsive
- [ ] Lighthouse score 85+
- [ ] No console errors
- [ ] Performance acceptable

## 🚀 Go Live!

Setelah semua verified:

1. Announce launch
2. Monitor error logs
3. Gather user feedback
4. Plan for improvements
5. Regular maintenance

---

**Questions?** Check README.md or DEVELOPMENT.md
