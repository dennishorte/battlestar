import { computed, ref, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'


export function useScarrableContent(card, faceIndex, field, emit, options) {
  const {
    editable = false,
    oldVersions = [],
  } = options

  const fieldValue = computed(() => card.face(faceIndex)[field] || '')
  const scarred = computed(() => oldVersions.length > 0)
  const showOriginalText = ref(false)

  const editor = useEditableContent(fieldValue.value, {
    onUpdate: (value) => emit('value-updated', { field, value }),
    ...options
  })

  watch(fieldValue, (newValue) => editor.setValue(newValue))
  watch(showOriginalText, (showOriginal) => {
    const newValue = showOriginal ? oldVersions[0] : fieldValue.value
    editor.setValue(newValue)
  })

  function cardChanged(/*card, index, oldVersions*/) {
    console.log('cardChanged')
  }

  function handleClick(event) {
    // Toggle between the original text and the scarred text.
    if (!editable && scarred) {
      event.stopPropagation()
      showOriginalText.value = !showOriginalText.value
    }
  }

  return {
    scarred,
    editor,
    showingOriginalText: showOriginalText,

    cardChanged,
    handleClick,
  }
}
