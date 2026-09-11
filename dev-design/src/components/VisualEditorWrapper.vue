<template>
  <div
    v-if="isVisible"
    ref="wrapper"
    class="visual-editor-wrapper"
    :style="wrapperStyle"
    @click="handleClick"
  >
    <!-- Target component slot -->
    <slot></slot>

    <!-- Selection outline and handles -->
    <div v-if="isSelected" class="selection-outline">
      <!-- Top-left handle -->
      <div
        class="resize-handle resize-handle-tl"
        @mousedown="startResize('top-left')"
        @touchstart.prevent="startResize('top-left')"
      ></div>
      <!-- Top-center handle -->
      <div
        class="resize-handle resize-handle-tc"
        @mousedown="startResize('top')"
        @touchstart.prevent="startResize('top')"
      ></div>
      <!-- Top-right handle -->
      <div
        class="resize-handle resize-handle-tr"
        @mousedown="startResize('top-right')"
        @touchstart.prevent="startResize('top-right')"
      ></div>
      <!-- Middle-left handle -->
      <div
        class="resize-handle resize-handle-ml"
        @mousedown="startResize('left')"
        @touchstart.prevent="startResize('left')"
      ></div>
      <!-- Middle-right handle -->
      <div
        class="resize-handle resize-handle-mr"
        @mousedown="startResize('right')"
        @touchstart.prevent="startResize('right')"
      ></div>
      <!-- Bottom-left handle -->
      <div
        class="resize-handle resize-handle-bl"
        @mousedown="startResize('bottom-left')"
        @touchstart.prevent="startResize('bottom-left')"
      ></div>
      <!-- Bottom-center handle -->
      <div
        class="resize-handle resize-handle-bc"
        @mousedown="startResize('bottom')"
        @touchstart.prevent="startResize('bottom')"
      ></div>
      <!-- Bottom-right handle -->
      <div
        class="resize-handle resize-handle-br"
        @mousedown="startResize('bottom-right')"
        @touchstart.prevent="startResize('bottom-right')"
      ></div>
    </div>
  </div>

  <!-- Fallback when not in dev mode or not visible -->
  <div v-else class="visual-editor-fallback">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVisualEditorStore } from '../stores/visualEditor'
import { useCssModule } from 'vue'

// Props
const props = defineProps({
  componentId: {
    type: String,
    required: true
  }
})

// Get the visual editor store
const visualEditorStore = useVisualEditorStore()

// Refs
const wrapper = ref(null)
const isSelected = computed(() =>
  visualEditorStore.selectedComponentId === props.componentId
)

// Get component styles from store
const componentStyles = computed(() =>
  visualEditorStore.getComponentStyle(props.componentId)
)

// Wrapper styles (applies stored styles)
const wrapperStyle = computed(() => {
  const styles = componentStyles.value
  const styleObject = {}

  // Map common style properties
  if (styles.width) styleObject.width = styles.width
  if (styles.height) styleObject.height = styles.height
  if (styles.padding) styleObject.padding = styles.padding
  if (styles.margin) styleObject.margin = styles.margin
  if (styles.gap) styleObject.gap = styles.gap

  // Typography
  if (styles.fontSize) styleObject.fontSize = styles.fontSize
  if (styles.fontWeight) styleObject.fontWeight = styles.fontWeight
  if (styles.lineHeight) styleObject.lineHeight = styles.lineHeight

  // Colors
  if (styles.backgroundColor) styleObject.backgroundColor = styles.backgroundColor
  if (styles.color) styleObject.color = styles.color
  if (styles.borderColor) styleObject.borderColor = styles.borderColor

  // Flex/Grid alignment (these would need to be applied to the wrapper's display)
  // For now, we'll store them and let the consumer apply them

  return styleObject
})

// Visibility control (from store, which is already dev-only)
const isVisible = computed(() => visualEditorStore.isVisible)

// Drag and resize state
let isDragging = false
let isResizing = false
let resizeDirection = null
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let startLeft = 0
let startTop = 0

// Animation frame IDs for smooth dragging
let dragAnimationFrame = null
let resizeAnimationFrame = null

// Pending updates for drag/resize
let pendingDragUpdate = null
let pendingResizeUpdate = null

