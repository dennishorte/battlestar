<template>
  <div
    ref="editableDiv"
    class="editable-div"
    :class="[customClass, {'is-editable': editable}]"
    :contenteditable="isEditing"
    @click="handleClick"
    @blur="onBlur"
    @input="onInput">
    <template v-if="!isEditing && renderComponent">
      <slot :text="text"></slot>
    </template>
    <template v-else-if="!renderComponent || isEditing">
      <span v-html="displayText"></span>
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
}

.editable-div.is-editable {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
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
