<template>
  <div class="bg-white text-black">
    <div class="fixed-top-bar">
      <HeaderView />
      <TodaysHeadlines
        :headlines="todayHeadlines"
        :current-index="currentHeadlineIndex"
      />
    </div>

    <main class="pt-35 flex flex-row overflow-x-auto">
      <section
        v-for="day in recentDays"
        :key="day.date"
        class="min-w-[250px] border-r border-gray-300 p-4"
      >
        <h2 class="text-lg font-bold mb-4">
          {{ isToday(day.date) ? "Today" : day.date }}
        </h2>

        <ul v-if="day.links.length" class="space-y-2 max-w-75">
          <li
            v-for="(link, i) in day.links"
            :key="link.url"
            :class="i == 0 ? 'pt-5 pb-5' : 'pt-5 pb-5 border-t-2 border-black'"
          >
            <div v-if="link.tags.length" class="flex flex-wrap gap-1 mb-1">
              <a
                v-for="tag in link.tags"
                :key="tag"
                :href="`/tags/${tag}`"
                :class="`pl-2 pr-2 text-xs font-semibold text-blue-800 rounded-full block w-fit tag tag-${tag.toLowerCase()} bg-blue-100`"
              >
                #{{ tag }}
              </a>
            </div>
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline block"
            >
              {{ link.title }}
            </a>
          </li>
        </ul>

        <p v-else class="text-gray-500">No links for this day.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import HeaderView from './HeaderView.vue';
import TodaysHeadlines from './TodaysHeadlines.vue'; // Import the new component
import { ref, onMounted, onUnmounted } from "vue";

const recentDays = ref([]);
const todayHeadlines = ref([]);
const currentHeadlineIndex = ref(0);
let headlineInterval;

const isToday = (dateString) => {
  const today = new Date();
  const todayFormatted =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  return dateString === todayFormatted;
};

onMounted(async () => {
  const modules = import.meta.glob("/src/pages/posts/**/*.md", { eager: true });

  const posts = Object.entries(modules)
    .map(([path, mod]) => {
      const match = path.match(/\/posts\/(\d{4})\/([a-z]+)\/(\d{1,2})\.md$/i);
      if (!match) return null;

      const [_, year, monthName, day] = match;
      const monthIndex = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ].indexOf(monthName.toLowerCase());

      if (monthIndex === -1) return null;

      const date = new Date(year, monthIndex, parseInt(day));
      const formattedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      const raw = mod.rawContent();
      let currentDayLinks = [];
      let dayHeadlines = [];

      if (typeof raw === "string") {
        raw
          .trim()
          .split("\n")
          .forEach((line) => {
            const m = line.match(/\[(.+?)\]\((.+?)\)(?:\s*\((.+?)\))?/);
            if (m) {
              const link = {
                title: m[1],
                url: m[2],
                tags: m[3] ? m[3].split(",").map((tag) => tag.trim()) : [],
              };

              if (link.tags.includes("Headline")) {
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
    })
    .filter(Boolean);

  recentDays.value = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  if (todayHeadlines.value.length > 1) {
    headlineInterval = setInterval(() => {
      currentHeadlineIndex.value =
        (currentHeadlineIndex.value + 1) % todayHeadlines.value.length;
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
  --header-height: 4rem;
  --headline-taper-height: 3rem;
  --total-fixed-height: calc(
    var(--header-height) + var(--headline-taper-height)
  );
}

.fixed-top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>