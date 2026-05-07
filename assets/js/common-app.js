// ========================================
// COMMON APP - Shared API & UI Helpers
// IAT Agenda MPA
// ========================================

// ⚠️ GANTI SCRIPT_URL INI DENGAN URL WEB APP MILIK ANDA
const SCRIPT_URL = 'https://script.google.com/macros/s/......................../exec';

// ========================================
// API CONNECTOR
// ========================================

const api = {
    call: async (action, payload = {}, method = 'POST') => {
        try {
            if (method === 'GET') {
                const res = await fetch(`${SCRIPT_URL}?action=${action}`);
                return await res.json();
            }

            const formData = new URLSearchParams();
            formData.append('action', action);
            
            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });

            const res = await fetch(SCRIPT_URL, { 
                method: 'POST', 
                body: formData 
            });
            return await res.json();
        } catch (error) {
            console.error("API Error:", error);
            return { status: 'error', message: 'Koneksi gagal. Periksa jaringan/URL.' };
        }
    }
};

// ========================================
// UI HELPERS - LOADING
// ========================================

const ui = {
    showLoading: (show = true, text = 'Memproses...') => {
        const el = document.getElementById('overlay-loading');
        if (!el) return;
        
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.innerText = text;
        
        if (show) {
            el.classList.remove('hidden');
            el.classList.add('flex');
        } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    },

    // ========================================
    // UI HELPERS - TOAST NOTIFICATIONS
    // ========================================

    showToast: (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        const isError = type === 'error';
        const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
        const borderColor = isError ? 'border-red-200' : 'border-green-200';
        const iconColor = isError ? 'text-red-500' : 'text-green-500';
        const iconName = isError ? 'alert-circle' : 'check-circle';

        toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} ${borderColor} shadow-sm toast-enter`;
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor}"></i>
            <p class="text-sm font-medium text-slate-800">${message}</p>
        `;
        container.appendChild(toast);
        
        // Initialize Lucide icons for this toast
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: toast });
        }

        setTimeout(() => { toast.classList.remove('toast-enter'); toast.classList.add('toast-active'); }, 10);
        setTimeout(() => {
            toast.classList.remove('toast-active');
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ========================================
    // UI HELPERS - NAVIGATION
    // ========================================

    navigate: (page) => {
        window.location.href = page;
    }
};

// ========================================
// GLOBAL OVERLAY & TOAST CONTAINER SETUP
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Create loading overlay if not exists
    if (!document.getElementById('overlay-loading')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay-loading';
        overlay.className = 'fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 hidden flex-col items-center justify-center';
        overlay.innerHTML = `
            <i data-lucide="loader-2" class="w-10 h-10 text-white animate-spin mb-3"></i>
            <p id="loading-text" class="text-white font-medium text-sm text-center whitespace-pre-line">Memproses...</p>
        `;
        document.body.appendChild(overlay);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: overlay });
        }
    }

    // Create toast container if not exists
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3';
        document.body.appendChild(toastContainer);
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

const utils = {
    formatDate: (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    formatDateShort: (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('id-ID');
    },

    getUrlParam: (param) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    },

    setUrlParam: (key, value) => {
        const params = new URLSearchParams(window.location.search);
        params.set(key, value);
        window.history.replaceState({}, '', `?${params.toString()}`);
    }
};
