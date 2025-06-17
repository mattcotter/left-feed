<template>
    <header
      class="p-4 border-b border-gray-300 flex justify-between items-center"
    >
      <a :href="baseHref">
        <h1 class="text-2xl font-bold">Left Feed</h1>
      </a>
      <a
        :href="archiveLink"
        class="bg-black text-white rounded-full p-4 hover:underline"
      >
        View Archive →
      </a>
    </header>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const baseHref = import.meta.env.BASE_URL;
  
  const archiveLink = computed(() => {
    const base = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
    return `${base}archive`;
  });
  </script>
  
  <style scoped>
  /* Your existing styles can go here */
  </style>