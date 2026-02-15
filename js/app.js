// Main Application Logic

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const editorSections = document.querySelectorAll('.editor-section');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active section
        editorSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
        
        // Save active tab to localStorage
        localStorage.setItem('activeTab', targetTab);
    });
});

// Restore last active tab
const lastActiveTab = localStorage.getItem('activeTab');
if (lastActiveTab) {
    const tabButton = document.querySelector(`[data-tab="${lastActiveTab}"]`);
    if (tabButton) {
        tabButton.click();
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S - Download/Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activeSection = document.querySelector('.editor-section.active');
        
        if (activeSection.id === 'pdf-editor') {
            const downloadBtn = document.getElementById('pdfDownload');
            if (downloadBtn && downloadBtn.style.display !== 'none') {
                downloadBtn.click();
            }
        } else if (activeSection.id === 'image-editor') {
            const downloadBtn = document.getElementById('imgDownload');
            if (downloadBtn && downloadBtn.style.display !== 'none') {
                downloadBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + Z - Undo (for image editor)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const activeSection = document.querySelector('.editor-section.active');
        if (activeSection.id === 'image-editor') {
            const undoBtn = document.getElementById('imgUndo');
            if (undoBtn && undoBtn.style.display !== 'none') {
                undoBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z - Redo (for image editor)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const activeSection = document.querySelector('.editor-section.active');
        if (activeSection.id === 'image-editor') {
            const redoBtn = document.getElementById('imgRedo');
            if (redoBtn && redoBtn.style.display !== 'none') {
                redoBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + T - Add text
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const activeSection = document.querySelector('.editor-section.active');
        
        if (activeSection.id === 'pdf-editor') {
            const addTextBtn = document.getElementById('pdfAddText');
            if (addTextBtn && addTextBtn.style.display !== 'none') {
                addTextBtn.click();
            }
        } else if (activeSection.id === 'image-editor') {
            const addTextBtn = document.getElementById('imgText');
            if (addTextBtn && addTextBtn.style.display !== 'none') {
                addTextBtn.click();
            }
        }
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Prevent zoom on double-tap for mobile (better UX for editing)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle page visibility for PWA
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('App is now visible');
    } else {
        console.log('App is now hidden');
    }
});

// Online/Offline status
window.addEventListener('online', () => {
    showToast('You are back online', 'success');
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 'warning', 5000);
});

// Install PWA prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button/notification
    showToast('Install this app for a better experience!', 'info', 10000);
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    showToast('App installed successfully!', 'success');
    deferredPrompt = null;
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    });
}

// Initialize app
console.log('PDF & Image Editor initialized');
showToast('Welcome to PDF & Image Editor!', 'success', 2000);
