# PDF & Image Editor 📄🖼️

A modern, feature-rich web application for editing PDFs and images - all in your browser! Built as a Progressive Web App (PWA) with no backend required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![PWA](https://img.shields.io/badge/PWA-ready-orange.svg)

## ⚡ Quick Start

**Get started in 30 seconds:**

1. **Download or clone this repository**
2. **Open `index.html` in your web browser** (double-click the file)
3. **Start editing!** Drag & drop a PDF or image file to begin

**That's it!** No installation, no setup, no account needed. Everything runs in your browser.

> 💡 **New to this app?** Check out the [detailed usage guide](USAGE.md) for step-by-step tutorials.

## 🌟 Features

### PDF Editor

- **📤 Upload & View PDFs** - Drag-and-drop or file picker to upload PDFs
- **✍️ Add Text Annotations** - Add text overlays with customizable font, size, and color
- **🔗 Merge PDFs** - Combine multiple PDFs into a single document
- **✂️ Split PDFs** - Extract specific pages into a new document
- **🔄 Rotate Pages** - Rotate individual pages (90°, 180°, 270°)
- **📋 Reorder Pages** - Drag-and-drop to rearrange pages
- **🗑️ Delete Pages** - Remove unwanted pages from PDFs
- **💾 Download** - Save your edited PDF

### Image Editor

- **📤 Upload Images** - Support for PNG, JPG, WEBP, BMP, GIF
- **✂️ Crop** - Select and crop regions of your image
- **📏 Resize** - Change dimensions with aspect ratio lock
- **🔄 Rotate & Flip** - Rotate (90° increments) and flip (horizontal/vertical)
- **🎨 Filters & Adjustments** - Brightness, contrast, saturation, blur, grayscale, sepia, invert
- **✏️ Draw / Annotate** - Freehand drawing with customizable brush
- **✍️ Add Text** - Text overlays with customization options
- **⬜ Add Shapes** - Rectangles, circles, lines, and arrows
- **↩️ Undo/Redo** - Full history for all edits
- **💾 Download** - Export in PNG, JPG, or WEBP format

### UI/UX Features

- **🌓 Dark/Light Theme** - Toggle between themes with persistent preference
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **📑 Tab Navigation** - Separate sections for PDF and Image editing
- **🎯 Intuitive Toolbar** - Easy access to all editing tools
- **🖱️ Drag & Drop** - File upload support throughout the app
- **⏳ Progress Indicators** - Visual feedback for file operations
- **🔔 Toast Notifications** - Success/error messages
- **⌨️ Keyboard Shortcuts** - Common shortcuts for efficiency
  - `Ctrl/Cmd + S` - Download/Save
  - `Ctrl/Cmd + Z` - Undo
  - `Ctrl/Cmd + Y` - Redo
  - `Ctrl/Cmd + T` - Add Text
  - `Esc` - Close Modals

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required! Just a modern web browser.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/im0d00/pdf-image-editor.git
   cd pdf-image-editor
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx serve
     ```
   - Then navigate to `http://localhost:8000`

3. **Install as PWA (Optional):**
   - Open the app in Chrome/Edge
   - Look for the install icon in the address bar
   - Click to install as a standalone app

## 📁 Project Structure

```
pdf-image-editor/
├── index.html          # Main HTML file with app structure
├── css/
│   └── styles.css      # All styles including dark/light theme
├── js/
│   ├── app.js          # Main app logic, theme toggle, tab switching
│   ├── pdf-editor.js   # PDF editing functionality
│   ├── image-editor.js # Image editing functionality
│   └── utils.js        # Shared utilities (file handling, notifications)
├── assets/
│   └── icons/          # PWA icons (placeholder)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for offline support
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **PDF Libraries:**
  - [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering/viewing
  - [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation
- **Image Library:**
  - [Fabric.js](http://fabricjs.com/) - Canvas-based image editing
- **PWA:** Service Worker, Web App Manifest

## 📖 Usage Guide

### PDF Editor

1. **Upload a PDF:**
   - Drag and drop a PDF file onto the upload area
   - Or click "Choose Files" to select from your device

2. **Edit Your PDF:**
   - Click on a page to add text annotations
   - Use Ctrl+Click to select multiple pages
   - Drag pages to reorder them
   - Use the toolbar buttons for rotate, delete, merge, or split

3. **Download:**
   - Click "Download" to save your edited PDF

### Image Editor

1. **Upload an Image:**
   - Drag and drop an image file onto the upload area
   - Or click "Choose Image" to select from your device

2. **Edit Your Image:**
   - Use toolbar buttons for basic operations (rotate, flip, crop)
   - Click "Draw" to enable freehand drawing mode
   - Click "Add Text" to add text overlays
   - Click "Add Shapes" to add geometric shapes
   - Click "Filters" to adjust image properties

3. **Undo/Redo:**
   - Use the undo/redo buttons or keyboard shortcuts
   - Full edit history is maintained

4. **Download:**
   - Click "Download" to save your edited image

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ⚠️ Internet Explorer (not supported)

## 🔒 Privacy & Security

- **100% Client-Side Processing** - All files are processed in your browser
- **No Server Upload** - Your files never leave your device
- **No Data Collection** - We don't track or store any user data
- **Offline Capable** - Works without an internet connection (after first load)

### Security Notes

This application loads external libraries from CDNs:
- PDF.js from cdnjs.cloudflare.com
- pdf-lib from unpkg.com
- Fabric.js from cdnjs.cloudflare.com

These scripts are loaded with `crossorigin="anonymous"` and `referrerpolicy="no-referrer"` attributes for enhanced security. For maximum security in production:
1. Consider downloading and self-hosting these libraries
2. Add Subresource Integrity (SRI) hashes to verify script integrity
3. Implement Content Security Policy (CSP) headers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla
- [pdf-lib](https://pdf-lib.js.org/) by Andrew Dillon
- [Fabric.js](http://fabricjs.com/) by Fabric.js contributors

## 📸 Screenshots

### PDF Editor
![PDF Editor Screenshot](assets/screenshots/pdf-editor-placeholder.png)
*Upload, edit, merge, split, and download PDFs with ease*

### Image Editor
![Image Editor Screenshot](assets/screenshots/image-editor-placeholder.png)
*Complete image editing tools with filters, drawing, and more*

### Dark Mode
![Dark Mode Screenshot](assets/screenshots/dark-mode-placeholder.png)
*Beautiful dark theme for comfortable editing*

---

**Made with ❤️ for the web**