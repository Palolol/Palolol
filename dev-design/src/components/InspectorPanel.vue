<template>
  <div
    v-if="isVisible"
    class="inspector-panel-overlay"
    @mousedown.self="toggleCompact"
  >
    <div class="panel-backdrop"></div>
    <div ref="panel" class="panel-main" :class="{ 'is-compact': isCompact }">
      <div class="panel-header">
        <h3>Inspector</h3>
        <div class="panel-actions">
          <button class="btn-icon" @click="toggleCompact" title="Compact">
            &#9632;
          </button>
          <button class="btn-icon" @click="toggleVisibility" title="Hide">
            &#10006;
          </button>
        </div>
      </div>

      <div class="panel-content">
        <div v-if="selectedComponentId" class="selected-info">
          <div class="label">Selected:</div>
          <div class="value">{{ selectedComponentId }}</div>
        </div>

        <div v-else class="no-selection">
          Select a component to edit
        </div>

        <div v-if="selectedComponentId" class="controls-group">
          <!-- Size & Spacing -->
          <div class="control-section">
            <h4>Size &amp; Spacing</h4>

            <!-- Width -->
            <div class="control-row">
              <label class="control-label">Width:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="width"
                  @change="updateStyle('width', width + 'px')"
                  placeholder="0"
                />
                <span class="control-unit">px</span>
              </div>
            </div>

            <!-- Height -->
            <div class="control-row">
              <label class="control-label">Height:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="height"
                  @change="updateStyle('height', height + 'px')"
                  placeholder="0"
                />
                <span class="control-unit">px</span>
              </div>
            </div>

            <!-- Padding -->
            <div class="control-row">
              <label class="control-label">Padding:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="padding"
                  @change="updateStyle('padding', padding + 'px')"
                  placeholder="0"
                />
                <span class="control-unit">px</span>
              </div>
            </div>

            <!-- Margin -->
            <div class="control-row">
              <label class="control-label">Margin:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="margin"
                  @change="updateStyle('margin', margin + 'px')"
                  placeholder="0"
                />
                <span class="control-unit">px</span>
              </div>
            </div>

            <!-- Gap (for flex/grid) -->
            <div class="control-row">
              <label class="control-label">Gap:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="gap"
                  @change="updateStyle('gap', gap + 'px')"
                  placeholder="0"
                />
                <span class="control-unit">px</span>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="control-section">
            <h4>Typography</h4>

            <!-- Font Size -->
            <div class="control-row">
              <label class="control-label">Font Size:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="fontSize"
                  @change="updateStyle('fontSize', fontSize + 'px')"
                  placeholder="16"
                />
                <span class="control-unit">px</span>
              </div>
            </div>

            <!-- Font Weight -->
            <div class="control-row">
              <label class="control-label">Weight:</label>
              <div class="control-input">
                <select
                  v-model="fontWeight"
                  @change="updateStyle('fontWeight', fontWeight)"
                >
                  <option value="100">Thin</option>
                  <option value="200">Extra Light</option>
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>
            </div>

            <!-- Line Height -->
            <div class="control-row">
              <label class="control-label">Line Height:</label>
              <div class="control-input">
                <input
                  type="number"
                  v-model.number="lineHeight"
                  @change="updateStyle('lineHeight', lineHeight)"
                  step="0.1"
                  placeholder="1.5"
                />
              </div>
            </div>
          </div>

          <!-- Colors -->
          <div class="control-section">
            <h4>Colors</h4>

            <!-- Background -->
            <div class="control-row">
              <label class="control-label">Background:</label>
              <div class="control-input">
                <input
                  type="color"
                  v-model="backgroundColor"
                  @change="updateStyle('backgroundColor', backgroundColor)"
                />
              </div>
            </div>

            <!-- Text Color -->
            <div class="control-row">
              <label class="control-label">Text:</label>
              <div class="control-input">
                <input
                  type="color"
                  v-model="textColor"
                  @change="updateStyle('color', textColor)"
                />
              </div>
            </div>

            <!-- Border Color -->
            <div class="control-row">
              <label class="control-label">Border:</label>
              <div class="control-input">
                <input
                  type="color"
                  v-model="borderColor"
                  @change="updateStyle('borderColor', borderColor)"
                />
              </div>
            </div>
          </div>

          <!-- Flex Layout -->
          <div class="control-section">
            <h4>Flex Layout</h4>

            <!-- Flex Direction -->
            <div class="control-row">
              <label class="control-label">Direction:</label>
              <div class="control-input">
                <select
                  v-model="flexDirection"
                  @change="updateStyle('flexDirection', flexDirection)"
                >
                  <option value="row">Row</option>
                  <option value="row-reverse">Row-Reverse</option>
                  <option value="column">Column</option>
                  <option value="column-reverse">Column-Reverse</option>
                </select>
              </div>
            </div>

            <!-- Justify Content -->
            <div class="control-row">
              <label class="control-label">Justify:</label>
              <div class="control-input">
                <select
                  v-model="justifyContent"
                  @change="updateStyle('justifyContent', justifyContent)"
                >
                  <option value="flex-start">Flex Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">Flex End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                  <option value="space-evenly">Space Evenly</option>
                </select>
              </div>
            </div>

            <!-- Align Items -->
            <div class="control-row">
              <label class="control-label">Align:</label>
              <div class="control-input">
                <select
                  v-model="alignItems"
                  @change="updateStyle('alignItems', alignItems)"
                >
                  <option value="stretch">Stretch</option>
                  <option value="flex-start">Flex Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">Flex End</option>
                  <option value="baseline">Baseline</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <small>Dev Mode Visual Editor</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVisualEditorStore } from '../stores/visualEditor'

