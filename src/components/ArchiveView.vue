<template>
    <main class="bg-white text-black max-w-4xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Archive</h1>
      <section v-for="day in allDays" :key="day.date" class="mb-8">
        <h2 class="text-lg font-semibold mb-2">{{ day.date }}</h2>
        <ul class="space-y-1 list-disc list-inside">
          <li v-for="link in day.links" :key="link.url">
            <a :href="link.url" class="hover:underline" target="_blank" rel="noopener noreferrer">
              {{ link.title }}
            </a>
          </li>
        </ul>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const allDays = ref([]);
  
  onMounted(async () => {
    const modules = import.meta.glob('../content/*.md', { eager: true });
  
    const posts = Object.entries(modules).map(([path, mod]) => {
      const date = mod.frontmatter.date;
      const raw = mod.default;
      const links = raw
        .trim()
        .split('\n')
        .map((line) => {
          const match = line.match(/\[(.+?)\]\((.+?)\)/);
          return match ? { title: match[1], url: match[2] } : null;
        })
        .filter(Boolean);
  
      return { date, links };
    });
  
    allDays.value = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  </script>
  