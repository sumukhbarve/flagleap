import path from 'path'

// Repo root is 2 dirs up. Works with both watch-server & build-server scripts.
const repoDir = path.resolve(__dirname, '../..')
// console.log(`repoDir = ${repoDir}`)

const srcDir = path.resolve(repoDir, 'src')
const distDir = path.resolve(repoDir, 'dist')
const distFrontendDir = path.resolve(repoDir, 'dist/frontend')

export { repoDir, srcDir, distDir, distFrontendDir }
