/**
 * Host half of dsh-mera-theme: exposes the Windows app light/dark mode so the
 * client can follow PowerToys' automatic light switch (and any manual OS
 * theme change) even when the Electron shell does not re-read it while running.
 *
 * The route goes through the connection service's access check — the same
 * browser-token and same-origin fence every DSH API endpoint uses — so a page
 * from another origin cannot read it.
 *
 * Windows only: on macOS (and every other platform) this module registers no
 * route and injects nothing, so the native light/dark switching is untouched.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const WINDOWS = process.platform === 'win32'
const PERSONALIZE = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'

/**
 * Read the Windows app mode ("Default app mode": 0 = dark, 1 = light).
 * @returns the scheme, or null when the registry value is unavailable.
 */
async function readOsScheme() {
  try {
    const { stdout } = await run('reg.exe', ['query', PERSONALIZE, '/v', 'AppsUseLightTheme'], {
      timeout: 2000,
      windowsHide: true,
    })
    const match = /AppsUseLightTheme\s+REG_DWORD\s+0x([0-9a-f]+)/i.exec(stdout)
    if (match === null) return null
    const value = Number.parseInt(match[1], 16)
    return Number.isNaN(value) ? null : value === 0 ? 'dark' : 'light'
  } catch {
    return null
  }
}

/** Serve { platform, scheme } to the same-origin client page. */
export function apply(ctx) {
  if (!WINDOWS) return

  let cachedAt = 0
  let cached = null
  const scheme = async () => {
    const now = Date.now()
    if (now - cachedAt < 1500) return cached
    cached = await readOsScheme()
    cachedAt = now
    return cached
  }

  ctx.inject(['webServer', 'connection'], (scope) => {
    scope.effect(() => scope.webServer.register({
      kind: 'exact',
      path: '/mera/os-scheme',
      handler: async (req, res) => {
        // Same fence as every DSH API endpoint: refuse cross-origin callers
        // (403) and requests without a live browser token (401).
        const refused = scope.connection.requestRejection(req)
        if (refused !== undefined) {
          res.writeHead(refused, { 'cache-control': 'no-store' })
          res.end(refused === 401 ? 'unauthorized' : 'forbidden')
          return
        }
        const value = await scheme()
        res.writeHead(200, {
          'content-type': 'application/json',
          'cache-control': 'no-store',
        })
        res.end(JSON.stringify({ platform: process.platform, scheme: value }))
      },
    }), 'mera-theme: os-scheme route')
  })
}
