<script setup>
import Footer from './components/footer.vue';
import Navbar from './components/nav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
  <Navbar />
  <main class="flex-1">
    <router-view />
  </main>
  <Footer />
</div>
</template>
