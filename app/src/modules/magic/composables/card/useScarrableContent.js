import { computed, ref, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'


export function useScarrableContent(card, faceIndex, field, emit, options) {
  const {
    editable = false,
    scars = [],
  } = options

  const fieldValue = computed(() => card.face(faceIndex)[field] || '')
  const scarred = computed(() => scars.length > 0)
  const toggleScars = ref(false)

  const editor = useEditableContent(fieldValue.value, {
    onUpdate: (value) => emit('value-updated', { field, value }),
    ...options
  })

  watch(fieldValue, (newValue) => editor.setValue(newValue))
  watch(toggleScars, (showOriginal) => {
    const newValue = showOriginal ? scars[0] : fieldValue.value
    editor.setValue(newValue)
  })

  function cardChanged(/*card, index, scars*/) {
    console.log('cardChanged')
  }

  function handleClick(event) {
    // Toggle between the original text and the scarred text.
    if (!editable && scarred) {
      event.stopPropagation()
      toggleScars.value = !toggleScars.value
    }
  }

  return {
    scarred,
    editor,

    cardChanged,
    handleClick,
  }
}
