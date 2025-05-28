<template>
  <div class="card-oracle-text">
    <!-- Show EditableContent when editing or when text is empty -->
    <EditableContent
      v-if="isEditingValue || props.text.length === 0"
      v-bind="editor"
      style="white-space: pre-line;"
    />

    <!-- Show parsed oracle text when not editing and text exists -->
    <div v-else class="oracle-text-display" @click="editor.startEditing">
      <div
        v-for="(line, lineIndex) in lines"
        :key="lineIndex"
        class="rules-line"
      >
        <template v-for="(part, partIndex) in line.parts" :key="partIndex">
          <span v-if="part.type === 'text'">{{ part.text }}</span>
          <ManaSymbol v-else-if="part.type === 'symbol'" :m="part.text" />
          <ReminderText v-else-if="part.type === 'reminder'" :text="part.text" />
          <span class="error-text" v-else>{{ part.text }}</span>
        </template>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, watch } from 'vue'
import { mag } from 'battlestar-common'

import { useEditableContent } from '@/composables/useEditableContent.js'
import EditableContent from '@/components/EditableContent.vue'

import ManaSymbol from './ManaSymbol.vue'
import ReminderText from './ReminderText.vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
})

const emit = defineEmits(['value-updated'])

const editor = useEditableContent(props.text, {
  multiline: true,
  onUpdate: (value) => emit('value-updated', { field: 'oracle_text', value }),
})

const lines = computed(() => mag.util.card.parseOracleText(props.text))

// Create a computed property to properly access the reactive isEditing value
const isEditingValue = computed(() => editor.isEditing.value)

watch(() => props.text, (newValue) => editor.setValue(newValue))
</script>


<style scoped>
.oracle-text-display {
  cursor: pointer;
}

.oracle-text-display:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.error-text {
  font-family: monospace;
}
</style>
