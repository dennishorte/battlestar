<template>
  <div @click="handleClick" class="scarrable-content">
    <EditableContent
      v-if="isEditingValue"
      v-bind="editor"
      :class="{
        'full-width': showFullWidth,
        'multiline': editor.multiline,
        'empty-text': isEmpty,
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
  isEmpty: {
    type: [Boolean, Object],
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
const isEmpty = computed(() => unref(props.isEmpty))
const scarredParts = computed(() => unref(props.scarredParts))
const isEditingValue = computed(() => props.editor.isEditing.value)
</script>


<style scoped>
.scarrable-content {
  min-height: 1em;
  width: 100%;
}

.empty-text {
  background-color: rgba(255, 200, 0, .3);
  border: 1px dotted gray;
  padding: 0 .5em;
}

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
