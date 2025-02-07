/**
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * @typedef {Object} PilarLinesParams
 * @property {number} height - Height of pilar lines
 * @property {number} thickness - Line thickness
 * @property {string} color - Line color
 */

/**
 * @typedef {Object} DistanceLineParams
 * @property {number} offsetFromPoint - Offset from point
 * @property {number} thickness - Line thickness
 * @property {string} color - Line color
 */

/**
 * @typedef {Object} TextParams
 * @property {'topLeft'|'topCenter'|'topRight'|'middleLeft'|'middleCenter'|'middleRight'|'bottomLeft'|'bottomCenter'|'bottomRight'} position
 * @property {string} color - Text color
 * @property {number} size - Font size
 * @property {number} offsetX - X offset
 * @property {number} offsetY - Y offset
 * @property {number} rotation - Rotation in degrees
 * @property {'inside'|'outside'|'center'} align
 * @property {string} text - Text to display
 */

/**
 * @typedef {Object} ArrowsParams
 * @property {'inside'|'outside'} position
 * @property {number} thickness
 * @property {string} color
 * @property {boolean} filled
 */

const CONSTANTS = {
    ARROW_SIZE: 10,
    ARROW_HEAD_WIDTH_RATIO: 0.25,
    DEFAULT_FONT_FAMILY: 'Arial',
    PERPENDICULAR_ANGLE: Math.PI / 2
};

/**
 * Rotates a point around a center point by a given angle
 */
function rotatePoint(point, center, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return {
        x: center.x + (dx * cos - dy * sin),
        y: center.y + (dx * sin + dy * cos)
    };
}

/**
 * Draws pilar lines
 */
function drawPilarLines(ctx, startPoint, endPoint, angle, params) {
    ctx.beginPath();
    ctx.strokeStyle = params.color;
    ctx.lineWidth = params.thickness;
    
    const startPilarEnd = rotatePoint(
        { x: startPoint.x, y: startPoint.y + params.height },
        startPoint,
        angle
    );
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(startPilarEnd.x, startPilarEnd.y);
    
    const endPilarEnd = rotatePoint(
        { x: endPoint.x, y: endPoint.y + params.height },
        endPoint,
        angle
    );
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(endPilarEnd.x, endPilarEnd.y);
    ctx.stroke();
}

/**
 * Draws an arrow head
 */
function drawArrowHead(ctx, tip, angle, params, isStart) {
    const arrowPoint1 = rotatePoint(
        { 
            x: tip.x + (isStart ? -CONSTANTS.ARROW_SIZE : CONSTANTS.ARROW_SIZE), 
            y: tip.y - CONSTANTS.ARROW_SIZE * CONSTANTS.ARROW_HEAD_WIDTH_RATIO 
        },
        tip,
        angle + (params.position === 'inside' ? Math.PI : 0)
    );
    const arrowPoint2 = rotatePoint(
        { 
            x: tip.x + (isStart ? -CONSTANTS.ARROW_SIZE : CONSTANTS.ARROW_SIZE), 
            y: tip.y + CONSTANTS.ARROW_SIZE * CONSTANTS.ARROW_HEAD_WIDTH_RATIO 
        },
        tip,
        angle + (params.position === 'inside' ? Math.PI : 0)
    );

    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
    ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
    
    if (params.filled) {
        ctx.closePath();
        ctx.fill();
    }
    ctx.stroke();
}

/**
 * Calculates text position based on alignment and offset
 */
function calculateTextPosition(position, startOffset, endOffset, middlePoint, textWidth, textHeight, params, angle) {
    // Calculate base positions relative to the measurement line
    const positions = {
        topLeft: rotatePoint(
            { 
                x: startOffset.x + params.offsetX + 
                    (params.align === 'outside' ? -textWidth : 
                     params.align === 'center' ? -textWidth/2 : 0), 
                y: startOffset.y - textHeight + params.offsetY 
            },
            startOffset,
            angle
        ),
        topCenter: rotatePoint(
            { 
                x: middlePoint.x + params.offsetX + 
                    (params.align === 'outside' ? -textWidth/2 : 
                     params.align === 'center' ? 0 : textWidth/2), 
                y: middlePoint.y - textHeight + params.offsetY 
            },
            middlePoint,
            angle
        ),
        topRight: rotatePoint(
            { 
                x: endOffset.x + params.offsetX + 
                    (params.align === 'outside' ? textWidth : 
                     params.align === 'center' ? textWidth/2 : 0), 
                y: endOffset.y - textHeight + params.offsetY 
            },
            endOffset,
            angle
        ),
        middleLeft: rotatePoint(
            { 
                x: startOffset.x + params.offsetX + 
                    (params.align === 'outside' ? -textWidth : 
                     params.align === 'center' ? -textWidth/2 : 0), 
                y: startOffset.y + params.offsetY 
            },
            startOffset,
            angle
        ),
        middleCenter: {
            x: middlePoint.x + params.offsetX + 
                (params.align === 'outside' ? -textWidth/2 : 
                 params.align === 'center' ? 0 : textWidth/2),
            y: middlePoint.y + params.offsetY
        },
        middleRight: rotatePoint(
            { 
                x: endOffset.x + params.offsetX + 
                    (params.align === 'outside' ? textWidth : 
                     params.align === 'center' ? textWidth/2 : 0), 
                y: endOffset.y + params.offsetY 
            },
            endOffset,
            angle
        ),
        bottomLeft: rotatePoint(
            { 
                x: startOffset.x + params.offsetX + 
                    (params.align === 'outside' ? -textWidth : 
                     params.align === 'center' ? -textWidth/2 : 0), 
                y: startOffset.y + textHeight + params.offsetY 
            },
            startOffset,
            angle
        ),
        bottomCenter: rotatePoint(
            { 
                x: middlePoint.x + params.offsetX + 
                    (params.align === 'outside' ? -textWidth/2 : 
                     params.align === 'center' ? 0 : textWidth/2), 
                y: middlePoint.y + textHeight + params.offsetY 
            },
            middlePoint,
            angle
        ),
        bottomRight: rotatePoint(
            { 
                x: endOffset.x + params.offsetX + 
                    (params.align === 'outside' ? textWidth : 
                     params.align === 'center' ? textWidth/2 : 0), 
                y: endOffset.y + textHeight + params.offsetY 
            },
            endOffset,
            angle
        )
    };

    return positions[position] || positions.middleCenter;
}

