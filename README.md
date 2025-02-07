# Canvas Measurement Arrow App

A versatile JavaScript library and application for drawing customizable measurement arrows on HTML5 Canvas. Perfect for technical drawings, annotations, and measurement visualizations.

## Features

- Draw freehand lines and measurement arrows
- Highly customizable measurement arrows with:
  - Adjustable pilar lines
  - Distance lines with custom offsets
  - Configurable arrow heads
  - Customizable text positioning and styling
  - Line extensions
- Real-time parameter adjustments
- Two modes: Draw and Measure
- Responsive canvas layout

## Installation

1. Clone the repository:

```bash
git clone https://github.com/drhootch/canvas-measurement-arrows-drawer
```

2. Include the necessary files in your HTML:

```html
<script type="module" src="drawMeasurementArrow.js"></script>
<script type="module" src="app.js"></script>
```

## Usage

### Basic Implementation

```javascript
import { drawMeasurementArrow } from './drawMeasurementArrow.js';
const canvas = document.getElementById('yourCanvas');
const ctx = canvas.getContext('2d');
drawMeasurementArrow({
ctx: ctx,
startPoint: { x: 100, y: 100 },
endPoint: { x: 300, y: 100 },
pilarLinesParams: {
height: 50,
thickness: 1,
color: '#000000'
},
distanceLineParams: {
offsetFromPoint: 25,
thickness: 1,
color: '#000000'
},
textParams: {
position: 'topCenter',
color: '#000000',
size: 12,
offsetX: 0,
offsetY: 0,
rotation: 0,
align: 'center',
text: '' // Empty for automatic distance measurement
},
arrowsParams: {
position: 'outside',
thickness: 1,
color: '#000000',
filled: true
},
extendLineAfterStartArrow: 20,
extendLineAfterEndArrow: 20
});
```

### Configuration Options

#### Pilar Lines Parameters

```javascript
pilarLinesParams: {
height: number, // Height of the vertical lines
thickness: number, // Line thickness
color: string // Color in any valid CSS format
}
```

#### Distance Line Parameters

```javascript
distanceLineParams: {
offsetFromPoint: number, // Distance from the points
thickness: number, // Line thickness
color: string // Color in any valid CSS format
}
```

#### Text Parameters

```javascript
textParams: {
position: string, // 'topLeft', 'topCenter', 'topRight',
// 'middleLeft', 'middleCenter', 'middleRight',
// 'bottomLeft', 'bottomCenter', 'bottomRight'
color: string, // Text color
size: number, // Font size in pixels
offsetX: number, // Horizontal offset
offsetY: number, // Vertical offset
rotation: number, // Rotation in degrees
align: string, // 'inside', 'outside', or 'center'
text: string // Custom text (empty for automatic distance)
}
```

#### Arrows Parameters

```javascript
arrowsParams: {
position: string, // 'inside' or 'outside'
thickness: number, // Line thickness
color: string, // Color in any valid CSS format
filled: boolean // Whether to fill the arrow head
}
```

#### Line Extensions

```javascript
extendLineAfterStartArrow: number, // Extension after the start point
extendLineAfterEndArrow: number // Extension after the end point
```

## License

This project is open-sourced under the MIT License - see the LICENSE file for details.

## Author

© 2025 Hootch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.