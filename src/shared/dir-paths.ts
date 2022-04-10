import path from 'path'

const repoDir = path.resolve(__dirname, '../..')
const srcDir = path.resolve(repoDir, 'src')
const distDir = path.resolve(repoDir, 'dist')
const distTscDir = path.resolve(repoDir, 'dist/tsc')
const distParcelDir = path.resolve(repoDir, 'dist/parcel')

export { repoDir, srcDir, distDir, distTscDir, distParcelDir }
