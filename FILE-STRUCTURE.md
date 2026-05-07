# File Structure Guide - IAT Agenda MPA

Penjelasan lengkap untuk setiap file dalam struktur MPA.

## 📁 Folder & File Tree

```
AGENDA IAT/MPA/
│
├── 📄 index.html                 # ⭐ Home Page - Event List & Certificate Validation
├── 📄 register.html              # ⭐ Registration Page - Event Registration Form
├── 📄 login.html                 # ⭐ Admin Login Page - Authentication
├── 📄 admin.html                 # ⭐ Admin Dashboard - Management Panel
│
├── 📄 manifest.json              # PWA Configuration & App Metadata
├── 📄 service-worker.js          # Service Worker - Offline & Caching Logic
│
├── 📄 README.md                  # 📖 User & Admin Documentation
├── 📄 SETUP.md                   # 🔧 Setup & Deployment Guide
├── 📄 DEVELOPMENT.md             # 👨‍💻 Developer Guide
├── 📄 FILE-STRUCTURE.md          # 📋 This File - File Descriptions
│
└── assets/
    │
    ├── css/
    │   └── common-styles.css     # 🎨 Global Styles & Tailwind Utilities
    │
    └── js/
        └── common-app.js         # 🔗 Shared API & UI Helper Functions
```

## 📄 File Descriptions

### HTML Pages (Entry Points)

#### 1. `index.html` (🎯 Main)
**Purpose:** Home page dengan dua fitur utama
- Event listing dengan filtering & search
- Certificate validation dengan download

**Key Sections:**
- Navbar dengan link ke admin
- Event grid (responsive 1-3 columns)
- Certificate validation form
- Global UI overlay & toast container

**JavaScript Logic:**
```javascript
const home = {
    events: [],
    loadEvents(),
    renderEvents(),
    openRegister(),
    validateCertificate()
}
```

**Dependencies:**
- common-app.js (API & UI)
- Tailwind CSS CDN
- Lucide Icons CDN

---

#### 2. `register.html`
**Purpose:** Halaman pendaftaran event
- Form untuk input data peserta
- Validasi input client-side
- Submit ke backend via API

**Key Sections:**
- Back button ke home
- Event info header (taken from URL params)
- Registration form (nama, email, WA, institusi)
- Submit button & loading state

**JavaScript Logic:**
```javascript
const register = {
    eventData: {},
    loadEventData(),      // Parse URL params
    submitRegistration()  // POST to API
}
```

**Flow:**
1. User click "Daftar" di home
2. Redirect ke register.html?eventId=xxx&...
3. loadEventData() parse URL params
4. User fill form
5. submitRegistration() → API.call('register')
6. Success → Redirect home

---

#### 3. `login.html`
**Purpose:** Admin authentication page
- Email & password input
- Credentials verification
- Session storage setelah login

**Key Sections:**
- Lock icon & title
- Email input
- Password input
- Login button

**JavaScript Logic:**
```javascript
const login = {
    handleLogin()  // Verify credentials & set session
}
```

**Flow:**
1. Admin visit login.html
2. Fill email & password
3. handleLogin() → API.call('login')
4. If success → sessionStorage.setItem('adminAuth', 'true')
5. Redirect to admin.html

---

#### 4. `admin.html` (🔐)
**Purpose:** Admin dashboard untuk manajemen event & peserta
- Tab navigation (Events, Peserta, Add Event)
- Event management (buka/tutup pendaftaran)
- Peserta data dengan pagination
- Add new event form
- Certificate distribution

**Key Sections:**
- Navbar dengan logout button
- Three tabs:
  1. **Daftar Event** - Table with toggle status
  2. **Data Pendaftar** - Table with dropdown event selector & pagination
  3. **Tambah Event Baru** - Form untuk create event
- Global overlay & notifications

**JavaScript Logic:**
```javascript
const admin = {
    // Authentication
    checkAuth(),
    logout(),
    
    // Data Loading
    loadAdminData(),
    
    // Tab Management
    switchTab(),
    
    // Events Management
    renderAdminEventsTable(),
    toggleEventStatus(),
    addEvent(),
    
    // Peserta Management
    renderAdminSelect(),
    renderPesertaTable(),
    changePage(),
    sendCertificates()
}
```

---

### Configuration & Service Files

#### 5. `manifest.json`
**Purpose:** PWA Manifest - aplikasi metadata & installasi config

**Key Properties:**
```json
{
  "name": "IAT Agenda & Pendaftaran",
  "short_name": "IAT Agenda",
  "description": "...",
  "start_url": "./index.html",
  "display": "standalone",          // App-like appearance
  "theme_color": "#2563eb",         // Taskbar color
  "background_color": "#ffffff",    // Splash screen
  "icons": [...],                   // App icons
  "shortcuts": [...]                // App shortcuts
}
```

**Usage:**
- Install app ke home screen
- Configure app appearance
- Define app shortcuts
- Enable PWA features

**When to Update:**
- Change app name/description
- Update colors
- Add new shortcuts
- Change icon

---

#### 6. `service-worker.js`
**Purpose:** Service Worker - offline support, caching, background sync

**Key Features:**
- Installation & caching
- Fetch interception
- Network-first/cache-first strategies
- Offline fallback
- Push notifications (optional)

**Caching Strategies:**
```javascript
// Local resources: Network First
// → Try network, fallback cache

// External CDN: Cache First
// → Try cache, fallback network

// Google Apps Script: Network Only
// → Always fetch from network

// 503 Offline: Return offline page
```

**When to Modify:**
- Add new pages
- Change caching strategy
- Update cache version
- Add new features

