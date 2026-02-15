// PDF Editor Functionality

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// State management
const pdfState = {
    currentPDF: null,
    pdfDoc: null,
    pdfBytes: null,
    pages: [],
    selectedPages: new Set(),
    uploadedPDFs: [],
    textAnnotations: [],
    addingText: false,
    textPageIndex: null
};

// Elements
const pdfUploadArea = document.getElementById('pdfUploadArea');
const pdfFileInput = document.getElementById('pdfFileInput');
const pdfToolbar = document.getElementById('pdfToolbar');
const pdfCanvasContainer = document.getElementById('pdfCanvasContainer');
const pdfPagesContainer = document.getElementById('pdfPages');

// Setup drag and drop
setupDragAndDrop(pdfUploadArea, handlePDFUpload);

// File input handler
pdfFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        handlePDFUpload(files);
    }
});

// Handle PDF upload
async function handlePDFUpload(files) {
    try {
        showLoading(true);
        
        const pdfFiles = files.filter(f => f.type === 'application/pdf');
        if (pdfFiles.length === 0) {
            throw new Error('Please select valid PDF files');
        }
        
        pdfState.uploadedPDFs = pdfFiles;
        
        if (pdfFiles.length === 1) {
            // Load single PDF
            await loadPDF(pdfFiles[0]);
        } else {
            // Multiple PDFs - prepare for merge
            showToast(`${pdfFiles.length} PDFs loaded. Click "Merge PDFs" to combine them.`, 'success');
            await loadPDF(pdfFiles[0]);
        }
        
        // Show toolbar and canvas
        pdfUploadArea.style.display = 'none';
        pdfToolbar.style.display = 'flex';
        pdfCanvasContainer.style.display = 'block';
        
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'PDF Upload');
    }
}

// Load PDF
async function loadPDF(file) {
    try {
        pdfState.pdfBytes = await readFileAsArrayBuffer(file);
        pdfState.currentPDF = await PDFLib.PDFDocument.load(pdfState.pdfBytes);
        
        // Also load with PDF.js for rendering
        const loadingTask = pdfjsLib.getDocument({data: pdfState.pdfBytes});
        pdfState.pdfDoc = await loadingTask.promise;
        
        await renderAllPages();
        showToast('PDF loaded successfully', 'success');
    } catch (error) {
        throw new Error('Failed to load PDF: ' + error.message);
    }
}

// Render all pages
async function renderAllPages() {
    pdfPagesContainer.innerHTML = '';
    pdfState.pages = [];
    
    const numPages = pdfState.pdfDoc.numPages;
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        await renderPage(pageNum);
    }
}

// Render single page
async function renderPage(pageNum) {
    const page = await pdfState.pdfDoc.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({scale});
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;
    
    const pageDiv = document.createElement('div');
    pageDiv.className = 'pdf-page';
    pageDiv.dataset.pageNum = pageNum;
    pageDiv.draggable = true;
    
    pageDiv.innerHTML = `
        ${canvas.outerHTML}
        <div class="pdf-page-number">Page ${pageNum}</div>
    `;
    
    // Page selection
    pageDiv.addEventListener('click', (e) => {
        if (pdfState.addingText) {
            pdfState.textPageIndex = pageNum - 1;
            showModal('pdfTextModal');
            return;
        }
        
        if (e.ctrlKey || e.metaKey) {
            togglePageSelection(pageNum);
        }
    });
    
    // Drag and drop for reordering
    setupPageDragDrop(pageDiv);
    
    pdfPagesContainer.appendChild(pageDiv);
    pdfState.pages.push(pageNum);
}

// Toggle page selection
function togglePageSelection(pageNum) {
    const pageDiv = document.querySelector(`[data-page-num="${pageNum}"]`);
    if (pdfState.selectedPages.has(pageNum)) {
        pdfState.selectedPages.delete(pageNum);
        pageDiv.classList.remove('selected');
    } else {
        pdfState.selectedPages.add(pageNum);
        pageDiv.classList.add('selected');
    }
}

// Setup page drag and drop for reordering
function setupPageDragDrop(pageDiv) {
    pageDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', pageDiv.dataset.pageNum);
        pageDiv.style.opacity = '0.5';
    });
    
    pageDiv.addEventListener('dragend', () => {
        pageDiv.style.opacity = '1';
    });
    
    pageDiv.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    pageDiv.addEventListener('drop', async (e) => {
        e.preventDefault();
        const draggedPageNum = parseInt(e.dataTransfer.getData('text/plain'));
        const targetPageNum = parseInt(pageDiv.dataset.pageNum);
        
        if (draggedPageNum !== targetPageNum) {
            await reorderPages(draggedPageNum, targetPageNum);
        }
    });
}

