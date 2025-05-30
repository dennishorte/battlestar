import { ref, computed, nextTick } from 'vue'

export function useEditableContent(initialValue = '', options = {}) {
  const {
    onUpdate = () => {},
    onInput = () => {},
    emptyText = 'Click to edit',
    editable = true,
    allowEmpty = true,
    multiline = false,
  } = options

  const isEditing = ref(false)
  const value = ref(initialValue)
  const editableRef = ref(null)

  const isEmpty = computed(() => !value.value || value.value.trim() === '')

  const showEmptyPlaceholder = computed(() =>
    false
    //    !isEditing.value && isEmpty.value && editable
  )

  const startEditing = async () => {
    if (!editable || isEditing.value) {
      return
    }

    isEditing.value = true
    await nextTick()

    if (editableRef.value) {
      // Always set the textContent to ensure clean editing
      // Clear first to prevent any template content from interfering
      editableRef.value.innerHTML = ''
      editableRef.value.textContent = value.value
      editableRef.value.focus()
      // Set cursor to end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editableRef.value)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const stopEditing = () => {
    if (!isEditing.value) {
      return
    }

    const newValue = (editableRef.value?.textContent || '').trim()

    if (newValue.length > 0 || allowEmpty) {
      value.value = newValue
      isEditing.value = false
      onUpdate(value.value)
    }
    else {
      editableRef.value.textContent = value.value
    }
  }

  const handleInput = (event) => {
    const newValue = event.target.textContent || ''
    onInput(newValue.trim())
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !multiline) {
      event.preventDefault()
      editableRef.value?.blur()
    }
    if (event.key === 'Escape') {
      // Reset to original value and stop editing
      if (editableRef.value) {
        editableRef.value.innerHTML = value.value
      }
      editableRef.value?.blur()
    }
  }

  // Update value when external changes occur
  const setValue = (newValue) => {
    value.value = newValue
    // If we're not editing and have a ref, update the DOM content
    // This ensures the display stays in sync when cards change
    if (!isEditing.value && editableRef.value) {
      // Only update if the content is different to avoid unnecessary DOM manipulation
      const currentContent = editableRef.value.textContent || ''
      if (currentContent !== newValue) {
        editableRef.value.textContent = newValue
      }
    }
  }

  return {
    // State
    isEditing,
    value,
    isEmpty,
    showEmptyPlaceholder,
    editableRef,

    // Methods
    startEditing,
    stopEditing,
    handleInput,
    handleKeydown,
    setValue,

    // Config
    emptyText,
    editable
  }
}
