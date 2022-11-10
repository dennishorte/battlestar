<template>
  <div class="card-manager-button-group">
    <div class="btn-group">
      <button @click="removeCard" :class="plusMinusClasses">-</button>
      <button :class="nameClasses">{{ name }} {{ count }}</button>
      <button @click="addCard" class="btn btn-outline-primary btn-plus-minus">+</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CardManagerButtonGroup',

  props: {
    name: String,
    variant: String,
    count: Number
  },

  computed: {
    nameClasses() {
      return [
        "btn",
        "btn-plus-minus-title",
        `btn-${this.variant}`,
      ]
    },

    plusMinusClasses() {
      return [
        "btn",
        "btn-plus-minus",
        `btn-outline-${this.variant}`,
      ]
    }
  },

  methods: {
    addCard() {
      this.$emit('add-card', this.name)
    },

    removeCard() {
      this.$emit('remove-card', this.name)
    },
  },
}
</script>


<style scoped>
.card-manager-button-group:not(:first-of-type) {
  margin-top: .5em;
}

.btn-plus-minus {
  min-width: 3em;
}

.btn-plus-minus-title {
  min-width: 6em;
}
</style>