// Get the visual editor store
const visualEditorStore = useVisualEditorStore()

// State
const isCompact = ref(false)

// Panel drag state
let isPanelDragging = false
let panelStartX = 0
let panelStartY = 0
let panelStartLeft = 0
let panelStartTop = 0

// Computed properties
const isVisible = computed(() => visualEditorStore.isVisible)
const selectedComponentId = computed(() => visualEditorStore.selectedComponentId)
const componentStyles = computed(() =>
  visualEditorStore.getComponentStyle(selectedComponentId.value)
)

// Individual style properties (bound to inputs)
const width = ref('')
const height = ref('')
const padding = ref('')
const margin = ref('')
const gap = ref('')
const fontSize = ref('')
const fontWeight = ref('400')
const lineHeight = ref('1.5')
const backgroundColor = ref('#ffffff')
const textColor = ref('#000000')
const borderColor = ref('#cccccc')
const flexDirection = ref('row')
const justifyContent = ref('flex-start')
const alignItems = ref('stretch')

// Watch for selection changes to update form values
watch(
  selectedComponentId,
  (newId) => {
    if (newId) {
      const styles = componentStyles.value
      // Parse values from stored styles (remove 'px' etc. for numeric inputs)
      width.value = parseFloat(styles.width) || ''
      height.value = parseFloat(styles.height) || ''
      padding.value = parseFloat(styles.padding) || ''
      margin.value = parseFloat(styles.margin) || ''
      gap.value = parseFloat(styles.gap) || ''
      fontSize.value = parseFloat(styles.fontSize) || ''
      fontWeight.value = styles.fontWeight || '400'
      lineHeight.value = parseFloat(styles.lineHeight) || 1.5
      backgroundColor.value = styles.backgroundColor || '#ffffff'
      textColor.value = styles.color || '#000000'
      borderColor.value = styles.borderColor || '#cccccc'
      flexDirection.value = styles.flexDirection || 'row'
      justifyContent.value = styles.justifyContent || 'flex-start'
      alignItems.value = styles.alignItems || 'stretch'
    } else {
      // Reset form when no selection
      width.value = ''
      height.value = ''
      padding.value = ''
      margin.value = ''
      gap.value = ''
      fontSize.value = ''
      fontWeight.value = '400'
      lineHeight.value = '1.5'
      backgroundColor.value = '#ffffff'
      textColor.value = '#000000'
      borderColor.value = '#cccccc'
      flexDirection.value = 'row'
      justifyContent.value = 'flex-start'
      alignItems.value = 'stretch'
    }
  }
)

// Watch for style changes from the wrapper (drag/resize)
watch(
  componentStyles,
  (newStyles) => {
    if (selectedComponentId.value) {
      // Update form values from styles
      width.value = parseFloat(newStyles.width) || ''
      height.value = parseFloat(newStyles.height) || ''
      padding.value = parseFloat(newStyles.padding) || ''
      margin.value = parseFloat(newStyles.margin) || ''
      gap.value = parseFloat(newStyles.gap) || ''
      fontSize.value = parseFloat(newStyles.fontSize) || ''
      fontWeight.value = newStyles.fontWeight || '400'
      lineHeight.value = parseFloat(newStyles.lineHeight) || 1.5
      backgroundColor.value = newStyles.backgroundColor || '#ffffff'
      textColor.value = newStyles.color || '#000000'
      borderColor.value = newStyles.borderColor || '#cccccc'
      flexDirection.value = newStyles.flexDirection || 'row'
      justifyContent.value = newStyles.justifyContent || 'flex-start'
      alignItems.value = newStyles.alignItems || 'stretch'
    }
  }
)

