const DEFAULT_HOST = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : 'localhost'
// prefer explicit env var, otherwise try device hostname:3000
const BASE = import.meta.env.VITE_API_BASE || `https://api.สุรศักดิ์มนตรี.com`
// const BASE = import.meta.env.VITE_API_BASE || `http://localhost:3000`
const TOKEN_KEY = 'ast_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(method, path, body) {
  if (!BASE) throw new Error('No API base configured')
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  // debug: log outgoing request
  console.debug(`[API] => ${method} ${BASE + path}`, { body, tokenPresent: !!token })

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const status = res.status
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  // debug: log incoming response
  console.debug(`[API] <= ${method} ${path} ${status}`, data)

  const ok = res.ok
  if (!ok) {
    const msg = (data && data.message) ? data.message : (typeof data === 'string' ? data : res.statusText)
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return data
}

export default {
  baseUrl: BASE,
  get(path) { return request('GET', path) },
  post(path, body) { return request('POST', path, body) },
  put(path, body) { return request('PUT', path, body) },
  del(path) { return request('DELETE', path) },
  setToken,
  clearToken,
}
