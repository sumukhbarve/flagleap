import path from 'path'
import process from 'process'
import { _ } from 'monoduck'

const repoDir = path.resolve(__dirname, '../..')
const repoRel = (relPath: string): string => path.resolve(repoDir, relPath)

const getenv = function (varname: string, fallback = '', warn = true): string {
  if (warn && !_.keyHas(process.env, varname)) {
    console.warn(`Warning:: ${varname} not set; falling back to: '${fallback}'`)
  }
  return process.env[varname] ?? fallback
}

export const config = {
  // Dir:
  repoDir,
  srcDir: repoRel('src'),
  distDir: repoRel('dist'),
  distFrontendDir: repoRel('dist/frontend'),
  // Env:
  PORT: Number(getenv('PORT', '3000', false)),
  DATABASE_URL: getenv('DATABASE_URL', `sqlite:${repoRel('local-sqlite.db')}`),
  SECRET_KEY: getenv('SECRET_KEY', 'not-really-a-secret--just-the-fallback')
}
