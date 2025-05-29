<template>
  <div class="card-oracle-text">
    <!-- Show EditableContent when editing or when text is empty -->
    <EditableContent
      v-if="isEditingValue || text.length === 0"
      v-bind="editor"
      style="white-space: pre-line; width: 100%;"
    />

    <!-- Show parsed oracle text when not editing and text exists -->
    <div v-else class="oracle-text-display" @click="beginEditing">
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
  card: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['value-updated'])

const rawText = computed(() => props.card.oracleTextCardName(props.index))
const text = computed(() => props.card.oracleText(props.index))
const lines = computed(() => mag.util.card.parseOracleText(text.value))

const editor = useEditableContent(rawText.value, {
  multiline: true,
  onUpdate: (value) => emit('value-updated', { field: 'oracle_text', value }),
})

// Create a computed property to properly access the reactive isEditing value
const isEditingValue = computed(() => editor.isEditing.value)

watch(() => text.value, (newValue) => editor.setValue(newValue))

function beginEditing() {
  if (props.isEditable) {
    editor.startEditing()
  }
}
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
