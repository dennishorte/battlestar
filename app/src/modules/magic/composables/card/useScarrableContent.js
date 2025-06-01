import { computed, ref, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'
import { diffWords } from 'diff'
import { magic } from 'battlestar-common'


export function useScarrableContent(card, faceIndex, field, emit, options) {
  const {
    editable = false,
    narrowTape = false,
    oldVersions = [],
  } = options

  const fieldValue = computed(() => card.face(faceIndex)[field] || '')
  const scarred = computed(() => oldVersions.length > 0)
  const showFullWidth = computed(() => fieldValue.value.length === 0 && editable && !scarred.value)

  const scarredParts = computed(() => {
    if (oldVersions.length === 0) {
      return [{
        value: fieldValue.value,
        added: false,
        removed: false,
      }]
    }

    const diff = diffWords(oldVersions[0], fieldValue.value, { intlSegmenter: intlSegmenterShapedObject })
    return diff.filter(x => x.added || !x.removed)
  })

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
    if (!editable && scarred.value) {
      event.stopPropagation()
      showOriginalText.value = !showOriginalText.value
    }
    else {
      editor.startEditing()
    }
  }

  return {
    fieldValue,
    scarredParts,
    editor,
    narrowTape,
    showFullWidth,
    showingOriginalText: showOriginalText,

    cardChanged,
    handleClick,
  }
}

const intlSegmenterShapedObject = {
  resolvedOptions() {
    return {
      granularity: 'word',
    }
  },

  segment(text) {
    const tokens = magic.util.card.segmentText(text)
    return tokens.map(t => ({ segment: t }))
  },
}
