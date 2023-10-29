<template>
  <div class="card-name" @click="clicked" :class="classes" :style="styles">
    {{ displayName }}
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

    classes() {
      const classes = []

      if (!this.game.settings.chooseColors && this.tokenOwner) {
        const color = this.ui.fn.getPlayerColor(this.game, this.tokenOwner)
        classes.push(`${color}-element`)
      }

      return classes
    },

    displayName() {
      return this.card ? this.card.name : this.name
    },

    styles() {
      const output = {}

      if (this.game.settings.chooseColors && this.tokenOwner) {
        output['background-color'] = this.tokenOwner.color
      }

      return output
    },

    tokenOwner() {
      const nameBits = this.name.split('-')
      if (nameBits.length > 1 && (nameBits[0] === 'troop' || nameBits[0] === 'spy')) {
        return this.game.getPlayerByName(nameBits[1])
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
.card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
