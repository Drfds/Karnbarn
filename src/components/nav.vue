<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet">
  </head>
    <nav class="fixed top-0 left-0 w-full z-50 border-b border-gray-300 py-3 md:py-8">
    <!-- <nav class="fixed top-0 left-0 w-full z-50 border-b border-gray-300 bg-[rgb(16,16,16)] py-3 md:py-8"> -->
      <div class="container text-white mx-auto flex md:items-center md:justify-between flex-col md:flex-row pl-10 md:pl-0 pt-3 md:pt-0">
        <div class="text-3xl font-bold flex items-center pl-8">
          <a href="" @click="main">Karnบ้าน</a>

          <!-- Hamburger Button -->
          <div 
            class="md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer ml-auto mr-10"
            @click="toggleMenu"
          >
            <span :class="barClass(0)"></span>
            <span :class="barClass(1)"></span>
            <span :class="barClass(2)"></span>
          </div>
        </div>
      <div :class="['', menuOpen ? 'block bg-[rgb(16,16,16)]' : 'hidden', 'md:flex']">
        <!-- <ul class="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 md:mt-2 md:mr-10">
          <li><a href="" class="border border-transparent rounded-[10px]  transition-all duration-200 hover:text-[rgb(204,204,204)] hover:bg-[rgb(34,34,34)] px-2 py-1">Home</a></li>
          <li><a href="" class="border border-transparent rounded-[10px] px-2 py-1 transition-all duration-200 hover:text-[rgb(204,204,204)] hover:bg-[rgb(34,34,34)]">About</a></li>
          <li><a href="" class="border border-transparent rounded-[10px] px-2 py-1 transition-all duration-200 hover:text-[rgb(204,204,204)] hover:bg-[rgb(34,34,34)]">Services</a></li>
          <li><a href="" class="border border-transparent rounded-[10px] px-2 py-1 transition-all duration-200 hover:text-[rgb(204,204,204)] hover:bg-[rgb(34,34,34)]">Contact</a></li>
        </ul> -->

        <div>
          <!-- <button v-if="!loggedIn" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-blue-800 transition-all duration-300 hover:bg-blue-900 hover:-translate-y-0.5 mt-5 md:mt-0" @click="loginWithDiscord">
              Login<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord discord" viewBox="0 0 16 16">
            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
            </svg>
          </button > -->

          <button v-if="!loggedIn" @click="login" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-blue-800 transition-all duration-300 hover:bg-blue-900 hover:-translate-y-0.5 mt-5 md:mt-0">
            Login
          </button>

          <div v-else class="flex items-center gap-3">
            <span class="text-sm">{{ user.username }} <small class="text-gray-400">({{ user.role }})</small></span>
            <button @click="logout" class="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-red-800 transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5 mt-5 md:mt-0">Logout</button>
          </div>
          </div>
        </div>
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
  .topnav {
    font-family: "Itim", cursive;
    font-weight: 400;
    font-style: normal;
  }
</style>
