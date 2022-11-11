<template>
  <div class="card-name" @click="clicked">
    {{ card.name }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  inject: ['game', 'ui'],

  props: {
    name: String,
  },

  computed: {
    card() {
      const card = this.game.getCardById(this.name)
      if (!card) {
        alert('Unable to find card named: ' + this.name)
      }
      return card
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
.card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
