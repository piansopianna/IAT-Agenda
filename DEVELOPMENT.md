# Development Guide - IAT Agenda MPA

Panduan untuk developer yang ingin mengembangkan, memelihara, atau extend aplikasi ini.

## 📐 Arsitektur & Design Pattern

### MPA Structure
```
Halaman → Common JS → API → Google Apps Script → Google Sheets
   ↓
   └─→ Common CSS → Tailwind CDN
   └─→ Service Worker → Cache Management
```

### Flow Diagrama

#### 1. User Flow (Registration)
```
Home Page → Click "Daftar" → Register Page → Submit → API Call
↓
Google Apps Script → Google Sheets → Response → Toast Notification → Home
```

#### 2. Admin Flow (Data Management)
```
Login Page → Verify Credentials → Session Storage → Admin Dashboard
↓
Load Data → API Call → Google Sheets → Render Tables → Manage Data
```

#### 3. Offline Flow
```
User Offline → Service Worker Intercepts → Cache Match → Serve Cached Response
```

## 🗂️ File Organization Best Practice

### Current Structure (Minimal)
```
MPA/
├── index.html              # Combined template + logic
├── register.html           # Combined template + logic
├── login.html              # Combined template + logic
├── admin.html              # Combined template + logic
├── manifest.json
├── service-worker.js
├── README.md
├── DEVELOPMENT.md
└── assets/
    ├── css/
    │   └── common-styles.css
    └── js/
        └── common-app.js
```

### Future Modular Structure (Recommended for Scale)
```
MPA/
├── index.html
├── register.html
├── login.html
├── admin.html
├── manifest.json
├── service-worker.js
│
├── assets/
│   ├── css/
│   │   ├── common-styles.css
│   │   ├── components.css      # Button, Card, Form styles
│   │   └── themes.css          # Color schemes
│   │
│   └── js/
│       ├── common-app.js       # API & UI utilities
│       ├── modules/            # Page-specific modules
│       │   ├── home.js
│       │   ├── register.js
│       │   ├── login.js
│       │   └── admin.js
│       ├── utils/              # Utility functions
│       │   ├── date-utils.js
│       │   ├── validation.js
│       │   └── storage.js
│       └── constants.js        # Global constants
│
└── docs/
    ├── README.md
    ├── DEVELOPMENT.md
    ├── API-REFERENCE.md        # API endpoints
    └── CHANGELOG.md            # Version history
```

## 🔌 API Reference

### Backend Requirements

Aplikasi ini membutuhkan Google Apps Script dengan endpoint berikut:

#### 1. `getEvents` (GET)
**Purpose:** Fetch active events
```javascript
{
    "status": "success",
    "data": [
        {
            "id": "evt123",
            "nama": "Workshop Coding",
            "tema": "Python Basics",
            "tempat": "Zoom",
            "tanggal": "2026-05-15",
            "status": "Aktif"
        }
    ]
}
```

#### 2. `register` (POST)
**Purpose:** Register user untuk event
```javascript
{
    "eventId": "evt123",
    "nama": "John Doe",
    "email": "john@email.com",
    "whatsapp": "08123456789",
    "institusi": "PT ABC"
}

// Response
{
    "status": "success",
    "certId": "IAT-1234-ABCD"
}
```

#### 3. `validateCert` (POST)
**Purpose:** Validate & get certificate data
```javascript
{
    "certId": "IAT-1234-ABCD"
}

// Response
{
    "status": "success",
    "data": {
        "nama": "John Doe",
        "institusi": "PT ABC",
        "namaEvent": "Workshop Coding",
        "pdfUrl": "https://drive.google.com/..."
    }
}
```

#### 4. `login` (POST)
**Purpose:** Admin authentication
```javascript
{
    "email": "admin@email.com",
    "password": "password123"
}

// Response
{
    "status": "success"  // or error
}
```

