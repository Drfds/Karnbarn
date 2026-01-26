<script setup>
import Navbar from '../components/nav.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const login = () => {
  router.push("/login")
}
</script>

<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet">
  </head>
  <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image:url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
  <main class="">
    <div class="text-center flex justify-center items-center flex-col mt-50">
      <h1 class="text-[4rem] md:text-[11rem] text-white text-shadow-lg shadow-blue-500" style="text-shadow: 0 0 20px #000000,
        0 0 600px #363636,
        0 0 40px #9C9C9C
;">Karnบ้าน</h1>
      <p class="text-white text-[20px]" style="word-wrap: break-word;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, in?
      </p>
      <button @click="login" class="border border-white rounded-full px-6 py-3 mt-8 text-white text-[20px] flex items-center gap-3 bg-[#1C1C1C] hover:bg-[#121212] hover:text-[rgb(204,204,204)] transition duration-300">
        Get start
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="2" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </main>
</template>

<style>
  main {
    font-family: "Itim", cursive;
    font-weight: 400;
    font-style: normal;
  }
</style>