import { drawMeasurementArrow } from './drawMeasurementArrow.js';

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentMode = 'measure'; // or 'draw'

// Set initial drawing style
ctx.strokeStyle = '#000000';
ctx.lineWidth = 1;
ctx.lineCap = 'round';

// Event listeners for mouse interactions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Add mode switching logic
const drawModeBtn = document.getElementById('drawMode');
const measureModeBtn = document.getElementById('measureMode');

function setMode(mode) {
    currentMode = mode;
    drawModeBtn.classList.toggle('active', mode === 'draw');
    measureModeBtn.classList.toggle('active', mode === 'measure');
    
    // Toggle parameter sections
    document.querySelector('.draw-params').classList.toggle('active', mode === 'draw');
    document.querySelector('.measure-params').classList.toggle('active', mode === 'measure');
    
    // Reset states
    isDrawing = false;
    firstPoint = null;
    
    // Clear canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawModeBtn.addEventListener('click', () => setMode('draw'));
measureModeBtn.addEventListener('click', () => setMode('measure'));

function startDrawing(e) {
    if (currentMode !== 'draw') return;
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing || currentMode !== 'draw') return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Example usage:
drawMeasurementArrow({
    ctx: ctx,
    startPoint: { x: 100, y: 100 },
    endPoint: { x: 300, y: 100 },
    pilarLinesParams: { height: 50, thickness: 1, color: '#000000' },
    distanceLineParams: { offsetFromPoint: 25, thickness: 1, color: '#000000' },
    textParams: { 
        position: 'topCenter',
        color: '#000000',
        size: 12,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        align: 'center',
        text: ''
    },
    arrowsParams: { position: 'outside', thickness: 1, color: '#000000', filled: true },
    extendLineAfterStartArrow: 20,
    extendLineAfterEndArrow: 20
});


// Function to get current configuration from the side menu
function getCurrentConfig() {
    return {
        pilarLinesParams: {
            height: Number(document.getElementById('pilarHeight').value),
            thickness: Number(document.getElementById('pilarThickness').value),
            color: document.getElementById('pilarColor').value
        },
        distanceLineParams: {
            offsetFromPoint: Number(document.getElementById('distanceOffset').value),
            thickness: Number(document.getElementById('distanceThickness').value),
            color: document.getElementById('distanceColor').value
        },
        textParams: {
            position: document.getElementById('textPosition').value,
            color: document.getElementById('textColor').value,
            size: Number(document.getElementById('textSize').value),
            offsetX: Number(document.getElementById('textOffsetX').value),
            offsetY: Number(document.getElementById('textOffsetY').value),
            rotation: Number(document.getElementById('textRotation').value),
            align: document.getElementById('textAlign').value,
            text: document.getElementById('textContent').value
        },
        arrowsParams: {
            position: document.getElementById('arrowPosition').value,
            thickness: Number(document.getElementById('arrowThickness').value),
            color: document.getElementById('arrowColor').value,
            filled: document.getElementById('arrowFilled').checked
        },
        extendLineAfterStartArrow: Number(document.getElementById('startExtension').value),
        extendLineAfterEndArrow: Number(document.getElementById('endExtension').value)
    };
}

// Replace the existing click event listener with this:
let firstPoint = null;

canvas.addEventListener('click', (e) => {
    if (currentMode !== 'measure') return;
    
    if (!firstPoint) {
        firstPoint = { x: e.offsetX, y: e.offsetY };
    } else {
        const config = getCurrentConfig();
        drawMeasurementArrow({
            ctx: ctx,
            startPoint: firstPoint,
            endPoint: { x: e.offsetX, y: e.offsetY },
            pilarLinesParams: config.pilarLinesParams,
            distanceLineParams: config.distanceLineParams,
            textParams: config.textParams,
            arrowsParams: config.arrowsParams,
            extendLineAfterStartArrow: config.extendLineAfterStartArrow,
            extendLineAfterEndArrow: config.extendLineAfterEndArrow
        });
        firstPoint = null;
    }
});

// Add event listeners to update measurements in real-time
const configInputs = document.querySelectorAll('input, select');
configInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (firstPoint && currentMode === 'measure') {
            // If we have a first point, clear the canvas and redraw the temporary point
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(firstPoint.x, firstPoint.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
});

// Add drawing parameter handlers
document.getElementById('drawColor').addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});

document.getElementById('drawThickness').addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
}); 