**Version Management:**
```javascript
const CACHE_NAME = 'iat-agenda-v1';
// Update to v2 when deploying major changes
```

---

### Documentation Files

#### 7. `README.md`
**Purpose:** Main documentation untuk users & admins

**Contents:**
- Feature overview
- Installation & setup
- User guide
- Admin guide
- PWA features
- Troubleshooting
- Resources

**Audience:** End users, admins, general public

---

#### 8. `SETUP.md`
**Purpose:** Complete setup & deployment guide

**Contents:**
- Prerequisites
- Step-by-step setup
- Google Apps Script template
- Hosting options
- Configuration
- Verification
- Troubleshooting

**Audience:** Developers, DevOps, deployment team

---

#### 9. `DEVELOPMENT.md`
**Purpose:** Developer guide untuk extending & maintaining

**Contents:**
- Architecture & design patterns
- API reference
- Component breakdown
- Data flow diagrams
- State management
- Testing strategy
- Deployment checklist
- Performance optimization

**Audience:** Developers, maintainers

---

#### 10. `FILE-STRUCTURE.md`
**Purpose:** This file - file descriptions & purposes

**Audience:** Anyone wanting to understand structure

---

### Assets

#### 11. `assets/css/common-styles.css`
**Purpose:** Global CSS utilities (Tailwind-like classes)

**Contents:**
- CSS variables (colors, spacing)
- Reset styles
- Typography
- Layout utilities
- Component styles
- Animations
- Responsive breakpoints

**Usage:**
```html
<div class="max-w-5xl mx-auto px-4 py-8 bg-white rounded-lg shadow-sm border border-slate-200">
```

**When to Modify:**
- Add new utility classes
- Update color scheme
- Add new components
- Adjust spacing/sizing

---

#### 12. `assets/js/common-app.js`
**Purpose:** Shared JavaScript utilities & API connector

**Sections:**

1. **API Connector**
```javascript
const api = {
    call(action, payload, method)  // Make API calls
}
```

2. **UI Helpers**
```javascript
const ui = {
    showLoading(),   // Show/hide loading overlay
    showToast(),     // Show notifications
    navigate()       // Navigate to page
}
```

3. **Utility Functions**
```javascript
const utils = {
    formatDate(),
    getUrlParam(),
    setUrlParam()
}
```

**Usage:**
```javascript
// In any HTML page
const res = await api.call('getEvents', {}, 'GET');
ui.showToast('Success!', 'success');
ui.navigate('admin.html');
```

**Dependencies:**
- Loaded in every HTML page
- Must load before page-specific scripts

---

## 🔄 Data Flow Between Files

### Registration Flow
```
index.html (home)
    ↓ User clicks "Daftar"
register.html (form)
    ↓ common-app.js → api.call('register')
Service Worker (pass through)
    ↓ Google Apps Script
Manifest.json (PWA metadata)
    ↓ Response back
common-app.js → ui.showToast()
index.html (redirect)
```

### Admin Flow
```
login.html
    ↓ common-app.js → api.call('login')
common-app.js → sessionStorage
admin.html (check auth)
    ↓ common-app.js → api.call('getAdminData')
Admin functions (manage events/peserta)
    ↓ common-app.js → api.call()
Google Apps Script
    ↓ Response
admin.html (render tables)
```

### Offline Flow
```
Any page
    ↓ Browser makes request
service-worker.js (fetch intercept)
    ↓ Check if online
    ├─ Online: Pass to network
    └─ Offline: Serve from cache/offline page
Browser display
```

## 🎯 Key Dependencies

### External Dependencies
- **Tailwind CSS** (CDN) - styling
- **Lucide Icons** (CDN) - icons
- **Google Fonts** (CDN) - typography

### Internal Dependencies
| File | Depends On |
|---|---|
| index.html | common-app.js, CSS, Icons |
| register.html | common-app.js, CSS, Icons |
| login.html | common-app.js, CSS, Icons |
| admin.html | common-app.js, CSS, Icons |
| service-worker.js | (none) |
| common-app.js | (none - vanilla JS) |
| manifest.json | (none) |

## 📊 File Size & Performance

**Estimated File Sizes:**
- index.html: ~8 KB
- register.html: ~5 KB
- login.html: ~4 KB
- admin.html: ~15 KB
- common-app.js: ~6 KB
- service-worker.js: ~8 KB
- manifest.json: ~2 KB
- common-styles.css: ~15 KB (minified)

**Total Uncompressed:** ~63 KB
**Total Gzipped:** ~15 KB

## 🔐 Security Considerations

**By File:**

| File | Security Notes |
|---|---|
| HTML files | No sensitive data, public facing |
| service-worker.js | No sensitive data, can be public |
| common-app.js | API URL public (ok for public endpoint) |
| manifest.json | Public configuration, no secrets |

**Sensitive Data:**
- ✗ Never store passwords in frontend
- ✗ Never store API keys in frontend
- ✓ Store in Google Apps Script backend
- ✓ Use HTTPS for all communication
- ✓ Validate on both client & server

## 🚀 Performance Optimization Tips

### Current Optimizations
- Single CSS file (common-styles.css)
- Minimal JavaScript (vanilla, no frameworks)
- SVG icons (no image files)
- Service Worker caching
- External CSS via CDN

### Further Optimization
- Inline critical CSS
- Defer non-critical JS
- Compress images (if any)
- Use WebP format
- Enable gzip compression on server
- Use CDN for static assets

---

**Last Updated:** Mei 2026
**Structure Version:** 1.0
