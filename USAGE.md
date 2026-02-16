# 📖 Usage Guide - PDF & Image Editor

A comprehensive guide on how to use the PDF & Image Editor application.

## Table of Contents

- [Getting Started](#getting-started)
- [PDF Editor](#pdf-editor)
  - [Basic Operations](#pdf-basic-operations)
  - [Advanced Features](#pdf-advanced-features)
  - [Tips & Tricks](#pdf-tips--tricks)
- [Image Editor](#image-editor)
  - [Basic Operations](#image-basic-operations)
  - [Drawing & Annotation](#drawing--annotation)
  - [Filters & Effects](#filters--effects)
  - [Tips & Tricks](#image-tips--tricks)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [FAQ](#frequently-asked-questions)

---

## Getting Started

### Opening the Application

**Method 1: Direct File Access (Simplest)**
1. Download/clone the repository
2. Navigate to the folder
3. Double-click `index.html`
4. Your default browser opens the app

**Method 2: Local Server (Recommended for full features)**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

**Method 3: Install as PWA**
1. Open the app in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click "Install" to add it to your desktop/home screen
4. Launch like any other app - works offline!

### First Time? Start Here!

1. **Switch between editors**: Click the "PDF Editor" or "Image Editor" tabs at the top
2. **Toggle theme**: Click the sun/moon icon in the header to switch between light and dark modes
3. **Upload a file**: Drag & drop or click the upload area

---

## PDF Editor

### PDF Basic Operations

#### 📤 Upload & View PDFs

**Option 1: Drag & Drop**
- Drag a PDF file from your file manager
- Drop it onto the upload area
- The PDF loads and displays all pages

**Option 2: File Picker**
- Click "Choose Files" button
- Select one or more PDF files
- Click "Open"

**Multiple Files**
- Upload multiple PDFs to prepare for merging
- Each file is loaded in sequence

#### ✍️ Add Text Annotations

1. Click the **"Add Text" button** (T icon) in the toolbar
2. A message appears: "Click on a page to add text"
3. **Click on any page** where you want to add text
4. A dialog appears with text options:
   - **Text**: Type your annotation
   - **Font Size**: Choose size (8-72)
   - **Color**: Pick a color using the color picker
5. Click **"Add Text"** to apply
6. The text appears on the selected page

**Example Use Cases:**
- Add watermarks
- Fill in form fields
- Add notes or comments
- Sign documents (type your signature)

#### 🔄 Rotate Pages

1. **Select pages** to rotate:
   - Hold `Ctrl` (or `Cmd` on Mac)
   - Click on the pages you want to rotate
   - Selected pages show a highlight border
2. Click the **"Rotate" button** (↻ icon)
3. Pages rotate 90° clockwise
4. Click again to continue rotating

**Quick Tip:** You can select multiple pages at once!

#### 🗑️ Delete Pages

1. **Select unwanted pages**:
   - Hold `Ctrl/Cmd` and click pages
2. Click the **"Delete" button** (trash icon)
3. Confirm deletion
4. Pages are removed from the PDF

**Warning:** Cannot delete all pages - at least one must remain.

#### 📋 Reorder Pages

**Drag & Drop Method:**
1. **Click and hold** on a page thumbnail
2. **Drag** it to the new position
3. **Drop** it in place
4. Pages automatically renumber

**Use Case:** Fix scanned documents that are out of order

### PDF Advanced Features

#### 🔗 Merge PDFs

**Combine multiple PDFs into one:**

1. **Upload multiple PDF files**:
   - Drag & drop multiple files at once
   - Or click "Choose Files" and select multiple PDFs
2. A notification shows: "X PDFs loaded"
3. Click **"Merge PDFs"** button
4. Wait for processing (progress indicator shows)
5. Result: One combined PDF with all pages

**Example Workflow:**
```
Document1.pdf (3 pages) + Document2.pdf (2 pages) 
= MergedDocument.pdf (5 pages)
```

**Use Cases:**
- Combine multiple receipts
- Merge contract documents
- Consolidate reports

#### ✂️ Split PDFs

**Extract specific pages:**

1. **Upload a PDF**
2. **Select pages to extract**:
   - Hold `Ctrl/Cmd` and click pages
3. Click **"Split PDF"** button
4. A new PDF downloads with just those pages
5. Original PDF remains unchanged

**Example:**
- Have a 10-page document
- Select pages 3, 5, and 7
- Get a new 3-page PDF with just those pages

#### 💾 Download

1. Click **"Download"** button (or press `Ctrl+S`)
2. Browser's save dialog appears
3. Choose location and filename
4. Click "Save"

**File name:** `edited-document.pdf`

#### 🆕 Start New

1. Click **"New"** button
2. Confirm: "Start a new PDF?"
3. Canvas clears, ready for new file
4. Upload area reappears

### PDF Tips & Tricks

**💡 Pro Tips:**

1. **Quick Rotation**: Select all pages (`Ctrl+A` concept doesn't work here, but select multiple with Ctrl+Click) and rotate them all at once

2. **Text Positioning**: Text is added at a default position (top-left). Plan your layout before adding multiple text annotations.

3. **Color Coding**: Use different colors for different types of annotations (red for corrections, blue for notes, etc.)

4. **Before/After**: Download the original, then make edits and download again to keep both versions

5. **Large PDFs**: For PDFs with many pages, processing may take a few seconds. Be patient!

6. **Mobile Usage**: On tablets/phones, tap and hold to select pages instead of Ctrl+Click

---

## Image Editor

### Image Basic Operations

#### 📤 Upload Images

**Supported Formats:** PNG, JPG, JPEG, WEBP, BMP, GIF

**Option 1: Drag & Drop**
- Drag an image file from anywhere
- Drop onto the upload area
- Image loads on the canvas

**Option 2: File Picker**
- Click "Choose Image"
- Select an image file
- Click "Open"

**After Upload:**
- Image appears on canvas
- Toolbar becomes active
- You can start editing immediately

#### ✂️ Crop

**Method:**
1. Click **"Crop"** button (crop icon)
2. A semi-transparent rectangle appears on the image
3. **Resize and position** the rectangle:
   - Click and drag corners to resize
   - Click center to move it
4. Click **"Crop"** button again to apply
5. Image is cropped to the rectangle area

**Tips:**
- Cropping is destructive - use Undo if needed
- Position the rectangle carefully before applying

#### 📏 Resize

1. Click **"Resize"** button
2. A dialog appears with:
   - **Width** (in pixels)
   - **Height** (in pixels)
   - **Maintain aspect ratio** checkbox (checked by default)
3. Enter new dimensions
4. If aspect ratio is locked, height adjusts automatically
5. Click **"Apply"**

**Example:**
- Original: 1920×1080
- Set width to 960
- Height automatically becomes 540 (maintains 16:9 ratio)

#### 🔄 Rotate & Flip

**Rotate 90°:**
- Click **"Rotate"** button (↻ icon)
- Image rotates 90° clockwise
- Click multiple times to rotate further

**Flip Horizontal:**
- Click **"Flip H"** button (⇄ icon)
- Image mirrors left-to-right

**Flip Vertical:**
- Click **"Flip V"** button (⇅ icon)
- Image mirrors top-to-bottom

**Combine Operations:**
- Rotate 90° + Flip H = 90° counter-clockwise
- Rotate 180° = Flip H + Flip V

### Drawing & Annotation

#### ✏️ Freehand Drawing

1. Click **"Draw"** button (pencil icon)
2. Drawing panel appears below toolbar:
   - **Brush Size**: Slider (1-50 pixels)
   - **Color**: Color picker
3. **Draw on the image**:
   - Click and drag to draw
   - Release to finish the line
4. **Adjust as you draw**:
   - Change brush size mid-drawing
   - Change color for different strokes
5. Click **"Draw"** again to exit drawing mode

**Use Cases:**
- Highlight important areas
- Circle items
- Free-form annotations
- Artistic effects

#### ✍️ Add Text

1. Click **"Add Text"** button (T icon)
2. Text object appears: "Double click to edit"
3. **Double-click the text** to edit it
4. Type your text
5. **Customize**:
   - Drag to reposition
   - Drag corners to resize
   - Rotate handle to rotate
   - Change font/size/color (select text object, then modify)
6. Click elsewhere to finish

**Formatting:**
- Default: Arial, 30px, black
- To change: Double-click inside text to select all, then type

#### ⬜ Add Shapes

1. Click **"Add Shapes"** button (square icon)
2. Shape options panel appears:
   - **Rectangle**
   - **Circle**
   - **Line**
   - **Arrow**
3. Click a shape type
4. Shape appears on canvas
5. **Customize**:
   - Drag to move
   - Drag corners/edges to resize
   - Rotate handle to rotate
   - Click shape, then use color picker to change color

**Shape Properties:**
- Default: Transparent fill, black stroke
- Stroke width: 2px
- Fully customizable after placement

**Creative Uses:**
- Rectangles: Highlight boxes, borders
- Circles: Callouts, emphasis
- Lines: Dividers, underlines
- Arrows: Point to important elements

### Filters & Effects

#### 🎨 Apply Filters

1. Click **"Filters"** button
2. Filter panel opens with controls:

**Adjustable Sliders:**
- **Brightness**: -1.0 to +1.0 (darker to brighter)
- **Contrast**: -1.0 to +1.0 (less to more contrast)
- **Saturation**: -1.0 to +1.0 (desaturated to oversaturated)
- **Blur**: 0 to 1.0 (sharp to blurry)

**One-Click Effects:**
- **Grayscale**: Convert to black & white
- **Sepia**: Vintage/old photo effect
- **Invert**: Negative image effect

3. Adjust sliders to preview effects
4. Click effect buttons to toggle them
5. Click **"Apply"** to save changes
6. Or click **"Reset"** to clear all filters

**Pro Tips:**

**Photo Enhancement:**
```
Brightness: +0.1
Contrast: +0.2
Saturation: +0.1
Result: Vibrant, punchy image
```

**Vintage Look:**
```
Apply Sepia
Brightness: -0.1
Contrast: +0.1
Result: Old photograph style
```

**High Contrast B&W:**
```
Apply Grayscale
Contrast: +0.3
Result: Dramatic black & white
```

#### ↩️ Undo / Redo

**Undo:**
- Click **"Undo"** button (↶ icon)
- Or press `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)
- Reverts last action

**Redo:**
- Click **"Redo"** button (↷ icon)
- Or press `Ctrl+Y` or `Ctrl+Shift+Z`
- Restores undone action

**History:**
- Maintains up to 50 states
- Works across all editing operations
- Includes: drawing, text, shapes, filters, crops, rotations

**Important:** Undo/Redo is lost when you upload a new image or click "New"

### Image Tips & Tricks

**💡 Pro Tips:**

1. **Non-Destructive Workflow**:
   - Make a copy of original before editing
   - Use Undo liberally - don't be afraid to experiment

2. **Layer Your Work**:
   - Add shapes first (background)
   - Then text (middle)
   - Finally drawing/annotations (foreground)

3. **Color Coordination**:
   - Use consistent colors for related elements
   - High contrast for readability (dark text on light bg)

4. **Quick Crop**:
   - For square crops: Start with resize to square dimensions
   - Then crop to final size

5. **Text Readability**:
   - Add semi-transparent rectangle behind text
   - Use large font sizes (minimum 24px)
   - High contrast colors

6. **Save Originals**:
   - Keep your original image
   - Experiment with copies
   - Easy to start over if needed

7. **Filter Stacking**:
   - Apply filters one at a time
   - Use Undo if you don't like the result
   - Combine filters for unique effects

8. **Object Selection**:
   - Click on text/shapes to select them
   - Delete key removes selected object
   - Drag corners while holding Shift = maintain aspect ratio

---

## Keyboard Shortcuts

Make editing faster with these shortcuts:

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Download/Save current work |
| `Ctrl+T` / `Cmd+T` | Add text (PDF or Image) |
| `Esc` | Close any open modal/dialog |

### Image Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo last action |
| `Ctrl+Y` / `Cmd+Y` | Redo last undone action |
| `Ctrl+Shift+Z` | Alternative Redo |

### PDF Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Click` | Select/deselect multiple pages |
| `Ctrl+S` / `Cmd+S` | Download edited PDF |

---

## Troubleshooting

### Common Issues & Solutions

#### Problem: "The app won't load" or shows blank page

**Solutions:**
1. **Check browser compatibility**
   - Use Chrome, Firefox, Safari, or Edge
   - Update to latest version
   - Internet Explorer is NOT supported

2. **Check internet connection**
   - First load requires internet (for CDN libraries)
   - After first load, works offline

3. **Clear browser cache**
   ```
   Chrome: Ctrl+Shift+Delete
   Firefox: Ctrl+Shift+Delete
   Safari: Cmd+Option+E
   ```

4. **Try incognito/private mode**
   - Rules out extension conflicts

#### Problem: "PDF won't upload" or "Image won't load"

**Solutions:**
1. **Check file format**
   - PDF Editor: Only .pdf files
   - Image Editor: .png, .jpg, .jpeg, .webp, .bmp, .gif

2. **Check file size**
   - Very large files (>50MB) may be slow
   - Break large PDFs into smaller chunks

3. **Check file corruption**
   - Try opening in another app first
   - Re-save or re-export the file

#### Problem: "Editing is slow or laggy"

**Solutions:**
1. **Reduce file size**
   - For images: Resize to smaller dimensions first
   - For PDFs: Split into smaller documents

2. **Close other browser tabs**
   - Free up memory

3. **Restart browser**
   - Clear memory and caches

4. **Use desktop instead of mobile**
   - Complex edits work better on desktop

#### Problem: "Changes not saving" or "Download not working"

**Solutions:**
1. **Check browser permissions**
   - Allow downloads in browser settings
   - Check if download was blocked (icon in address bar)

2. **Check disk space**
   - Ensure enough space for downloaded file

3. **Try different browser**
   - Some browsers have stricter download policies

#### Problem: "Service Worker errors in console"

**Solutions:**
1. **Use HTTPS or localhost**
   - Service Workers require secure context
   - Use local server instead of file:// protocol

2. **Clear Service Worker cache**
   ```
   Chrome DevTools > Application > Service Workers > Unregister
   ```

---

## Frequently Asked Questions

### General Questions

**Q: Do I need to create an account?**  
A: No! This app works entirely in your browser without any account or login.

**Q: Do my files get uploaded to a server?**  
A: No! Everything happens locally in your browser. Your files never leave your device.

**Q: Does it work offline?**  
A: Yes! After the first load (which downloads libraries), the app works offline thanks to Service Worker caching.

**Q: Is it free?**  
A: Yes! Completely free and open-source. No subscriptions, no premium features.

**Q: Can I use it commercially?**  
A: Yes! Licensed under MIT License. Use it for personal or commercial projects.

### PDF Editor Questions

**Q: Can I edit PDF forms?**  
A: You can add text annotations but not interact with form fields directly. Better for adding text overlays.

**Q: Can I extract images from PDFs?**  
A: Not currently. This feature focuses on page manipulation and text annotations.

**Q: What's the maximum PDF size?**  
A: Limited by browser memory. Most modern browsers handle up to 50-100MB. For larger files, split them first.

**Q: Can I password-protect PDFs?**  
A: Not currently. Use external tools for encryption after editing.

**Q: Can I merge 10+ PDFs at once?**  
A: Yes! No hard limit, but performance depends on file sizes and browser memory.

### Image Editor Questions

**Q: What's the maximum image size?**  
A: Limited by browser canvas size (~268 megapixels in Chrome). Most images work fine.

**Q: Can I edit multiple images at once?**  
A: No. One image at a time. Download each before starting the next.

**Q: Does it preserve EXIF data?**  
A: No. Downloaded images lose EXIF metadata. Save original if you need metadata.

**Q: Can I undo after downloading?**  
A: No. Download creates a new file. Original editing session remains until you click "New".

**Q: What format should I download?**  
A: 
- PNG: Lossless, best quality, larger file size, supports transparency
- JPG: Lossy, smaller file size, no transparency, good for photos
- WEBP: Modern format, smaller than JPG, good quality

### Technical Questions

**Q: What browsers are supported?**  
A: Chrome, Firefox, Safari, Edge (latest versions). No Internet Explorer.

**Q: Does it work on mobile?**  
A: Yes! Fully responsive. Some operations easier on tablet/desktop.

**Q: Can I self-host this?**  
A: Yes! Download the repository and serve it from any web server.

**Q: Is the source code available?**  
A: Yes! It's open source on GitHub: [im0d00/pdf-image-editor](https://github.com/im0d00/pdf-image-editor)

**Q: Can I contribute or report bugs?**  
A: Yes! Submit issues or pull requests on GitHub.

---

## Need More Help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/im0d00/pdf-image-editor/issues)
- **Source Code**: [View on GitHub](https://github.com/im0d00/pdf-image-editor)
- **README**: [Back to main documentation](README.md)
- **Security**: [Security information](SECURITY.md)

---

**Happy Editing! 🎨📄**
