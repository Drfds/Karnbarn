<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto p-6 border-1 bg-[rgb(34,34,34)] rounded text-white">
      <h2 class="text-2xl mb-4 text-center">สมัครสมาชิก</h2>
      <div class="space-y-3">
        <input v-model="username" placeholder="ชื่อผู้ใช้" class="w-full p-2 rounded bg-gray-700" />
        <input v-model="email" type="email" placeholder="อีเมล" class="w-full p-2 rounded bg-gray-700" />
        <input v-model="password" type="password" placeholder="รหัสผ่าน" class="w-full p-2 rounded bg-gray-700" />
        <label class="text-sm">บทบาท (role)</label>
        <select v-model="role" class="w-full p-2 rounded bg-gray-700">
          <option value="teacher">teacher</option>
          <option value="parent">parent</option>
          <option value="student">student</option>
        </select>

        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

        <div class="flex gap-2 justify-center">
          <button @click="submit" class="bg-green-600 px-4 py-2 rounded">สมัคร</button>
          <button @click="toLogin" class="bg-gray-600 px-4 py-2 rounded">ไปหน้าเข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import auth from '../../services/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.register({ username: username.value, email: email.value, password: password.value, role: role.value })
    router.push({ name: 'Dashboard' })
  } catch (e) {
    try {
      const parsed = JSON.parse(e?.message || '')
      error.value = parsed.message || String(e)
    } catch {
      error.value = e?.message || String(e)
    }
  }
}

function toLogin() {
  router.push({ name: 'Login' })
}
</script>

<style scoped>
</style>
