<template>
  <div
    ref="editableDiv"
    class="editable-div"
    :class="[customClass, {'is-editable': editable}]"
    :contenteditable="editable"
    @click="handleClick"
    @blur="onBlur"
    @input="onInput">
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
    }
  },

  mounted() {
    // Set the initial content
    if (this.$refs.editableDiv && this.text) {
      this.$refs.editableDiv.innerHTML = this.text
    }
  },

  watch: {
    text(newValue) {
      // Update the content when the text prop changes
      if (this.$refs.editableDiv && this.$refs.editableDiv.innerHTML !== newValue) {
        this.$refs.editableDiv.innerHTML = newValue
      }
    }
  },

  methods: {
    handleClick() {
      if (this.editable && this.$refs.editableDiv) {
        this.$refs.editableDiv.focus()
      }
    },

    onBlur(event) {
      this.$emit('update', {
        field: this.field,
        value: this.htmlToPlainText(event.target.innerHTML)
      })
    },

    onInput(event) {
      this.$emit('input', this.htmlToPlainText(event.target.innerHTML))
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
