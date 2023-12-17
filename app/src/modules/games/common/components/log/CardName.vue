<template>
  <div class="card-name" @click="clicked" :class="classes" :style="styles">
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  inject: ['game', 'ui', 'funcs'],

  props: {
    name: String,
  },

  computed: {
    card() {
      return this.game.getCardById(this.name)
    },

    classes() {
      if (this.funcs.cardClasses) {
        return this.funcs.cardClasses(this.card)
      }
    },

    displayName() {
      return this.card ? this.card.name : this.name
    },

    styles() {
      if (this.funcs.cardStyles) {
        return this.funcs.cardStyles(this.card)
      }
    },
  },

  methods: {
    clicked() {
      this.ui.modals.cardViewer.cardId = this.name
      this.$modal('card-viewer-modal').show()
    },
  },
}
</script>


<style scoped>
</style>
