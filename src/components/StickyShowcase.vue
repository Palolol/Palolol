<!-- src/components/StickyShowcase.vue -->
<template>
  <!-- Header -->
  <div
    ref="targetRef"
    class="showcase-header reveal"
    :class="{ visible: isHeaderVisible }"
  >
    <h3>What I Do</h3>
    <p>Scroll to explore my projects, skills, and experience.</p>
  </div>

  <!-- Sticky Showcase -->
  <div class="showcase" :ref="showcase.setContainer">
    <svg
      class="showcase-line"
      viewBox="0 0 24 1000"
      preserveAspectRatio="none"
    >
      <line
        x1="12" y1="0" x2="12" y2="1000"
        stroke="#EEF2F6"
        stroke-width="1.5"
        stroke-linecap="round"
        :stroke-dasharray="1000"
        :stroke-dashoffset="1000 - showcase.lineProgress.value * 1000"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <div class="showcase-viewport">
      <div class="showcase-progress">
        <span
          v-for="(card, i) in showcaseCards"
          :key="'pip-' + i"
          class="showcase-pip"
          :class="{
            active: showcase.activeIndex.value === i,
            past: i < showcase.activeIndex.value
          }"
        ></span>
      </div>

      <div class="showcase-label">
        {{ showcaseCards[showcase.activeIndex.value]?.label }}
      </div>
      <div class="showcase-counter">
        <span>{{ showcase.activeIndex.value + 1 }}</span>
        <span>/</span>
        <span>{{ showcaseCards.length }}</span>
      </div>

      <div class="showcase-stack">
        <div
          v-for="(card, i) in showcaseCards"
          :key="card.id"
          data-card
          class="showcase-card"
          :class="{ 'is-active': showcase.cards.value[i]?.phase === 'holding' }"
          :style="cardStyle(i)"
        >
          <ProjectsCard v-if="card.type === 'projects'" />
          <SkillsCard
            v-else-if="card.type === 'skills'"
            :is-active="showcase.cards.value[i]?.phase === 'holding'"
          />
          <ExperienceCard
            v-else-if="card.type === 'experience'"
            :is-active="showcase.cards.value[i]?.phase === 'holding'"
          />
        </div>
      </div>
    </div>

    <!-- Scroll spacers with anchor points at "holding" phase center -->
    <div
      v-for="(card, i) in showcaseCards"
      :key="'sp-' + i"
      class="showcase-spacer"
    >
      <!-- Anchor lands at the middle of the "holding" phase (48% into segment) -->
      <span
        :id="'anchor-' + card.id"
        class="showcase-anchor"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
import { useStickyShowcase } from '../composables/useStickyShowcase'
import { showcaseCards } from '../data/showcaseCards'
import ProjectsCard from './cards/ProjectsCard.vue'
import SkillsCard from './cards/SkillsCard.vue'
import ExperienceCard from './cards/ExperienceCard.vue'

const [isHeaderVisible, targetRef] = useScrollReveal({ threshold: 0.1 })
const showcase = useStickyShowcase()

function cardStyle(i) {
  const c = showcase.cards.value[i]
  if (!c) {
    return {
      opacity: 0,
      transform: 'translateY(40px) scale(0.94)',
      zIndex: 0,
      pointerEvents: 'none'
    }
  }
  return {
    opacity: c.opacity,
    transform: `translateY(${c.y}px) scale(${c.scale})`,
    zIndex: c.phase === 'holding' ? 10 : c.phase === 'entering' ? 5 : 1,
    pointerEvents: c.phase === 'holding' ? 'auto' : 'none'
  }
}
</script>