#### 5. `getAdminData` (GET)
**Purpose:** Fetch events & registrations data
```javascript
{
    "status": "success",
    "events": [ /* array of events */ ],
    "peserta": [ /* array of registrations */ ]
}
```

#### 6. `addEvent` (POST)
**Purpose:** Create new event
```javascript
{
    "namaEvent": "Seminar Digital",
    "temaEvent": "Marketing Strategy",
    "tempat": "Hotel XYZ",
    "tanggal": "2026-06-01"
}

// Response
{ "status": "success", "eventId": "evt456" }
```

#### 7. `updateEventStatus` (POST)
**Purpose:** Toggle event status (Aktif/Tutup)
```javascript
{
    "eventId": "evt123",
    "status": "Tutup"
}

// Response
{ "status": "success" }
```

#### 8. `sendCertificates` (POST)
**Purpose:** Generate & send certificates to all participants
```javascript
{
    "eventId": "evt123"
}

// Response
{
    "status": "success",
    "message": "Berhasil mengirim 25 sertifikat!"
}
```

## 🧩 Component Breakdown

### Common Components

#### Toast Notification
```javascript
ui.showToast("Pendaftaran berhasil!", 'success'); // or 'error'
```

#### Loading Overlay
```javascript
ui.showLoading(true, "Memproses...");
// ... do work ...
ui.showLoading(false);
```

#### Navigation
```javascript
ui.navigate("index.html");
// atau
ui.navigate("register.html?eventId=evt123");
```

### Utility Functions
```javascript
// Format date
utils.formatDate("2026-05-15");  // 15 Mei 2026
utils.formatDateShort("2026-05-15");  // 15/05/2026

// URL parameters
const eventId = utils.getUrlParam('eventId');
utils.setUrlParam('eventId', 'evt123');
```

## 🔄 Data Flow

### Registration Flow
```
1. User fill form in register.html
   ↓
2. submitRegistration() → api.call('register', payload)
   ↓
3. POST to SCRIPT_URL with URLSearchParams
   ↓
4. Google Apps Script processes & saves to Sheet
   ↓
5. Returns response with certId
   ↓
6. Toast notification + redirect to home
```

### Admin Dashboard Flow
```
1. Admin login via login.html
   ↓
2. Credentials verified via api.call('login', payload)
   ↓
3. sessionStorage.setItem('adminAuth', 'true')
   ↓
4. Redirect to admin.html
   ↓
5. admin.checkAuth() verify sessionStorage
   ↓
6. Load data via api.call('getAdminData')
   ↓
7. Render tables with data
```

## 📦 State Management

### Current Approach (No Framework)
```javascript
// State stored in module-level variables
const home = {
    events: [],
    // methods...
};

const register = {
    eventData: {},
    // methods...
};

const admin = {
    events: [],
    allPeserta: [],
    pesertaPage: 1,
    // methods...
};
```

### For Larger Projects - Consider
- IndexedDB for client-side persistence
- Custom state management library
- Or migrate to Vue/React for reactive state

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Test on Chrome/Firefox/Safari/Edge
- [ ] Test on mobile (iOS/Android)
- [ ] Test offline mode (DevTools > Offline)
- [ ] Test PWA installation
- [ ] Test all forms with valid/invalid input
- [ ] Test pagination
- [ ] Test all navigation links

### Automated Testing (Future)
```bash
# Setup
npm install --save-dev jest @testing-library/html

# Test examples
// tests/api.test.js
describe('API Calls', () => {
    test('getEvents returns array', async () => {
        const res = await api.call('getEvents');
        expect(Array.isArray(res.data)).toBe(true);
    });
});
```

## 🚀 Deployment Checklist

### Before Production
- [ ] Update SCRIPT_URL dengan production ID
- [ ] Verify HTTPS enabled
- [ ] Test manifest.json validity
- [ ] Run Lighthouse audit
- [ ] Check all links & forms working
- [ ] Verify offline mode
- [ ] Test admin login workflow
- [ ] Check database connectivity
- [ ] Monitor error logs

