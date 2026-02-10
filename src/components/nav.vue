<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
    <nav class="fixed top-0 left-0 w-full z-50 border-b border-gray-300 py-3 md:py-8">
    <!-- <nav class="fixed top-0 left-0 w-full z-50 border-b border-gray-300 bg-[rgb(16,16,16)] py-3 md:py-8"> -->
      <div class="container text-white mx-auto flex md:items-center md:justify-between flex-col md:flex-row pl-10 md:pl-0 pt-3 md:pt-0">
        <div class="flex justify-between item-between w-full md:pl-8">
          <!-- <a href="" @click="main">Karnบ้าน</a> -->
           <a href="" @click="main"><img src="../assets/karnbarn.png" alt="" class="w-40 block"></a>

          <!-- Hamburger Button -->
          <!-- <div 
            class="md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer ml-auto mr-10"
            @click="toggleMenu"
          >
            <span :class="barClass(0)"></span>
            <span :class="barClass(1)"></span>
            <span :class="barClass(2)"></span>
          </div> -->
          <div class="md:pt-4 pr-5">
          <button v-if="!loggedIn" @click="login" class="flex text-xl items-center gap-2 px-5 py-2.5 rounded-[20px] bg-blue-800 transition-all duration-300 hover:bg-blue-900 hover:-translate-y-0.5 mt-5 md:mt-0">
            Login
          </button>

          <div v-else class="flex items-center gap-3">
            <span class="text-sm">{{ user.username }} <small class="text-gray-400">({{ user.role }})</small></span>
            <button @click="logout" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-red-800 transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5 mt-5 md:mt-0">Logout</button>
          </div>
          </div>
        </div>
      <!-- <div :class="['', menuOpen ? 'block ' : 'hidden', 'md:flex']">
        <div>

          <button v-if="!loggedIn" @click="login" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-blue-800 transition-all duration-300 hover:bg-blue-900 hover:-translate-y-0.5 mt-5 md:mt-0">
            Login
          </button>

          <div v-else class="flex items-center gap-3">
            <span class="text-sm">{{ user.username }} <small class="text-gray-400">({{ user.role }})</small></span>
            <button @click="logout" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-red-800 transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5 mt-5 md:mt-0">Logout</button>
          </div>
          </div>
        </div> -->
      </div>
    </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../services/auth.js'

// provide loggedIn to the template (fixes warning about undefined property)
const loggedIn = computed(() => auth.isLoggedIn())
const user = computed(() => auth.user.value || {})      // unwrap reactive ref

const router = useRouter()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

const login = () => {
  router.push("/login")
}

const main = () => {
  router.push("/")
}

// กำหนด class สำหรับ animation ของ bar แต่ละแท่ง
function barClass(index) {
  const base = "block w-full h-[4px] bg-white rounded transition-all duration-300"
  if (!menuOpen.value) return base

  if (index === 0) return base + " transform translate-y-2.5 rotate-45"
  if (index === 1) return base + " opacity-0"
  if (index === 2) return base + " transform -translate-y-2.5 -rotate-45"
}

function logout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<style>
</style>
