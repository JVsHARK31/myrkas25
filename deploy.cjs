#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 R-KAS Netlify Deployment Script');
console.log('=====================================\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('📦 Building production version...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dist folder already exists\n');
}

// Check required files
const requiredFiles = [
  'netlify.toml',
  'public/_redirects',
  'dist/index.html'
];

console.log('🔍 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

console.log('\n📋 Deployment Options:');
console.log('1. Manual Deploy: Drag & drop the "dist" folder to Netlify');
console.log('2. GitHub Deploy: Connect your GitHub repo to Netlify');
console.log('3. Netlify CLI: Install and use netlify-cli for command line deploy\n');

console.log('📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md');
console.log('🌐 GitHub Repository: https://github.com/JVsHARK31/myrkas25.git');
console.log('\n🎉 Ready for deployment!');

// Display build info
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`\n📊 Build Information:`);
console.log(`   App Name: ${packageJson.name}`);
console.log(`   Version: ${packageJson.version}`);
console.log(`   Build Time: ${new Date().toLocaleString()}`);

// Check dist size
if (fs.existsSync(distPath)) {
  const stats = fs.statSync(distPath);
  console.log(`   Dist Folder: Ready for deployment`);
}

console.log('\n🚀 Happy Deploying!');