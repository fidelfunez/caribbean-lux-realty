import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if ImageMagick is installed
function checkImageMagick() {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    try {
      execSync('convert --version', { stdio: 'ignore' });
      return true;
    } catch (error2) {
      console.log('ImageMagick not found. Please install it first:');
      console.log('macOS: brew install imagemagick');
      console.log('Ubuntu: sudo apt-get install imagemagick');
      console.log('Windows: Download from https://imagemagick.org/');
      return false;
    }
  }
}

// Optimize images to WebP format
function optimizeImages() {
  const photosDir = path.join(__dirname, '../public/Photos');
  const files = fs.readdirSync(photosDir);
  
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) &&
    !file.includes('.DS_Store')
  );
  
  console.log('Found images to optimize:', imageFiles);
  
  imageFiles.forEach(file => {
    const inputPath = path.join(photosDir, file);
    const outputPath = path.join(photosDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    try {
      // Use magick command for ImageMagick 7, fallback to convert for older versions
      let command;
      try {
        command = `magick "${inputPath}" -quality 80 "${outputPath}"`;
        execSync(command);
      } catch (magickError) {
        command = `convert "${inputPath}" -quality 80 "${outputPath}"`;
        execSync(command);
      }
      
      // Get file sizes
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} -> ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${file}:`, error.message);
    }
  });
}

// Main execution
console.log('🚀 Starting image optimization...');
if (!checkImageMagick()) {
  process.exit(1);
}

optimizeImages();
console.log('✅ Image optimization complete!');
console.log('\n📝 Next steps:');
console.log('1. Update image references in your code to use .webp files');
console.log('2. Consider using <picture> elements for fallback support');
console.log('3. Test the performance improvement'); 