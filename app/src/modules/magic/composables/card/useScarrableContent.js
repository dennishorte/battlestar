import { computed, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'


export function useScarrableContent(card, faceIndex, field, emit, options) {
  const {
    isEditable = false,
  } = options

  const fieldValue = computed(() => card.face(faceIndex)[field] || '')

  const editor = useEditableContent(fieldValue.value, {
    editable: isEditable,
    onUpdate: (value) => emit('value-updated', { field, value }),
    ...options
  })

  watch(fieldValue, (newValue) => editor.setValue(newValue))

  return {
    editor,
  }
}
