<script setup>
import Footer from './components/footer.vue';
import Navbar from './components/nav.vue'
</script>

<template>
  <Navbar />
  <router-view />   <!-- route จะ render หน้า Home / Dashboard / DiscordCallback -->
  <!-- <Footer /> -->
</template>
