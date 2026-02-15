// Image Editor Functionality using Fabric.js

// State management
const imageState = {
    canvas: null,
    originalImage: null,
    history: [],
    historyStep: -1,
    isDrawingMode: false,
    currentFilter: {}
};

// Elements
const imageUploadArea = document.getElementById('imageUploadArea');
const imageFileInput = document.getElementById('imageFileInput');
const imageToolbar = document.getElementById('imageToolbar');
const imageCanvasContainer = document.getElementById('imageCanvasContainer');
const canvasElement = document.getElementById('imageCanvas');

// Setup drag and drop
setupDragAndDrop(imageUploadArea, handleImageUpload);

// File input handler
imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload([file]);
    }
});

// Handle image upload
async function handleImageUpload(files) {
    const file = files[0];
    
    if (!validateFileType(file, ['image/*', '.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'])) {
        showToast('Please select a valid image file', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const dataUrl = await readFileAsDataURL(file);
        await loadImage(dataUrl);
        
        // Show toolbar and canvas
        imageUploadArea.style.display = 'none';
        imageToolbar.style.display = 'flex';
        imageCanvasContainer.style.display = 'block';
        
        showLoading(false);
        showToast('Image loaded successfully', 'success');
    } catch (error) {
        showLoading(false);
        handleError(error, 'Image Upload');
    }
}

// Load image into canvas
async function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
        // Initialize Fabric canvas if not already done
        if (!imageState.canvas) {
            imageState.canvas = new fabric.Canvas('imageCanvas', {
                preserveObjectStacking: true
            });
            
            // Save state on object modifications
            imageState.canvas.on('object:modified', saveState);
            imageState.canvas.on('object:added', saveState);
        }
        
        fabric.Image.fromURL(dataUrl, (img) => {
            imageState.canvas.clear();
            
            // Set canvas size to image size (with max dimensions)
            const maxWidth = 1200;
            const maxHeight = 800;
            let scale = 1;
            
            if (img.width > maxWidth || img.height > maxHeight) {
                scale = Math.min(maxWidth / img.width, maxHeight / img.height);
            }
            
            imageState.canvas.setWidth(img.width * scale);
            imageState.canvas.setHeight(img.height * scale);
            
            img.scale(scale);
            img.selectable = false;
            img.evented = false;
            
            imageState.canvas.setBackgroundImage(img, imageState.canvas.renderAll.bind(imageState.canvas));
            imageState.originalImage = img;
            
            // Initialize history
            imageState.history = [];
            imageState.historyStep = -1;
            saveState();
            
            resolve();
        }, {crossOrigin: 'anonymous'});
    });
}

// Save state for undo/redo
function saveState() {
    // Don't save during undo/redo
    if (imageState.skipSave) return;
    
    const json = imageState.canvas.toJSON();
    imageState.history = imageState.history.slice(0, imageState.historyStep + 1);
    imageState.history.push(json);
    imageState.historyStep++;
    
    // Limit history to 50 states
    if (imageState.history.length > 50) {
        imageState.history.shift();
        imageState.historyStep--;
    }
    
    updateUndoRedoButtons();
}

// Update undo/redo button states
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('imgUndo');
    const redoBtn = document.getElementById('imgRedo');
    
    undoBtn.disabled = imageState.historyStep <= 0;
    redoBtn.disabled = imageState.historyStep >= imageState.history.length - 1;
}

// Undo
document.getElementById('imgUndo').addEventListener('click', () => {
    if (imageState.historyStep > 0) {
        imageState.historyStep--;
        imageState.skipSave = true;
        
        imageState.canvas.loadFromJSON(imageState.history[imageState.historyStep], () => {
            imageState.canvas.renderAll();
            imageState.skipSave = false;
            updateUndoRedoButtons();
        });
    }
});

// Redo
document.getElementById('imgRedo').addEventListener('click', () => {
    if (imageState.historyStep < imageState.history.length - 1) {
        imageState.historyStep++;
        imageState.skipSave = true;
        
        imageState.canvas.loadFromJSON(imageState.history[imageState.historyStep], () => {
            imageState.canvas.renderAll();
            imageState.skipSave = false;
            updateUndoRedoButtons();
        });
    }
});

