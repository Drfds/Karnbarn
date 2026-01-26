<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto p-6 border-1 bg-[rgb(34,34,34)] rounded text-white">
      <h2 class="text-2xl mb-4 text-center">เข้าสู่ระบบ</h2>
      <div class="space-y-3">
        <input v-model="email" type="email" placeholder="อีเมล" class="w-full p-2 rounded bg-gray-700" />
        <input v-model="password" type="password" placeholder="รหัสผ่าน" class="w-full p-2 rounded bg-gray-700" />
        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>
        <div class="flex gap-2 justify-center">
          <button @click="submit" class="bg-green-600 px-4 py-2 rounded">เข้าสู่ระบบ</button>
          <button @click="toRegister" class="bg-gray-600 px-4 py-2 rounded">ไปหน้าสมัครสมาชิก</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../../services/auth.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'Dashboard' })
  } catch (e) {
    // show backend message if present (API may return JSON string or Error)
    try {
      // if e.message contains JSON like {"message":"..."} try parse
      const parsed = JSON.parse(e?.message || '')
      error.value = parsed.message || String(e)
    } catch {
      error.value = e?.message || String(e)
    }
  }
}

function toRegister() {
  router.push({ name: 'Register' })
}
</script>

<style scoped>

</style>
