# GLB Viewer

A web-based 3D model viewer for GLB files with advanced lighting and controls.

## Features

- Drag-and-drop GLB file upload
- Advanced lighting controls (ambient, spotlight, environment)
- Model rotation and position controls
- Ground plane with visibility toggle
- Unit conversion (meters/centimeters) for different model scales
- Shadow rendering with quality controls
- Bloom post-processing effect

## Getting Started

### Prerequisites

- Node.js and npm installed on your system
- A modern web browser

### Installation

1. Open the project in VS Code or your preferred editor

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Usage

1. Drag and drop a GLB file onto the drop zone
2. Use the control panel on the left to adjust:
   - Model units (meters/centimeters)
   - Lighting settings
   - Shadow quality
   - Ground plane visibility
   - Model rotation speed
   - Model position

To stop the development server, press `Ctrl+C` in the terminal.

## File Handling

The GLB files you upload aren't stored in the project folder. Instead, they are handled in memory using the browser's URL.createObjectURL API. This means:
- You don't need to store GLB files in the project
- Each time you want to view a model, you'll need to drag and drop it again
- The files remain in their original location on your computer
- When you clear the model, close the browser, or refresh the page, the memory is cleared

## Built With

- React
- Vite
- Three.js
- React Three Fiber
- Leva (for controls)
- React Three Drei
