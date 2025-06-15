<template>
    <div class="bg-white text-black">
      <div class="fixed-top-bar">
        <header class="p-4 border-b border-gray-300 flex justify-between items-center">
          <h1 class="text-2xl font-bold">Left Feed</h1>
          <a href="/archive" class="bg-black text-white rounded-full p-4 hover:underline">View Archive →</a>
        </header>
  
        <section v-if="todayHeadlines.length" class="bg-gradient-to-r from-gray-50 to-white py-2 px-4 border-b border-gray-200 flex items-center relative overflow-hidden h-12">
          <span class="text-xs font-bold text-gray-700 mr-3 flex-shrink-0">TODAY'S HEADLINES:</span>
          <div class="relative flex-grow h-full">
            <Transition name="headline-slide" mode="out-in">
              <a
                v-if="todayHeadlines[currentHeadlineIndex]"
                :key="todayHeadlines[currentHeadlineIndex].url"
                :href="todayHeadlines[currentHeadlineIndex].url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 hover:bg-red-200 transition-colors absolute inset-y-0 left-0"
                style="max-width: calc(100% - 10px);"
              >
                <span class="mr-1">🔥</span> {{ todayHeadlines[currentHeadlineIndex].title }}
              </a>
            </Transition>
          </div>
        </section>
      </div>
  
      <main class="pt-35 flex flex-row overflow-x-auto">
        <section
          v-for="day in recentDays"
          :key="day.date"
          class="min-w-[250px] border-r border-gray-300 p-4"
        >
          <h2 class="text-lg font-bold mb-4">
            {{ isToday(day.date) ? 'Today' : day.date }}
          </h2>
          <ul v-if="day.links.length" class="space-y-2 max-w-75">
            <li v-for="(link, i) in day.links" :key="link.url" :class="i == 0 ? `pt-5 pb-5` : `pt-5 pb-5 border-t-2 border-black`">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                {{ link.title }}
              </a>
              <a
                v-if="link.tag"
                :href="`/tags/${link.tag}`"
                class="ml-2 pr-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full whitespace-nowrap"
              >
                #{{ link.tag }}
              </a>
            </li>
          </ul>
          <p v-else class="text-gray-500">No links for this day.</p>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const recentDays = ref([]);
  const todayHeadlines = ref([]);
  const currentHeadlineIndex = ref(0);
  let headlineInterval;
  
  const isToday = (dateString) => {
    const today = new Date();
    const todayFormatted = today.getFullYear() + '-'
                          + String(today.getMonth() + 1).padStart(2, '0') + '-'
                          + String(today.getDate()).padStart(2, '0');
    return dateString === todayFormatted;
  };
  
  onMounted(async () => {
    const modules = import.meta.glob('/src/content/**/*.md', { eager: true });
  
    const posts = Object.entries(modules).map(([path, mod]) => {
      const match = path.match(/\/content\/(\d{4})\/([a-z]+)\/(\d{1,2})\.md$/i);
      if (!match) return null;
  
      const [_, year, monthName, day] = match;
      const monthIndex = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ].indexOf(monthName.toLowerCase());
      if (monthIndex === -1) return null;
  
      const date = new Date(year, monthIndex, parseInt(day));
      const formattedDate = date.getFullYear() + '-'
                          + String(date.getMonth() + 1).padStart(2, '0') + '-'
                          + String(date.getDate()).padStart(2, '0');
  
      const raw = mod.rawContent();
      let currentDayLinks = [];
      let dayHeadlines = [];
  
      if (typeof raw === 'string') {
        raw.trim().split('\n').forEach((line) => {
          const m = line.match(/\[(.+?)\]\((.+?)\)(?:\s*\((.+?)\))?/);
  
          if (m) {
            const link = {
              title: m[1],
              url: m[2],
              tag: m[3] ? m[3].trim() : null
            };
  
            if (link.tag && link.tag.toLowerCase() === 'headline') {
              if (isToday(formattedDate)) {
                dayHeadlines.push(link);
              } else {
                currentDayLinks.push(link);
              }
            } else {
              currentDayLinks.push(link);
            }
          }
        });
      }
  
      if (isToday(formattedDate)) {
        todayHeadlines.value = dayHeadlines;
      }
  
      return { date: formattedDate, links: currentDayLinks };
    }).filter(Boolean);
  
    recentDays.value = posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
  
    if (todayHeadlines.value.length > 1) {
      headlineInterval = setInterval(() => {
        currentHeadlineIndex.value = (currentHeadlineIndex.value + 1) % todayHeadlines.value.length;
      }, 4000);
    }
  });
  
  onUnmounted(() => {
    if (headlineInterval) {
      clearInterval(headlineInterval);
    }
  });
  </script>
  
  <style scoped>
  :root {
    --header-height: 4rem; /* Based on your p-4 header with content */
    --headline-taper-height: 3rem; /* Approx. 48px, based on py-2, px-3. Adjust as needed */
    --total-fixed-height: calc(var(--header-height) + var(--headline-taper-height));
  }
  
  .fixed-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
  
  .headline-slide-enter-active,
  .headline-slide-leave-active {
    transition: all 0.5s ease-in-out;
  }
  
  .headline-slide-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }
  .headline-slide-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
  
  .headline-slide-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  </style>