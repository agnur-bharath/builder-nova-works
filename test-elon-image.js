// Test script to verify Elon.png image loading
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Elon.png image availability...');

const imagePath = './public/images/Elon.png';

try {
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log('✅ Elon.png found successfully!');
    console.log(`📁 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📅 Last modified: ${stats.mtime}`);
    console.log(`🔗 Full path: ${path.resolve(imagePath)}`);
  } else {
    console.log('❌ Elon.png not found at:', imagePath);
    console.log('💡 Please ensure the image exists at:', path.resolve(imagePath));
  }
} catch (error) {
  console.error('❌ Error checking Elon.png:', error.message);
}

// Check if public/images directory exists
const imagesDir = './public/images';
try {
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    console.log('\n📂 Images directory contents:');
    files.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } else {
    console.log('❌ Images directory not found:', imagesDir);
  }
} catch (error) {
  console.error('❌ Error reading images directory:', error.message);
}