// Crop
document.getElementById('imgCrop').addEventListener('click', () => {
    const activeObject = imageState.canvas.getActiveObject();
    
    if (!activeObject || activeObject.type !== 'rect') {
        // Create crop rectangle
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 200,
            fill: 'rgba(0,0,0,0.3)',
            stroke: 'white',
            strokeWidth: 2,
            strokeDashArray: [5, 5]
        });
        
        imageState.canvas.add(rect);
        imageState.canvas.setActiveObject(rect);
        showToast('Position the rectangle and click Crop again to apply', 'info', 5000);
    } else {
        // Apply crop
        const cropRect = activeObject;
        const dataURL = imageState.canvas.toDataURL({
            left: cropRect.left,
            top: cropRect.top,
            width: cropRect.width * cropRect.scaleX,
            height: cropRect.height * cropRect.scaleY
        });
        
        loadImage(dataURL).then(() => {
            showToast('Image cropped', 'success');
        });
    }
});

// Rotate 90 degrees
document.getElementById('imgRotate').addEventListener('click', () => {
    const objects = imageState.canvas.getObjects();
    const centerX = imageState.canvas.width / 2;
    const centerY = imageState.canvas.height / 2;
    
    objects.forEach(obj => {
        if (obj === imageState.originalImage) return;
        
        const angle = obj.angle || 0;
        obj.rotate((angle + 90) % 360);
        
        // Rotate around canvas center
        const radians = fabric.util.degreesToRadians(90);
        const newLeft = centerX + (obj.left - centerX) * Math.cos(radians) - (obj.top - centerY) * Math.sin(radians);
        const newTop = centerY + (obj.left - centerX) * Math.sin(radians) + (obj.top - centerY) * Math.cos(radians);
        
        obj.set({left: newLeft, top: newTop});
        obj.setCoords();
    });
    
    // Swap canvas dimensions
    const temp = imageState.canvas.width;
    imageState.canvas.setWidth(imageState.canvas.height);
    imageState.canvas.setHeight(temp);
    
    // Rotate background image
    if (imageState.originalImage) {
        const angle = imageState.originalImage.angle || 0;
        imageState.originalImage.rotate((angle + 90) % 360);
        
        // Adjust position
        imageState.originalImage.set({
            left: imageState.canvas.width / 2,
            top: imageState.canvas.height / 2,
            originX: 'center',
            originY: 'center'
        });
    }
    
    imageState.canvas.renderAll();
    saveState();
    showToast('Image rotated', 'success');
});

// Flip horizontal
document.getElementById('imgFlipH').addEventListener('click', () => {
    const objects = imageState.canvas.getObjects();
    
    objects.forEach(obj => {
        obj.set({flipX: !obj.flipX});
        obj.setCoords();
    });
    
    if (imageState.originalImage) {
        imageState.originalImage.set({flipX: !imageState.originalImage.flipX});
    }
    
    imageState.canvas.renderAll();
    saveState();
    showToast('Image flipped horizontally', 'success');
});

// Flip vertical
document.getElementById('imgFlipV').addEventListener('click', () => {
    const objects = imageState.canvas.getObjects();
    
    objects.forEach(obj => {
        obj.set({flipY: !obj.flipY});
        obj.setCoords();
    });
    
    if (imageState.originalImage) {
        imageState.originalImage.set({flipY: !imageState.originalImage.flipY});
    }
    
    imageState.canvas.renderAll();
    saveState();
    showToast('Image flipped vertically', 'success');
});

// Drawing mode
const drawingOptions = document.getElementById('drawingOptions');
const brushSize = document.getElementById('brushSize');
const brushColor = document.getElementById('brushColor');
const brushSizeValue = document.getElementById('brushSizeValue');

document.getElementById('imgDraw').addEventListener('click', () => {
    imageState.isDrawingMode = !imageState.isDrawingMode;
    imageState.canvas.isDrawingMode = imageState.isDrawingMode;
    
    if (imageState.isDrawingMode) {
        drawingOptions.style.display = 'flex';
        document.getElementById('imgDraw').style.backgroundColor = 'var(--primary-color)';
        document.getElementById('imgDraw').style.color = 'white';
        
        imageState.canvas.freeDrawingBrush.width = parseInt(brushSize.value);
        imageState.canvas.freeDrawingBrush.color = brushColor.value;
    } else {
        drawingOptions.style.display = 'none';
        document.getElementById('imgDraw').style.backgroundColor = '';
        document.getElementById('imgDraw').style.color = '';
    }
});

