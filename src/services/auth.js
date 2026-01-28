import { ref } from 'vue'
import api from './api.js'

const STORAGE_USERS = 'ast_users'
const STORAGE_LOGGED = 'ast_loggedUser'
const TOKEN_KEY = 'ast_token'

function readUsers() {
  const raw = localStorage.getItem(STORAGE_USERS)
  return raw ? JSON.parse(raw) : []
}
function writeUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users))
}

const user = ref(null)
// initialize from localStorage if present
try {
  const raw = localStorage.getItem(STORAGE_LOGGED)
  user.value = raw ? JSON.parse(raw) : null
} catch {
  user.value = null
}

// new: ensure api has token on startup (so dashboard requests are authenticated)
try {
  const t = localStorage.getItem(TOKEN_KEY)
  if (t && api.setToken) api.setToken(t)
} catch (e) { /* ignore */ }

function emitAuthChange() {
  try {
    window.dispatchEvent(new CustomEvent('auth-change', { detail: user.value }))
  } catch (e) { /* ignore */ }
}

const auth = {
  user, // reactive ref; components can read auth.user.value

  // currentUser() kept for compatibility
  currentUser() {
    return user.value
  },

  isLoggedIn() {
    return !!user.value
  },

  async register({ username, email, password, role }) {
    if (api.baseUrl) {
      const res = await api.post('/register', { username, email, password, role })
      if (res.token) {
        api.setToken && api.setToken(res.token)
        localStorage.setItem(TOKEN_KEY, res.token)
      }
      const u = res.user || res
      user.value = u
      localStorage.setItem(STORAGE_LOGGED, JSON.stringify(u))
      emitAuthChange()
      return u
    }
    const users = readUsers()
    if (users.find(u => u.username === username || u.email === email)) {
      throw new Error('Username or email already exists')
    }
    const newUser = { id: Date.now().toString(), username, email, password, role }
    users.push(newUser)
    writeUsers(users)
    user.value = newUser
    localStorage.setItem(STORAGE_LOGGED, JSON.stringify(newUser))
    emitAuthChange()
    return newUser
  },

  async login({ email, password }) {
    if (api.baseUrl) {
      const res = await api.post('/login', { email, password })
      if (res.token) {
        api.setToken && api.setToken(res.token)
        localStorage.setItem(TOKEN_KEY, res.token)
      }
      const u = res.user || res
      user.value = u
      localStorage.setItem(STORAGE_LOGGED, JSON.stringify(u))
      emitAuthChange()
      return u
    }
    const users = readUsers()
    const u = users.find(x => x.email === email && x.password === password)
    if (!u) throw new Error('Invalid credentials')
    user.value = u
    localStorage.setItem(STORAGE_LOGGED, JSON.stringify(u))
    emitAuthChange()
    return u
  },

  logout() {
    user.value = null
    localStorage.removeItem(STORAGE_LOGGED)
    localStorage.removeItem(TOKEN_KEY)
    if (api.clearToken) api.clearToken()
    emitAuthChange()
  },

  async getUsersByRole(role) {
    if (api.baseUrl) {
      return api.get(`/users?role=${encodeURIComponent(role)}`)
    }
    return readUsers().filter(u => u.role === role)
  }
}

export default auth