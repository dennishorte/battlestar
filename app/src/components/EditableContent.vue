<template>
  <span
    :ref="editableRef"
    class="editable-content"
    :class="{
      'is-editable': editable,
      'is-editing': isEditing,
      'is-empty': isEmpty
    }"
    :contenteditable="isEditing"
    @click="startEditing"
    @blur="stopEditing"
    @input="handleInput"
    @keydown="handleKeydown"
  >
    <span v-if="showEmptyPlaceholder" class="empty-placeholder">
      {{ emptyText }}
    </span>
    <span v-else>{{ displayValue }}</span>
  </span>
</template>

<script setup>
import { computed, unref } from 'vue'

const props = defineProps({
  isEditing: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    default: false
  },
  value: {
    type: [String, Object], // Accept both String and Ref<String>
    default: ''
  },
  isEmpty: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    default: true
  },
  showEmptyPlaceholder: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    default: false
  },
  emptyText: {
    type: [String, Object], // Accept both String and Ref<String>
    default: 'Click to edit'
  },
  editable: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    default: true
  },
  editableRef: {
    type: Object,
    default: () => ({})
  },
  startEditing: {
    type: Function,
    default: () => () => {}
  },
  stopEditing: {
    type: Function,
    default: () => () => {}
  },
  handleInput: {
    type: Function,
    default: () => () => {}
  },
  handleKeydown: {
    type: Function,
    default: () => () => {}
  }
})

// Create computed properties that unwrap refs if needed
const isEditing = computed(() => unref(props.isEditing))
const value = computed(() => unref(props.value))
const isEmpty = computed(() => unref(props.isEmpty))
const showEmptyPlaceholder = computed(() => unref(props.showEmptyPlaceholder))
const emptyText = computed(() => unref(props.emptyText))
const editable = computed(() => unref(props.editable))

const displayValue = computed(() => value.value || '')
</script>

<style scoped>
.editable-content {
  position: relative;
  display: inline-block;
  min-height: 1em;
}

.editable-content.is-editable {
  cursor: pointer;
}

.editable-content.is-editable:before {
  content: "✏️";
  position: absolute;
  opacity: 0;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.editable-content.is-editable:hover:before {
  opacity: 1;
}

.editable-content.is-empty.is-editable {
  min-width: 2em;
  padding: 2px 4px;
  border-radius: 3px;
}

.editable-content.is-editing {
  cursor: text;
  outline: none;
}

.empty-placeholder {
  color: rgba(100, 100, 100, 0.4);
  font-style: italic;
  font-size: 0.9em;
}
</style>
