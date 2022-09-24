import path from 'path'
import process from 'process'

const REPO_DIR = path.resolve(__dirname, '../..')
const repoRel = (relPath: string): string => path.resolve(REPO_DIR, relPath)

const getenv = function (varname: string, fallback = '', warn = true): string {
  if (warn && !Object.prototype.hasOwnProperty.call(process.env, varname)) {
    console.warn(`Warning:: ${varname} not set; falling back to: '${fallback}'`)
  }
  return process.env[varname] ?? fallback
}

export const config = {
  // Dir:
  REPO_DIR: REPO_DIR,
  SRC_DIR: repoRel('src'),
  DIST_DIR: repoRel('dist'),
  DIST_FRONTEND_DIR: repoRel('dist/frontend'),
  // Env:
  IS_PROD: getenv('NODE_ENV', 'development') === 'production',
  PORT: Number(getenv('PORT', '3000', false)),
  DATABASE_URL: getenv('DATABASE_URL', `sqlite:${repoRel('local-sqlite.db')}`),
  SECRET_KEY: getenv('SECRET_KEY', 'not-really-a-secret--just-the-fallback'),
  EXTRA_LATENCY: Number(getenv('EXTRA_LATENCY', '0', false))
} as const
