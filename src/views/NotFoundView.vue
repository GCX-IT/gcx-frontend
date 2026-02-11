<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
    <div class="max-w-md w-full">
      <div class="text-9xl font-extrabold text-yellow-500 mb-4">404</div>
      <h1 class="text-4xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h1>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <router-link 
        to="/"
        class="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
      >
        Go to Homepage
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for this simple page
</script>