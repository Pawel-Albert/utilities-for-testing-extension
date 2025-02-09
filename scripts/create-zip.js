const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const package = require('../package.json')
const {execSync} = require('child_process')
const rimraf = require('rimraf')

const outputDir = path.join(__dirname, '../builds')
const distDir = path.join(__dirname, '../dist')

// Ensure builds directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Clean dist directory and rebuild
console.log('\n🧹 Cleaning dist directory...')
rimraf.sync(distDir)

console.log('🔨 Building project...')
try {
  execSync('npm run build', {stdio: 'inherit'})
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}

// Create zip archive
const output = fs.createWriteStream(
  path.join(outputDir, `TesterUtilities-v${package.version}.zip`)
)
const archive = archiver('zip', {
  zlib: {level: 9}
})

output.on('close', () => {
  console.log(`\n✅ Archive created: TesterUtilities-v${package.version}.zip`)
  console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n`)
})

archive.on('error', err => {
  throw err
})

archive.pipe(output)
archive.directory('dist/', false)
archive.finalize()