// Initialize wrapper as selected by default on mount
onMounted(() => {
  // Select this component when it's mounted
  visualEditorStore.selectComponent(props.componentId)

  // Make wrapper draggable
  if (wrapper.value) {
    wrapper.value.style.position = 'relative'
    wrapper.value.style.cursor = 'move'

    // Add event listeners for dragging
    wrapper.value.addEventListener('mousedown', startDrag)
    wrapper.value.addEventListener('touchstart', startDrag, { passive: true })
  }
})

onUnmounted(() => {
  // Remove event listeners
  if (wrapper.value) {
    wrapper.value.removeEventListener('mousedown', startDrag)
    wrapper.value.removeEventListener('touchstart', startDrag)
  }

  // Clear selection when component is unmounted
  if (visualEditorStore.selectedComponentId === props.componentId) {
    visualEditorStore.clearSelection()
  }
})

// Drag functionality
function startDrag(e) {
  if (!isVisible.value || !isSelected.value) return

  // Prevent triggering resize if we're on a handle
  if (e.target.classList.contains('resize-handle')) return

  isDragging = true

  // Get mouse/touch position
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

  startX = clientX
  startY = clientY

  // Get starting position
  const rect = wrapper.value.getBoundingClientRect()
  startLeft = rect.left
  startTop = rect.top

  // Add move and end listeners
  document.addEventListener('mousemove', drag)
  document.addEventListener('touchmove', drag, { passive: true })
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchend', endDrag)

  e.preventDefault()
}

function drag(e) {
  if (!isDragging) return

  // Get current mouse/touch position
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY

  // Calculate movement
  const dx = clientX - startX
  const dy = clientY - startY

  // Store pending update
  pendingDragUpdate = {
    left: startLeft + dx,
    top: startTop + dy
  }

  // Request animation frame for smooth updates
  if (!dragAnimationFrame) {
    dragAnimationFrame = requestAnimationFrame(() => {
      if (pendingDragUpdate) {
        // Apply new position
        wrapper.value.style.left = `${pendingDragUpdate.left}px`
        wrapper.value.style.top = `${pendingDragUpdate.top}px`

        // Update position in styles
        visualEditorStore.setComponentStyle(props.componentId, {
          left: `${pendingDragUpdate.left}px`,
          top: `${pendingDragUpdate.top}px`,
          position: 'relative'
        })

        pendingDragUpdate = null
        dragAnimationFrame = null
      }
    })
  }
}

