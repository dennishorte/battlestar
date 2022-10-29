<template>
  <div class="editable-text">
    <template v-if="isEditing">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="editedValue"
          @keyup.enter="save"
        />

        <button class="btn btn-primary" @click="save">&#10003;</button>
        <button class="btn btn-warning" @click="cancel">&#10799;</button>
      </div>
    </template>

    <div v-else @click="edit">
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  name: 'EditableText',

  data() {
    return {
      isEditing: false,
      editedValue: '',
      value: '',
    }
  },

  methods: {
    cancel() {
      this.isEditing = false
      this.editedValue = ''
    },
    edit() {
      this.isEditing = true
      this.value = this.$slots.default[0].text
      this.editedValue = this.value
    },
    save() {
      if (this.value !== this.editedValue) {
        const from = this.value
        this.value = this.editedValue
        this.$emit('text-edited', {
          from: from,
          to: this.editedValue,
        })
      }
      this.cancel()
    },
  },
}
</script>
