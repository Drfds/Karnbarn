<template class="relative">
  <div class="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none" style="background-image:url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
  <div class="min-h-screen flex-col items-center justify-center mt-60">
    <div class="w-full max-w-md mx-auto p-14 pt-0 text-white">
      <h2 class="text-2xl mb-4 text-center">สมัครสมาชิก</h2>
      <div class="space-y-3">
        <input v-model="username" placeholder="ชื่อผู้ใช้" class="w-full p-2 rounded bg-gray-700" />
        <input v-model="email" type="email" placeholder="อีเมล" class="w-full p-2 rounded bg-gray-700" />
        <input v-model="password" type="password" placeholder="รหัสผ่าน" class="w-full p-2 rounded bg-gray-700" />
        <!-- <label class="text-sm">บทบาท (role)</label> -->
        <!-- <select v-model="role" class="w-full p-2 rounded bg-gray-700">
          <option value="teacher">teacher</option>
          <option value="parent">parent</option>
          <option value="student">student</option>
        </select> -->

        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

        <div class="flex gap-2 justify-center">
          <button @click="submit" class="bg-green-600 px-4 py-2 rounded">สมัครสมาชิก</button>
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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const error = ref('')

async function submit() {
  error.value = ''
  const role = 'student'

  try {
    const result = await Swal.fire({
      title: 'ข้อมูลถูกต้อง?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!'
    })

    if (!result.isConfirmed) return

    const res = await auth.register({
      username: username.value,
      email: email.value,
      password: password.value,
      role
    })

    if (res.success == true) {
      await Swal.fire(
        'สมัครสมาชิกสำเร็จ!',
        'คุณได้สมัครสมาชิกเรียบร้อยแล้ว.',
        'success'
      )
      router.push({ name: 'Login' })
    } else {
      Swal.fire(
        'เกิดข้อผิดพลาด!',
        'ไม่สามารถสมัครสมาชิกได้.',
        'error'
      )
    }
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      String(e)
  }
}


function toLogin() {
  router.push({ name: 'Login' })
}
</script>

<style scoped>
</style>
