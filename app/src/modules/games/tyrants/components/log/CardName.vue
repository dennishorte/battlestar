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
      return this.game.getCardById(this.name)
    },
  },

  methods: {
    clicked() {
      this.ui.modals.cardViewer.cardId = this.name
      this.$bvModal.show('card-viewer-modal')
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
