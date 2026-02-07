import { computed, ref, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'
import { diffWords } from 'diff'
import { magic } from 'battlestar-common'


function _unpackField(f) {
  if (typeof f === 'object') {
    return {
      name: f.name || '',
      getDisplay: (card, faceIndex) => f.getDisplay(card, faceIndex) || '',
      getEditable: (card, faceIndex) => f.getEditable(card, faceIndex) || '',
    }
  }
  else if (typeof f === 'string') {
    return {
      name: f,
      getDisplay: (card, faceIndex) => card.face(faceIndex)[f] || '',
      getEditable: (card, faceIndex) => card.face(faceIndex)[f] || '',
    }
  }
  else {
    throw new Error('Unhandle field type: ' + (typeof f))
  }
}


export function useScarrableContent(card, faceIndex, field, emit, options) {
  const {
    // Determine if the text content can be edited.
    editable = false,
  } = options

  const f = _unpackField(field)

  // Flag to track if the display text or original text should be displayed at the moment.
  // Players should be able to view the original text in order to more clearly understand what has changed.
  const showOriginalText = ref(false)

  // The text to display when not editing the text.
  const displayText = computed(() => f.getDisplay(card.value, faceIndex))

  // The text to display when editing the text.
  // In most cases, this is the same as display text, but sometimes, such as with oracle text CARD_NAME,
  // we want to differentiate to make editing more manageable.
  const editableText = computed(() => f.getEditable(card.value, faceIndex))

  // The text as it was on the card before any edits took place.
  // If there have been no edits, this is the same as display text.
  const originalText = computed(() => {
    const oldVersions = card.value.oldVersions(faceIndex, f.name)
    return oldVersions.length > 0 ? oldVersions[0] : displayText.value
  })

  // True if the text for this field has been edited.
  const scarred = computed(() => originalText.value !== displayText.value)

  // If true, the div containing this text will be extended to maximum width.
  // This is helpful when the div is empty, making it hard to click on it.
  const showFullWidth = computed(() => displayText.value.length === 0 && editable && !scarred.value)

  const isEmpty = computed(() => displayText.value.trim().length === 0)

  // Break the text down into sections based on the changes that have been made so the scars can be
  // highlighted in the display. Uses a word-level diff algorithm to separate the scarred parts.
  const scarredParts = computed(() => {
    if (scarred.value === false) {
      return [{
        value: displayText.value,
        scarred: false,
      }]
    }

    const diff = diffWords(originalText.value, displayText.value, { intlSegmenter: intlSegmenterShapedObject })
    return diff
      .filter(x => x.added || !x.removed)
      .map(x => ({
        value: x.value,
        scarred: x.added,
      }))
  })

  const editor = useEditableContent(editableText.value, {
    onUpdate: (value) => emit('value-updated', { field: f.name, value }),
    ...options
  })

  watch(editableText, (newValue) => editor.setValue(newValue))

  // Reset state when card reference changes to prevent state bleeding between cards
  watch(() => card.value, (newCard, oldCard) => {
    if (newCard !== oldCard) {
      showOriginalText.value = false
      // editor.setValue(editableText.value)
    }
  })

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
    isEmpty,
    scarredParts,
    editor,
    showFullWidth,
    showingOriginalText: showOriginalText,

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
