const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const package = require('../package.json')

const outputDir = path.join(__dirname, '../builds')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

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
