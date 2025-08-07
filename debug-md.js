#!/usr/bin/env node

const { CueModeRenderer } = require('./cuemode-renderer');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🎯 CueMode Debug Tool');
  console.log('');
  console.log('Usage: node debug-md.js <markdown-file-path> [options]');
  console.log('');
  console.log('Examples:');
  console.log('  node debug-md.js test.md');
  console.log('  node debug-md.js /path/to/file.md --fontSize=30 --theme=dark');
  console.log('');
  console.log('Options:');
  console.log('  --fontSize=<number>     Font size (default: 25)');
  console.log('  --lineHeight=<number>   Line height (default: 1)');
  console.log('  --padding=<number>      Padding (default: 10)');
  console.log('  --theme=<theme>        Theme (default: rose)');
  console.log('  --output=<file>       Output filename');
  process.exit(1);
}

const markdownFile = args[0];

// Parse options
const options = {};
args.slice(1).forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    if (key && value) {
      // Try to convert to number
      const numValue = parseFloat(value);
      options[key] = isNaN(numValue) ? value : numValue;
    }
  }
});

console.log('🚀 Starting CueMode debug renderer...');
console.log('');
console.log('📂 Input file:', markdownFile);
console.log('⚙️ Configuration options:', options);

try {
  const renderer = new CueModeRenderer(options);
  const result = renderer.renderFile(markdownFile, options.output);
  
  console.log('');
  console.log('✅ Rendering completed!');
  console.log('📄 Output file:', result.outputFile);
  console.log('📊 Statistics:');
  console.log('  - Original HTML length:', result.stats.originalLength);
  console.log('  - Logical block count:', result.stats.blockCount);
  console.log('  - Filtered block count:', result.stats.filteredCount);
  console.log('');
  console.log('🌐 Open in browser for debugging:');
  console.log(`  open ${result.outputFile}`);
  console.log('');
  console.log('🎛️ Debug features:');
  console.log('  - Click any block to view details');
  console.log('  - Check browser console for detailed information');
  
  // Auto-open browser (macOS)
  if (process.platform === 'darwin') {
    const { exec } = require('child_process');
    exec(`open ${result.outputFile}`, (error) => {
      if (!error) {
        console.log('🎉 Debug file opened in browser');
      }
    });
  }
  
} catch (error) {
  console.error('❌ Rendering failed:', error.message);
  process.exit(1);
}
