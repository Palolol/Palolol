<template>
  <div class="card-inner">
    <div class="card-header">
      <div class="card-icon">💼</div>
      <div class="card-head-text">
        <h4>Featured Projects</h4>
        <p>Selected work</p>
      </div>
      <span class="card-index">01</span>
    </div>
    <div class="projects-list">
      <div
        v-for="project in projects"
        :key="project.title"
        class="project-item"
      >
        <div class="project-top">
          <span class="project-emoji">{{ project.icon }}</span>
          <div class="project-name">{{ project.title }}</div>
        </div>
        <p class="project-desc">{{ project.desc }}</p>
        <div class="project-tags">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="project-tag"
            >{{ tag }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { projects } from '../../data/projects'
</script>