// Methods
function updateStyle(property, value) {
  if (selectedComponentId.value) {
    visualEditorStore.setComponentStyle(selectedComponentId.value, {
      [property]: value
    })
  }
}

function toggleCompact() {
  isCompact.value = !isCompact.value
}

function toggleVisibility() {
  visualEditorStore.toggleVisibility()
}

function exportCss() {
  const css = visualEditorStore.exportAsCss()
  navigator.clipboard.writeText(css).then(() => {
    alert('CSS exported to clipboard!')
  }).catch(err => {
    console.error('Failed to copy CSS:', err)
    alert('Failed to export CSS')
  })
}

function exportJson() {
  const json = visualEditorStore.exportAsJson()
  navigator.clipboard.writeText(json).then(() => {
    alert('JSON exported to clipboard!')
  }).catch(err => {
    console.error('Failed to copy JSON:', err)
    alert('Failed to export JSON')
  })
}

function resetStyles() {
  if (selectedComponentId.value) {
    visualEditorStore.removeComponentStyle(selectedComponentId.value)
    // Form will update via watcher
  }
}

// Panel dragging functionality
function startPanelDrag(e) {
  if (!isVisible.value) return

  isPanelDragging = true

  // Get mouse/touch position
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

  panelStartX = clientX
  panelStartY = clientY

  // Get starting position
  const rect = panel.value.getBoundingClientRect()
  panelStartLeft = rect.left
  panelStartTop = rect.top

  // Add move and end listeners
  document.addEventListener('mousemove', dragPanel)
  document.addEventListener('touchmove', dragPanel, { passive: true })
  document.addEventListener('mouseup', endPanelDrag)
  document.addEventListener('touchend', endPanelDrag)

  e.preventDefault()
}

function dragPanel(e) {
  if (!isPanelDragging) return

  // Get current mouse/touch position
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY

  // Calculate movement
  const dx = clientX - panelStartX
  const dy = clientY - panelStartY

  // Apply new position
  const newLeft = panelStartLeft + dx
  const newTop = panelStartTop + dy

  // Keep panel within viewport bounds
  const maxLeft = window.innerWidth - panel.value.offsetWidth
  const maxTop = window.innerHeight - panel.value.offsetHeight

  panel.value.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`
  panel.value.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`
}

function endPanelDrag() {
  isPanelDragging = false
  document.removeEventListener('mousemove', dragPanel)
  document.removeEventListener('touchmove', dragPanel)
  document.removeEventListener('mouseup', endPanelDrag)
  document.removeEventListener('touchend', endPanelDrag)
}
</script>

<style scoped>
.inspector-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  font-family: 'DM Sans', sans-serif;
}

.panel-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 1;
}

.panel-main {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(18, 32, 226, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: calc(100vh - 80px);
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel-main.is-compact {
  width: 60px;
}

.panel-main.is-compact .panel-header,
.panel-main.is-compact .panel-content,
.panel-main.is-compact .panel-footer {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.panel-main.is-compact .panel-header {
  justify-content: center;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(18, 32, 226, 0.05);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1220e2;
  font-weight: 500;
}

.panel-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
  transform: scale(1.1);
}

.btn-icon:active {
  transform: scale(0.9);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #888;
  font-size: 12px;
}

.selected-info {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 12px;
  color: #333;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.no-selection {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
}

.controls-group {
  margin-bottom: 16px;
}

.control-section {
  margin-bottom: 16px;
}

.control-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1220e2;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(18, 32, 226, 0.2);
}

.control-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.control-label {
  width: 80px;
  font-size: 13px;
  color: #555;
  flex-shrink: 0;
}

.control-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-input input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

.control-input input:focus {
  outline: none;
  border-color: #1220e2;
  box-shadow: 0 0 0 2px rgba(18, 32, 226, 0.2);
}

.control-input select {
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.control-input select:focus {
  outline: none;
  border-color: #1220e2;
  box-shadow: 0 0 0 2px rgba(18, 32, 226, 0.2);
}

.control-input input[type="color"] {
  width: 30px;
  height: 24px;
  padding: 0;
  border: none;
  cursor: pointer;
}

.control-input input[type="color"]::-webkit-color-swatch {
  border: none;
}

.control-input input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.control-unit {
  font-size: 12px;
  color: #888;
}

/* Scrollbar styling */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(18, 32, 226, 0.3);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(18, 32, 226, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .panel-main {
    width: 280px;
    margin: 30px auto;
  }
}

@media (max-width: 480px) {
  .panel-main {
    width: 100%;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }

  .panel-main.is-compact {
    height: 60px;
  }
}

/* Cursor for dragging */
.panel-main {
  cursor: move;
}

.panel-main:active {
  cursor: grabbing;
}
</style>