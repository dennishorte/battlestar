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
    name: {
      type: String,
      default: ''
    },
  },

  computed: {
    card() {
      return this.game.getCardById(this.name)
    },

    classes() {
      return this.funcs.cardClasses ? this.funcs.cardClasses(this.card) : []
    },

    displayName() {
      if (this.card) {
        if (typeof this.card.name === 'function') {
          return this.card.name()
        }
        else {
          return this.card.name
        }
      }
      else {
        return this.name
      }
    },

    styles() {
      return this.funcs.cardStyles ? this.funcs.cardStyles(this.card) : []
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
