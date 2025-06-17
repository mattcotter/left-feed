<template>
    <section
      v-if="headlines.length"
      class="bg-gradient-to-r from-gray-50 to-white py-2 px-4 border-b border-gray-200 flex items-center relative overflow-hidden h-12"
    >
      <span class="text-xs font-bold text-gray-700 mr-3 flex-shrink-0"
        >TODAY'S HEADLINES:</span
      >
      <div class="relative flex-grow h-full">
        <Transition name="headline-slide" mode="out-in">
          <a
            v-if="headlines[currentIndex]"
            :key="headlines[currentIndex].url"
            :href="headlines[currentIndex].url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 hover:bg-red-200 transition-colors absolute inset-y-0 left-0"
            style="max-width: calc(100% - 10px)"
          >
            <span class="mr-1">🔥</span>
            {{ headlines[currentIndex].title }}
          </a>
        </Transition>
      </div>
    </section>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    headlines: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  });
  </script>
  
  <style scoped>
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
    width: fit-content;
    max-width: calc(100% - 10px);
  }
  </style>