// Reorder pages
async function reorderPages(fromPage, toPage) {
    try {
        showLoading(true);
        
        const newPDF = await PDFLib.PDFDocument.create();
        const pages = await newPDF.copyPages(pdfState.currentPDF, 
            Array.from({length: pdfState.currentPDF.getPageCount()}, (_, i) => i));
        
        // Reorder logic
        const fromIndex = fromPage - 1;
        const toIndex = toPage - 1;
        
        const reorderedPages = [...pages];
        const [movedPage] = reorderedPages.splice(fromIndex, 1);
        reorderedPages.splice(toIndex, 0, movedPage);
        
        reorderedPages.forEach(page => newPDF.addPage(page));
        
        const newPDFBytes = await newPDF.save();
        pdfState.pdfBytes = newPDFBytes;
        pdfState.currentPDF = await PDFLib.PDFDocument.load(newPDFBytes);
        
        const loadingTask = pdfjsLib.getDocument({data: newPDFBytes});
        pdfState.pdfDoc = await loadingTask.promise;
        
        await renderAllPages();
        showToast('Pages reordered', 'success');
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'Reorder Pages');
    }
}

// Add text annotation
document.getElementById('pdfAddText').addEventListener('click', () => {
    pdfState.addingText = true;
    showToast('Click on a page to add text', 'info');
});

document.getElementById('pdfTextCancel').addEventListener('click', () => {
    hideModal('pdfTextModal');
    pdfState.addingText = false;
    pdfState.textPageIndex = null;
});

document.getElementById('pdfTextAdd').addEventListener('click', async () => {
    const text = document.getElementById('pdfTextInput').value;
    const size = parseInt(document.getElementById('pdfTextSize').value);
    const color = document.getElementById('pdfTextColor').value;
    
    if (!text) {
        showToast('Please enter text', 'error');
        return;
    }
    
    try {
        showLoading(true);
        await addTextToPDF(text, size, color, pdfState.textPageIndex);
        
        document.getElementById('pdfTextInput').value = '';
        hideModal('pdfTextModal');
        pdfState.addingText = false;
        pdfState.textPageIndex = null;
        
        showLoading(false);
        showToast('Text added successfully', 'success');
    } catch (error) {
        showLoading(false);
        handleError(error, 'Add Text');
    }
});

// Add text to PDF
async function addTextToPDF(text, size, color, pageIndex) {
    const hexColor = PDFLib.rgb(
        parseInt(color.substr(1, 2), 16) / 255,
        parseInt(color.substr(3, 2), 16) / 255,
        parseInt(color.substr(5, 2), 16) / 255
    );
    
    const page = pdfState.currentPDF.getPage(pageIndex);
    const {width, height} = page.getSize();
    
    page.drawText(text, {
        x: 50,
        y: height - 50,
        size: size,
        color: hexColor
    });
    
    const newPDFBytes = await pdfState.currentPDF.save();
    pdfState.pdfBytes = newPDFBytes;
    pdfState.currentPDF = await PDFLib.PDFDocument.load(newPDFBytes);
    
    const loadingTask = pdfjsLib.getDocument({data: newPDFBytes});
    pdfState.pdfDoc = await loadingTask.promise;
    
    await renderAllPages();
}

// Rotate page
document.getElementById('pdfRotate').addEventListener('click', async () => {
    if (pdfState.selectedPages.size === 0) {
        showToast('Please select pages to rotate (Ctrl+Click)', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        pdfState.selectedPages.forEach(pageNum => {
            const page = pdfState.currentPDF.getPage(pageNum - 1);
            page.setRotation(PDFLib.degrees((page.getRotation().angle + 90) % 360));
        });
        
        const newPDFBytes = await pdfState.currentPDF.save();
        pdfState.pdfBytes = newPDFBytes;
        pdfState.currentPDF = await PDFLib.PDFDocument.load(newPDFBytes);
        
        const loadingTask = pdfjsLib.getDocument({data: newPDFBytes});
        pdfState.pdfDoc = await loadingTask.promise;
        
        await renderAllPages();
        pdfState.selectedPages.clear();
        
        showToast('Pages rotated', 'success');
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'Rotate Page');
    }
});

