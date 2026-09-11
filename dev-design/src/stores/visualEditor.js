import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVisualEditorStore = defineStore('visualEditor', () => {
  // Store for component style overrides
  // Key: componentId (string), Value: style object
  const componentStyles = ref({})

  // Currently selected component ID
  const selectedComponentId = ref(null)

  // Editor visibility (dev-only)
  const isVisible = ref(import.meta.env.DEV)

  // Set styles for a component
  function setComponentStyle(componentId, styles) {
    componentStyles.value[componentId] = {
      ...(componentStyles.value[componentId] || {}),
      ...styles
    }
  }

  // Get styles for a component
  function getComponentStyle(componentId) {
    return componentStyles.value[componentId] || {}
  }

  // Remove styles for a component (reset to default)
  function removeComponentStyle(componentId) {
    delete componentStyles.value[componentId]
  }

  // Select a component
  function selectComponent(componentId) {
    selectedComponentId.value = componentId
  }

  // Clear selection
  function clearSelection() {
    selectedComponentId.value = null
  }

  // Toggle editor visibility (dev-only)
  function toggleVisibility() {
    if (import.meta.env.DEV) {
      isVisible.value = !isVisible.value
    }
  }

  // Export styles as CSS
  function exportAsCss() {
    const cssRules = []
    for (const [componentId, styles] of Object.entries(componentStyles.value)) {
      if (Object.keys(styles).length > 0) {
        const rules = Object.entries(styles)
          .map(([prop, value]) => {
            // Convert camelCase to kebab-case for CSS
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
            return `  ${cssProp}: ${value};`
          })
          .join('\n')
        cssRules.push(`[data-component-id="${componentId}"] {\n${rules}\n}`)
      }
    }
    return cssRules.join('\n\n')
  }

  // Export styles as JSON
  function exportAsJson() {
    return JSON.stringify(componentStyles.value, null, 2)
  }

  // Import styles from JSON
  function importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString)
      componentStyles.value = parsed
      return true
    } catch (error) {
      console.error('Failed to import JSON:', error)
      return false
    }
  }

  return {
    componentStyles,
    selectedComponentId,
    isVisible,
    setComponentStyle,
    getComponentStyle,
    removeComponentStyle,
    selectComponent,
    clearSelection,
    toggleVisibility,
    exportAsCss,
    exportAsJson,
    importFromJson
  }
})