/**
 * Draws a measurement arrow with customizable styling
 */
export function drawMeasurementArrow({
    ctx,
    startPoint,
    endPoint,
    pilarLinesParams = { height: 50, thickness: 1, color: '#000000' },
    distanceLineParams = { offsetFromPoint: 0, thickness: 1, color: '#000000' },
    textParams = { 
        position: 'topCenter', 
        color: '#000000', 
        size: 12,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        align: 'inside',
        text: ''
    },
    arrowsParams = { position: 'outside', thickness: 1, color: '#000000', filled: false },
    extendLineAfterStartArrow = 0,
    extendLineAfterEndArrow = 0
}) {
    ctx.save();

    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Draw pilar lines
    drawPilarLines(ctx, startPoint, endPoint, angle, pilarLinesParams);
    
    // Calculate offset points for distance line
    const startOffset = rotatePoint(
        { x: startPoint.x + distanceLineParams.offsetFromPoint, y: startPoint.y },
        startPoint,
        angle + CONSTANTS.PERPENDICULAR_ANGLE
    );
    const endOffset = rotatePoint(
        { x: endPoint.x + distanceLineParams.offsetFromPoint, y: endPoint.y },
        endPoint,
        angle + CONSTANTS.PERPENDICULAR_ANGLE
    );
    
    // Draw distance line
    ctx.beginPath();
    ctx.strokeStyle = distanceLineParams.color;
    ctx.lineWidth = distanceLineParams.thickness;
    
    const startExtend = rotatePoint(
        { x: startOffset.x - extendLineAfterStartArrow, y: startOffset.y },
        startOffset,
        angle
    );
    const endExtend = rotatePoint(
        { x: endOffset.x + extendLineAfterEndArrow, y: endOffset.y },
        endOffset,
        angle
    );
    
    if (arrowsParams.position === 'outside') {
        ctx.moveTo(startExtend.x, startExtend.y);
        ctx.lineTo(endExtend.x, endExtend.y);
    } else {
        ctx.moveTo(startOffset.x, startOffset.y);
        ctx.lineTo(endOffset.x, endOffset.y);
    }
    ctx.stroke();
    
    // Draw arrows
    ctx.strokeStyle = arrowsParams.color;
    ctx.fillStyle = arrowsParams.color;
    ctx.lineWidth = arrowsParams.thickness;
    
    const startArrowTip = arrowsParams.position === 'inside' ? 
        rotatePoint(
            { x: startOffset.x + CONSTANTS.ARROW_SIZE/2, y: startOffset.y },
            startOffset,
            angle
        ) : startOffset;
    
    const endArrowTip = arrowsParams.position === 'inside' ? 
        rotatePoint(
            { x: endOffset.x - CONSTANTS.ARROW_SIZE/2, y: endOffset.y },
            endOffset,
            angle
        ) : endOffset;
    
    drawArrowHead(ctx, startArrowTip, angle, arrowsParams, true);
    drawArrowHead(ctx, endArrowTip, angle, arrowsParams, false);
    
    // Draw text
    ctx.font = `${textParams.size}px ${CONSTANTS.DEFAULT_FONT_FAMILY}`;
    ctx.fillStyle = textParams.color;
    
    const text = textParams.text || `${Math.round(distance)}px`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = textParams.size;
    
    const middlePoint = {
        x: (startOffset.x + endOffset.x) / 2,
        y: (startOffset.y + endOffset.y) / 2
    };
    
    const textPosition = calculateTextPosition(
        textParams.position,
        startOffset,
        endOffset,
        middlePoint,
        textWidth,
        textHeight,
        textParams,
        angle
    );
    
    // Draw rotated text
    ctx.save();
    ctx.translate(textPosition.x, textPosition.y);
    
    const totalRotation = angle + (textParams.rotation * Math.PI / 180);
    ctx.rotate(totalRotation);
    
    ctx.textAlign = textParams.position.includes('Center') ? 'center' : 
                   textParams.position.includes('Right') ? 'right' : 'left';
    ctx.textBaseline = textParams.position.includes('middle') ? 'middle' : 
                      textParams.position.includes('bottom') ? 'bottom' : 'top';
    
    ctx.fillText(text, 0, 0);
    ctx.restore();
    
    ctx.restore();
}