brushSize.addEventListener('input', (e) => {
    brushSizeValue.textContent = e.target.value;
    if (imageState.canvas.freeDrawingBrush) {
        imageState.canvas.freeDrawingBrush.width = parseInt(e.target.value);
    }
});

brushColor.addEventListener('change', (e) => {
    if (imageState.canvas.freeDrawingBrush) {
        imageState.canvas.freeDrawingBrush.color = e.target.value;
    }
});

// Add text
document.getElementById('imgText').addEventListener('click', () => {
    const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 30,
        fill: '#000000'
    });
    
    imageState.canvas.add(text);
    imageState.canvas.setActiveObject(text);
    imageState.canvas.renderAll();
    showToast('Text added. Double-click to edit.', 'success');
});

// Shapes
const shapesOptions = document.getElementById('shapesOptions');
document.getElementById('imgShapes').addEventListener('click', () => {
    if (shapesOptions.style.display === 'none' || !shapesOptions.style.display) {
        shapesOptions.style.display = 'flex';
    } else {
        shapesOptions.style.display = 'none';
    }
});

document.getElementById('addRect').addEventListener('click', () => {
    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: 2
    });
    imageState.canvas.add(rect);
    shapesOptions.style.display = 'none';
});

document.getElementById('addCircle').addEventListener('click', () => {
    const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: 2
    });
    imageState.canvas.add(circle);
    shapesOptions.style.display = 'none';
});

document.getElementById('addLine').addEventListener('click', () => {
    const line = new fabric.Line([50, 50, 200, 50], {
        stroke: '#000000',
        strokeWidth: 2
    });
    imageState.canvas.add(line);
    shapesOptions.style.display = 'none';
});

document.getElementById('addArrow').addEventListener('click', () => {
    const line = new fabric.Line([50, 50, 200, 50], {
        stroke: '#000000',
        strokeWidth: 2
    });
    
    const triangle = new fabric.Triangle({
        left: 200,
        top: 50,
        width: 15,
        height: 15,
        fill: '#000000',
        angle: 90,
        originX: 'center',
        originY: 'center'
    });
    
    const arrow = new fabric.Group([line, triangle], {
        left: 100,
        top: 100
    });
    
    imageState.canvas.add(arrow);
    shapesOptions.style.display = 'none';
});

// Filters
document.getElementById('imgFilters').addEventListener('click', () => {
    showModal('imageFiltersModal');
});

// Filter controls
const filterSliders = {
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    saturation: document.getElementById('saturation'),
    blur: document.getElementById('blur')
};

const filterValues = {
    brightness: document.getElementById('brightnessValue'),
    contrast: document.getElementById('contrastValue'),
    saturation: document.getElementById('saturationValue'),
    blur: document.getElementById('blurValue')
};

Object.keys(filterSliders).forEach(key => {
    filterSliders[key].addEventListener('input', (e) => {
        filterValues[key].textContent = e.target.value;
        imageState.currentFilter[key] = parseFloat(e.target.value);
    });
});

document.getElementById('grayscale').addEventListener('click', () => {
    imageState.currentFilter.grayscale = !imageState.currentFilter.grayscale;
});

document.getElementById('sepia').addEventListener('click', () => {
    imageState.currentFilter.sepia = !imageState.currentFilter.sepia;
});

document.getElementById('invert').addEventListener('click', () => {
    imageState.currentFilter.invert = !imageState.currentFilter.invert;
});

document.getElementById('filterReset').addEventListener('click', () => {
    imageState.currentFilter = {};
    Object.keys(filterSliders).forEach(key => {
        filterSliders[key].value = 0;
        filterValues[key].textContent = '0';
    });
});

document.getElementById('filterApply').addEventListener('click', () => {
    applyFilters();
    hideModal('imageFiltersModal');
});

