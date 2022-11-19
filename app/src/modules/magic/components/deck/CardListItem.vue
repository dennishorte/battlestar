<template>
  <div class="card-list-item" @mouseover="mouseover" @mouseleave="mouseleave" @mousemove="mousemove">
    {{ card.name }}
  </div>
</template>


<script>
export default {
  name: 'CardListItem',

  props: {
    card: Object,
  },

  methods: {
    mouseover() {
      this.$store.commit('magic/setMouseoverCard', this.card)
    },

    mouseleave() {
      this.$store.commit('magic/unsetMouseoverCard', this.card)
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
.card-list-item {
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
}

.card-popup {
  position: fixed;
  min-height: 5em;
  min-width: 5em;
  background-color: lightgray;
}
</style>
