// Utility Functions

// Show toast notification
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
}

// Show loading indicator
function showLoading(show = true) {
    const indicator = document.getElementById('loadingIndicator');
    if (show) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

// File reader helper
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// File reader as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Download file helper
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Drag and drop helper
function setupDragAndDrop(element, onFileDrop) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('dragover');
    });
    
    element.addEventListener('dragleave', () => {
        element.classList.remove('dragover');
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFileDrop(files);
        }
    });
    
    // Also handle click to upload
    element.addEventListener('click', (e) => {
        if (e.target === element || e.target.closest('.upload-area')) {
            const input = element.querySelector('input[type="file"]') || 
                         element.nextElementSibling;
            if (input && input.type === 'file') {
                input.click();
            }
        }
    });
}

// Convert canvas to blob
function canvasToBlob(canvas, type = 'image/png', quality = 0.95) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, type, quality);
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Validate file type
function validateFileType(file, allowedTypes) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    return allowedTypes.some(type => {
        if (type.includes('*')) {
            const baseType = type.split('/')[0];
            return fileType.startsWith(baseType);
        }
        return fileType === type || fileName.endsWith(type.replace(/.*\./, '.'));
    });
}

// Error handler
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    showToast(`Error: ${error.message || 'An unexpected error occurred'}`, 'error', 5000);
}

// Check browser compatibility
function checkBrowserCompatibility() {
    const features = {
        fileReader: typeof FileReader !== 'undefined',
        canvas: !!document.createElement('canvas').getContext,
        serviceWorker: 'serviceWorker' in navigator,
        indexedDB: 'indexedDB' in window
    };
    
    const unsupported = Object.entries(features)
        .filter(([, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (unsupported.length > 0) {
        console.warn('Unsupported features:', unsupported);
    }
    
    return unsupported.length === 0;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!checkBrowserCompatibility()) {
        showToast('Some features may not work in this browser. Please use a modern browser.', 'warning', 10000);
    }
});