// Delete pages
document.getElementById('pdfDelete').addEventListener('click', async () => {
    if (pdfState.selectedPages.size === 0) {
        showToast('Please select pages to delete (Ctrl+Click)', 'warning');
        return;
    }
    
    if (!confirm(`Delete ${pdfState.selectedPages.size} page(s)?`)) {
        return;
    }
    
    try {
        showLoading(true);
        
        const newPDF = await PDFLib.PDFDocument.create();
        const totalPages = pdfState.currentPDF.getPageCount();
        const pagesToKeep = Array.from({length: totalPages}, (_, i) => i)
            .filter(i => !pdfState.selectedPages.has(i + 1));
        
        if (pagesToKeep.length === 0) {
            throw new Error('Cannot delete all pages');
        }
        
        const pages = await newPDF.copyPages(pdfState.currentPDF, pagesToKeep);
        pages.forEach(page => newPDF.addPage(page));
        
        const newPDFBytes = await newPDF.save();
        pdfState.pdfBytes = newPDFBytes;
        pdfState.currentPDF = await PDFLib.PDFDocument.load(newPDFBytes);
        
        const loadingTask = pdfjsLib.getDocument({data: newPDFBytes});
        pdfState.pdfDoc = await loadingTask.promise;
        
        await renderAllPages();
        pdfState.selectedPages.clear();
        
        showToast('Pages deleted', 'success');
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'Delete Pages');
    }
});

// Merge PDFs
document.getElementById('pdfMerge').addEventListener('click', async () => {
    if (pdfState.uploadedPDFs.length < 2) {
        showToast('Please upload multiple PDFs to merge', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const mergedPDF = await PDFLib.PDFDocument.create();
        
        for (const file of pdfState.uploadedPDFs) {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPDF.addPage(page));
        }
        
        const mergedPDFBytes = await mergedPDF.save();
        pdfState.pdfBytes = mergedPDFBytes;
        pdfState.currentPDF = await PDFLib.PDFDocument.load(mergedPDFBytes);
        
        const loadingTask = pdfjsLib.getDocument({data: mergedPDFBytes});
        pdfState.pdfDoc = await loadingTask.promise;
        
        await renderAllPages();
        
        showToast('PDFs merged successfully', 'success');
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'Merge PDFs');
    }
});

// Split PDF
document.getElementById('pdfSplit').addEventListener('click', async () => {
    if (pdfState.selectedPages.size === 0) {
        showToast('Please select pages to extract (Ctrl+Click)', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const newPDF = await PDFLib.PDFDocument.create();
        const selectedPageIndices = Array.from(pdfState.selectedPages).map(p => p - 1);
        const pages = await newPDF.copyPages(pdfState.currentPDF, selectedPageIndices);
        pages.forEach(page => newPDF.addPage(page));
        
        const newPDFBytes = await newPDF.save();
        const blob = new Blob([newPDFBytes], {type: 'application/pdf'});
        downloadFile(blob, 'extracted-pages.pdf');
        
        showToast('Pages extracted successfully', 'success');
        showLoading(false);
    } catch (error) {
        showLoading(false);
        handleError(error, 'Split PDF');
    }
});

// Download PDF
document.getElementById('pdfDownload').addEventListener('click', async () => {
    if (!pdfState.currentPDF) {
        showToast('No PDF to download', 'error');
        return;
    }
    
    try {
        const pdfBytes = await pdfState.currentPDF.save();
        const blob = new Blob([pdfBytes], {type: 'application/pdf'});
        downloadFile(blob, 'edited-document.pdf');
        showToast('PDF downloaded successfully', 'success');
    } catch (error) {
        handleError(error, 'Download PDF');
    }
});

// New PDF
document.getElementById('pdfNew').addEventListener('click', () => {
    if (confirm('Start a new PDF? Any unsaved changes will be lost.')) {
        pdfState.currentPDF = null;
        pdfState.pdfDoc = null;
        pdfState.pdfBytes = null;
        pdfState.pages = [];
        pdfState.selectedPages.clear();
        pdfState.uploadedPDFs = [];
        pdfState.textAnnotations = [];
        
        pdfPagesContainer.innerHTML = '';
        pdfUploadArea.style.display = 'block';
        pdfToolbar.style.display = 'none';
        pdfCanvasContainer.style.display = 'none';
        pdfFileInput.value = '';
    }
});
