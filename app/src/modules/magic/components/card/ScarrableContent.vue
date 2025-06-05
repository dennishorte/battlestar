<template>
  <div @click="handleClick">
    <EditableContent
      v-if="isEditingValue"
      v-bind="editor"
      :class="{
        'full-width': showFullWidth,
        'multiline': editor.multiline,
      }"
    />

    <div v-else>
      <slot>
        <span
          v-for="part in scarredParts"
          :key="part.value"
          :class="{
            'original-text': part.scarred && showingOriginalText,
            'scar-tape': part.scarred,
          }"
        >
          {{ part.value }}
        </span>
      </slot>
    </div>
  </div>
</template>


<script setup>
import { computed, unref } from 'vue'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  scarredParts: {
    type: [Array, Object], // Accept both Array and Ref<Array>
    required: true,
  },
  showFullWidth: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    required: true,
  },
  showingOriginalText: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    required: true,
  },

  handleClick: {
    type: Function,
    required: true
  },
})

const showFullWidth = computed(() => unref(props.showFullWidth))
const showingOriginalText = computed(() => unref(props.showingOriginalText))
const scarredParts = computed(() => unref(props.scarredParts))
const isEditingValue = computed(() => props.editor.isEditing.value)
</script>


<style scoped>
.multiline {
  white-space: pre-line;
  width: 100%;
}

.original-text {
  position: relative;
  font-weight: normal;
  text-decoration: line-through;
  text-decoration-style: double;
}
</style>
