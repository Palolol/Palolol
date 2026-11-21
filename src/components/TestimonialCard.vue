
<template>
  <article class="t-card">
    <div class="t-stars" :aria-label="`${data.rating} out of 5 stars`">
      <span v-for="n in 5" :key="n" :class="{ on: n <= data.rating }">★</span>
    </div>

    <p class="t-quote">“{{ data.quote }}”</p>

    <footer class="t-person">
      <div class="t-avatar">{{ initials }}</div>
      <div>
        <div class="t-name">{{ data.name }}</div>
        <div class="t-role">{{ data.role }}</div>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'

// One testimonial object: { id, name, role, quote, rating }
const props = defineProps({
  data: { type: Object, required: true },
})

const initials = computed(() =>
  props.data.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)
</script>

<style scoped>
.t-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition: transform 0.2s, border-color 0.2s;
}
.t-card:hover {
  transform: translateY(-3px);
  border-color: rgba(18, 32, 226, 0.6);
}
.t-stars span { color: rgba(255, 255, 255, 0.2); font-size: 16px; }
.t-stars span.on { color: #f5b301; }
.t-quote {
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}
.t-person { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.t-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center;
  background: #1220e2; color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
}
.t-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #fff; }
.t-role { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.55); }
</style>