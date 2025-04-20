<template>
  <div
    ref="editableDiv"
    class="editable-div"
    :class="[customClass, {'is-editable': editable, 'is-empty': isEmpty}]"
    :contenteditable="isEditing"
    @click="handleClick"
    @blur="onBlur"
    @input="onInput">
    <template v-if="!isEditing && renderComponent">
      <slot :text="text"></slot>
    </template>
    <template v-else-if="!renderComponent || isEditing">
      <span v-if="isEmpty && !isEditing && editable" class="empty-placeholder">Click to edit</span>
      <span v-else v-html="displayText"></span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditableDiv',

  props: {
    text: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    field: {
      type: String,
      required: true
    },
    renderComponent: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isEditing: false,
      displayText: ''
    }
  },

  created() {
    this.displayText = this.text || ''
  },

  computed: {
    isEmpty() {
      return !this.text || this.text.trim() === '';
    }
  },

  watch: {
    text(newValue) {
      if (!this.isEditing) {
        this.displayText = newValue
      }
    },
    isEditing(newValue) {
      if (newValue) {
        this.displayText = this.text || ''
        this.$nextTick(() => {
          if (this.$refs.editableDiv) {
            this.$refs.editableDiv.focus()
          }
        })
      }
    }
  },

  methods: {
    handleClick() {
      if (this.editable && !this.isEditing) {
        this.isEditing = true
      }
    },

    onBlur(event) {
      if (!this.isEditing) return

      // Extract content from the editable div
      const content = this.$refs.editableDiv.innerHTML
      const newValue = this.htmlToPlainText(content)

      this.$emit('update', {
        field: this.field,
        value: newValue
      })

      // Only update local display text if we're not using a component
      if (!this.renderComponent) {
        this.displayText = newValue
      }

      this.isEditing = false
    },

    onInput(event) {
      const newValue = this.htmlToPlainText(event.target.innerHTML)
      this.$emit('input', newValue)
    },

    htmlToPlainText(html) {
      // Create a temporary div to handle HTML conversion
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html

      // Replace <br> and <p> tags with newlines
      const content = tempDiv.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p><p>/gi, '\n')
        .replace(/<[^>]*>/g, '')

      // Decode HTML entities
      return content
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
    }
  }
}
</script>

<style scoped>
.editable-div {
  min-height: 1em;
  cursor: text;
  position: relative;
}

.editable-div.is-editable {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.editable-div.is-editable:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.editable-div.is-editable:before {
  content: "✏️";
  position: absolute;
  opacity: 0;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  transition: opacity 0.2s ease;
}

.editable-div.is-editable:hover:before {
  opacity: 1;
}

.editable-div.is-empty.is-editable {
  min-width: 2em;
  min-height: 1.2em;
  background-color: rgba(255, 255, 255, 0.05);
}

.editable-div.is-empty.is-editable:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.empty-placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  font-size: 0.9em;
}

.editable-div[contenteditable="true"] {
  cursor: text;
}

.editable-div[contenteditable="true"]:hover {
  outline: 1px dashed rgba(255, 255, 255, 0.5);
}

.editable-div[contenteditable="true"]:focus {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 1px;
}
</style>