function endDrag() {
  isDragging = false
  // Cancel any pending animation frame
  if (dragAnimationFrame) {
    cancelAnimationFrame(dragAnimationFrame)
    dragAnimationFrame = null
  }
  // Apply any pending update
  if (pendingDragUpdate) {
    wrapper.value.style.left = `${pendingDragUpdate.left}px`
    wrapper.value.style.top = `${pendingDragUpdate.top}px`
    visualEditorStore.setComponentStyle(props.componentId, {
      left: `${pendingDragUpdate.left}px`,
      top: `${pendingDragUpdate.top}px`,
      position: 'relative'
    })
    pendingDragUpdate = null
  }
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('touchmove', drag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchend', endDrag)
}

// Resize functionality
function startResize(direction) {
  if (!isVisible.value || !isSelected.value) return

  isResizing = true
  resizeDirection = direction

  // Get mouse/touch position
  const e = arguments[1] || window.event
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

  startX = clientX
  startY = clientY

  // Get starting dimensions
  const rect = wrapper.value.getBoundingClientRect()
  startWidth = rect.width
  startHeight = rect.height
  startLeft = rect.left
  startTop = rect.top

  // Add move and end listeners
  document.addEventListener('mousemove', resize)
  document.addEventListener('touchmove', resize, { passive: true })
  document.addEventListener('mouseup', endResize)
  document.addEventListener('touchend', endResize)

  e.preventDefault()
}

function resize(e) {
  if (!isResizing) return

  // Get current mouse/touch position
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY

  // Calculate movement
  const dx = clientX - startX
  const dy = clientY - startY

  // Store pending update
  pendingResizeUpdate = {
    width: startWidth,
    height: startHeight,
    left: startLeft,
    top: startTop
  }

  // Calculate new dimensions based on direction
  if (resizeDirection.includes('left')) {
    pendingResizeUpdate.width = Math.max(20, startWidth - dx)
    pendingResizeUpdate.left = startLeft + dx
  }
  if (resizeDirection.includes('right')) {
    pendingResizeUpdate.width = Math.max(20, startWidth + dx)
  }
  if (resizeDirection.includes('top')) {
    pendingResizeUpdate.height = Math.max(20, startHeight - dy)
    pendingResizeUpdate.top = startTop + dy
  }
  if (resizeDirection.includes('bottom')) {
    pendingResizeUpdate.height = Math.max(20, startHeight + dy)
  }

  // Request animation frame for smooth updates
  if (!resizeAnimationFrame) {
    resizeAnimationFrame = requestAnimationFrame(() => {
      if (pendingResizeUpdate) {
        // Apply new dimensions
        wrapper.value.style.width = `${pendingResizeUpdate.width}px`
        wrapper.value.style.height = `${pendingResizeUpdate.height}px`
        wrapper.value.style.left = `${pendingResizeUpdate.left}px`
        wrapper.value.style.top = `${pendingResizeUpdate.top}px`

        // Update dimensions in styles
        visualEditorStore.setComponentStyle(props.componentId, {
          width: `${pendingResizeUpdate.width}px`,
          height: `${pendingResizeUpdate.height}px`,
          left: `${pendingResizeUpdate.left}px`,
          top: `${pendingResizeUpdate.top}px`,
          position: 'relative'
        })

        pendingResizeUpdate = null
        resizeAnimationFrame = null
      }
    })
  }
}

function endResize() {
  isResizing = false
  resizeDirection = null
  // Cancel any pending animation frame
  if (resizeAnimationFrame) {
    cancelAnimationFrame(resizeAnimationFrame)
    resizeAnimationFrame = null
  }
  // Apply any pending update
  if (pendingResizeUpdate) {
    wrapper.value.style.width = `${pendingResizeUpdate.width}px`
    wrapper.value.style.height = `${pendingResizeUpdate.height}px`
    wrapper.value.style.left = `${pendingResizeUpdate.left}px`
    wrapper.value.style.top = `${pendingResizeUpdate.top}px`
    visualEditorStore.setComponentStyle(props.componentId, {
      width: `${pendingResizeUpdate.width}px`,
      height: `${pendingResizeUpdate.height}px`,
      left: `${pendingResizeUpdate.left}px`,
      top: `${pendingResizeUpdate.top}px`,
      position: 'relative'
    })
    pendingResizeUpdate = null
  }
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('touchmove', resize)
  document.removeEventListener('mouseup', endResize)
  document.removeEventListener('touchend', endResize)
}

// Click to select component
function handleClick(e) {
  e.stopPropagation() // Prevent bubbling
  if (isVisible.value) {
    visualEditorStore.selectComponent(props.componentId)
  }
}
</script>

<style scoped>
.visual-editor-wrapper {
  position: relative;
  box-sizing: border-box;
  touch-action: none; /* Prevent scrolling during drag */
  user-select: none;  /* Prevent text selection during interaction */
}

.visual-editor-wrapper:hover {
  outline: 2px dashed rgba(18, 32, 226, 0.5);
  outline-offset: -2px;
}

.selection-outline {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px dashed #1220e2;
  pointer-events: none; /* Allow clicks to pass through to handles */
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #1220e2;
  border: 1px solid white;
  border-radius: 2px;
  cursor: pointer;
  z-index: 10;
}

/* Handle positions */
.resize-handle-tl { top: -4px; left: -4px; cursor: nwse-resize; }
.resize-handle-tc { top: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.resize-handle-tr { top: -4px; right: -4px; cursor: nesw-resize; }
.resize-handle-ml { top: 50%; left: -4px; transform: translateY(-50%); cursor: ew-resize; }
.resize-handle-mr { top: 50%; right: -4px; transform: translateY(-50%); cursor: ew-resize; }
.resize-handle-bl { bottom: -4px; left: -4px; cursor: nesw-resize; }
.resize-handle-bc { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.resize-handle-br { bottom: -4px; right: -4px; cursor: nwse-resize; }

/* Hover effects */
.resize-handle:hover {
  background-color: #0a0a1a;
  transform: scale(1.2);
}

.visual-editor-fallback {
  display: contents; /* Let children render normally */
}

/* Ensure the wrapper takes up space when visible */
.visual-editor-wrapper:not(.visual-editor-fallback) {
  min-height: 1px;
  min-width: 1px;
}
</style>