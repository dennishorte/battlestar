<template>
  <div
    class="card-name"
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    :class="classes"
    :style="styles"
  >
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  inject: ['game', 'funcs'],

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
    click() {
      if (this.funcs.cardClick) {
        this.funcs.cardClick(this.card)
      }
    },

    mouseover() {
      if (this.funcs.cardMouseover) {
        this.funcs.cardMouseover(this.card)
      }
    },

    mouseleave() {
      if (this.funcs.cardMouseleave) {
        this.funcs.cardMouseleave(this.card)
      }
    },

    mousemove(event) {
      if (this.funcs.cardMousemove) {
        this.funcs.cardMousemove(event, this.card)
      }
    },
  },
}
</script>


<style scoped>
.card-name {
  display: inline-block;
}
</style>
