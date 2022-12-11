<template>
  <div
    class="card-name"
    @click="clicked"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
  >
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  inject: ['game'],

  props: {
    name: String,
  },

  computed: {
    card() {
      return this.game.getCardById(this.name)
    },

    displayName() {
      return this.card ? this.card.name : this.name
    },
  },

  methods: {
    clicked() {
    },

    mouseover() {
      this.$store.commit('magic/setMouseoverCard', this.card.data)
    },

    mouseleave() {
      this.$store.commit('magic/unsetMouseoverCard', this.card.data)
    },

    mousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },
  },
}
</script>


<style scoped>
.card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
