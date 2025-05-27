<template>
  <div class="card-art-container" @click="toggleEditor">
    <!-- Image display area -->
    <div v-if="imageUri" class="frame-art-wrapper">
      <img
        v-if="!isSplitCard"
        class="frame-art"
        alt="card art"
        :src="imageUri" />
      <img
        v-else
        class="frame-art split-card-art"
        :class="{'split-left': index === 0, 'split-right': index === 1}"
        alt="card art"
        :src="imageUri" />
    </div>
    <div v-else class="frame-art empty-art">
      <span class="empty-art-text">Click to add image URL</span>
    </div>

    <!-- Editable URL overlay -->
    <div
      v-if="showEditor"
      class="art-url-editor"
      @click.stop>
      <EditableContent v-bind="artEditor" class="frame-art-url" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  face: {
    type: Object,
    required: true,
  },
  isSplitCard: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['value-updated'])

const showEditor = ref(false)
const imageUri = computed(() => props.face.image_uri)

const artEditor = useEditableContent(imageUri.value, {
  onUpdate: (value) => {
    emit('value-updated', { field: 'image_uri', value })
    hideEditor()
  },
  emptyText: 'Enter image URL',
})

const toggleEditor = () => {
  showEditor.value = !showEditor.value
  if (showEditor.value) {
    // Small delay to ensure the editor is rendered before focusing
    setTimeout(() => {
      artEditor.startEditing()
    }, 50)
  }
}

const hideEditor = () => {
  showEditor.value = false
}
</script>

<style scoped>
.card-art-container {
  position: relative;
  width: 100%;
  min-height: 140px;
  cursor: pointer;
}

.frame-art-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 140px;
}

.frame-art {
  width: 100%;
  height: auto;
  display: block;
}

.empty-art {
  background-color: #ccc;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
}

.empty-art-text {
  opacity: 0.7;
}

.art-url-editor {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.frame-art-url {
  color: white;
  min-width: 120px;
}

.close-editor {
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-editor:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.split-card-art {
  width: 100%;
  height: 100%;
  max-width: none;
  clip-path: inset(0 50% 0 0);
}

.split-left {
  clip-path: inset(0 50% 0 0);
}

.split-right {
  clip-path: inset(0 0 0 50%);
}

.split-card-art.split-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  object-position: 0% center;
  transform-origin: left center;
}

.split-card-art.split-right {
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  object-position: 100% center;
  transform-origin: right center;
}
</style>
