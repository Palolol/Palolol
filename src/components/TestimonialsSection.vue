<template>
    <section id="testimonials" class="testimonials">
        <h2 class="t-title">What people say</h2>

        <div class="t-grid">
            <TestimonialCard 
              v-for="t in testimonials"
              :key="t.id"
              :data="t" 
            />
        </div>
    </section>
</template>

<script setup>
import TestimonialCard from './TestimonialCard.vue'
import { testimonials } from '../data/testimonials.js'
</script>

<style scoped>
.testimonials {
    max-width: 960px;
    margin: 0 auto;
    padding: 80px 1.25rem;
}
.t-title {
    margin: 0 0 28px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    letter-spacing: 1px;
    color: #fff;
}
.t-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
</style>