### Deployment Steps
1. Build/optimize assets (minify if needed)
2. Upload to hosting (Firebase, Netlify, etc)
3. Configure DNS & HTTPS
4. Test on production URL
5. Submit to app stores (PWA install)

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Gather user feedback
- [ ] Plan for updates

## 🔧 Common Customizations

### Change Color Scheme
File: Each HTML file
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: { 
                brand: { 
                    600: '#YOUR_COLOR_HEX'
                } 
            }
        }
    }
}
```

### Add New Page
1. Create `newpage.html` (copy structure from index.html)
2. Add link in navbar
3. Update service-worker.js STATIC_ASSETS array (optional)

### Add Form Validation
```javascript
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (!validateEmail(email)) {
    ui.showToast('Email tidak valid', 'error');
    return;
}
```

### Store Additional Data
```javascript
// Use sessionStorage for temporary (cleared on close)
sessionStorage.setItem('userData', JSON.stringify(data));
const userData = JSON.parse(sessionStorage.getItem('userData'));

// Use localStorage for persistent (cleared manually)
localStorage.setItem('userPreferences', JSON.stringify(prefs));

// Use IndexedDB for large datasets
// (recommended untuk aplikasi kompleks)
```

## 📊 Performance Optimization Tips

### Current Optimizations
- ✓ Minimal JS (vanilla, no framework)
- ✓ External CSS via Tailwind CDN
- ✓ SVG icons (no image files)
- ✓ Service Worker caching
- ✓ Lazy-loaded images

### Further Optimization
1. **Image Optimization**
   ```html
   <img src="image.webp" alt="description"
        loading="lazy" width="400" height="300">
   ```

2. **Code Splitting** (if using bundler)
   ```javascript
   // Only load admin.js on admin.html
   if (window.location.pathname === '/admin.html') {
       import('./assets/js/admin.js');
   }
   ```

3. **Preloading Critical Resources**
   ```html
   <link rel="preload" href="/assets/js/common-app.js" as="script">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   ```

## 🐛 Debugging Tips

### Common Issues & Solutions

#### 1. API calls failing
```javascript
// Add console logs
const res = await api.call('getEvents');
console.log('API Response:', res);
console.log('Status:', res.status);
```

#### 2. Service Worker not updating
```javascript
// Force update
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => {
        reg.update();
    });
});
```

#### 3. Cache issues
```javascript
// Clear all caches
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});
```

#### 4. Session expired
```javascript
// Check if user still authenticated
if (!sessionStorage.getItem('adminAuth')) {
    ui.navigate('login.html');
}
```

## 🚦 Version Management

### Current Version: 1.0.0 (MPA)

### Versioning Strategy
```
1.0.0
│ │ └─ Patch (bug fixes, small changes)
│ └─── Minor (new features, backward compatible)
└───── Major (breaking changes)
```

### Update Checklist
- [ ] Update service-worker.js version (CACHE_NAME)
- [ ] Update manifest.json (version in name optional)
- [ ] Document changes in CHANGELOG.md
- [ ] Tag release in git
- [ ] Notify users of updates

## 📚 Resources for Further Learning

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev Best Practices](https://web.dev/)
- [Service Worker Recipes](https://serviceworke.rs/)
- [PWA Developers](https://www.pwabuilders.com/)
- [Vanilla JS Guide](https://vanillajsacademy.com/)

## 🤝 Contributing

### Code Style
- Use 4 spaces for indentation
- Use camelCase for variables/functions
- Use CONSTANT_CASE for constants
- Comment complex logic
- Keep functions focused & DRY

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Commit with clear messages
git commit -m "feat: add new feature description"

# Push & create PR
git push origin feature/new-feature
```

### Commit Message Format
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add/update tests
chore: maintenance tasks
```

---

**Last Updated:** Mei 2026
**For Questions:** Contact development team