// Apply filters
function applyFilters() {
    if (!imageState.originalImage) return;
    
    const filters = [];
    
    if (imageState.currentFilter.brightness) {
        filters.push(new fabric.Image.filters.Brightness({
            brightness: imageState.currentFilter.brightness
        }));
    }
    
    if (imageState.currentFilter.contrast) {
        filters.push(new fabric.Image.filters.Contrast({
            contrast: imageState.currentFilter.contrast
        }));
    }
    
    if (imageState.currentFilter.saturation) {
        filters.push(new fabric.Image.filters.Saturation({
            saturation: imageState.currentFilter.saturation
        }));
    }
    
    if (imageState.currentFilter.blur) {
        filters.push(new fabric.Image.filters.Blur({
            blur: imageState.currentFilter.blur
        }));
    }
    
    if (imageState.currentFilter.grayscale) {
        filters.push(new fabric.Image.filters.Grayscale());
    }
    
    if (imageState.currentFilter.sepia) {
        filters.push(new fabric.Image.filters.Sepia());
    }
    
    if (imageState.currentFilter.invert) {
        filters.push(new fabric.Image.filters.Invert());
    }
    
    imageState.originalImage.filters = filters;
    imageState.originalImage.applyFilters();
    imageState.canvas.renderAll();
    saveState();
    showToast('Filters applied', 'success');
}

// Resize
document.getElementById('imgResize').addEventListener('click', () => {
    document.getElementById('resizeWidth').value = imageState.canvas.width;
    document.getElementById('resizeHeight').value = imageState.canvas.height;
    showModal('imageResizeModal');
});

document.getElementById('resizeCancel').addEventListener('click', () => {
    hideModal('imageResizeModal');
});

const maintainAspect = document.getElementById('maintainAspect');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');

resizeWidth.addEventListener('input', (e) => {
    if (maintainAspect.checked && imageState.canvas) {
        const aspectRatio = imageState.canvas.height / imageState.canvas.width;
        resizeHeight.value = Math.round(e.target.value * aspectRatio);
    }
});

resizeHeight.addEventListener('input', (e) => {
    if (maintainAspect.checked && imageState.canvas) {
        const aspectRatio = imageState.canvas.width / imageState.canvas.height;
        resizeWidth.value = Math.round(e.target.value * aspectRatio);
    }
});

document.getElementById('resizeApply').addEventListener('click', () => {
    const newWidth = parseInt(resizeWidth.value);
    const newHeight = parseInt(resizeHeight.value);
    
    if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
        showToast('Please enter valid dimensions', 'error');
        return;
    }
    
    // Export current canvas to data URL
    const dataURL = imageState.canvas.toDataURL();
    
    // Resize canvas
    imageState.canvas.setWidth(newWidth);
    imageState.canvas.setHeight(newHeight);
    
    // Reload image with new dimensions
    loadImage(dataURL).then(() => {
        hideModal('imageResizeModal');
        showToast('Image resized', 'success');
    });
});

// Download
document.getElementById('imgDownload').addEventListener('click', () => {
    if (!imageState.canvas) {
        showToast('No image to download', 'error');
        return;
    }
    
    const format = 'png'; // Default format
    const dataURL = imageState.canvas.toDataURL({
        format: format,
        quality: 0.95
    });
    
    // Convert data URL to blob
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            downloadFile(blob, `edited-image.${format}`);
            showToast('Image downloaded', 'success');
        })
        .catch(error => handleError(error, 'Download Image'));
});

// New image
document.getElementById('imgNew').addEventListener('click', () => {
    if (confirm('Start a new image? Any unsaved changes will be lost.')) {
        if (imageState.canvas) {
            imageState.canvas.clear();
        }
        imageState.originalImage = null;
        imageState.history = [];
        imageState.historyStep = -1;
        imageState.isDrawingMode = false;
        imageState.currentFilter = {};
        
        imageUploadArea.style.display = 'block';
        imageToolbar.style.display = 'none';
        imageCanvasContainer.style.display = 'none';
        drawingOptions.style.display = 'none';
        shapesOptions.style.display = 'none';
        imageFileInput.value = '';
    }
});
