<template>
  <div class="editable-text">
    <template v-if="isEditing">
      <b-input-group>
        <b-form-input
          size="sm"
          trim
          v-on:keyup.enter="save"
          v-model="editedValue"></b-form-input>
        <b-input-group-append>
          <b-button variant="primary" size="sm" @click="save">&#10003;</b-button>
          <b-button variant="warning" size="sm" @click="cancel">&#10799;</b-button>
        </b-input-group-append>
      </b-input-group>
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
      value: ''
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
