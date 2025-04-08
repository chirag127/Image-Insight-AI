const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create a simple icon with "II" text
const createIcon = (size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#4285F4'; // Google blue color
  ctx.fillRect(0, 0, size, size);
  
  // Add "II" text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('II', size / 2, size / 2);
  
  // Add a border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.05;
  ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
  
  return canvas.toBuffer('image/png');
};

// Create icons in different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const iconBuffer = createIcon(size);
  fs.writeFileSync(`icon${size}.png`, iconBuffer);
  console.log(`Created icon${size}.png`);
});

console.log('All icons generated successfully!');
