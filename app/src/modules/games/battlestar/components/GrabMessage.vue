<template>
  <div
    class="grab-message"
    :class="[hidden ? 'd-none' : '']"
  >

    <div class="message">
      {{ message }}
    </div>

    <b-button v-if="visible" @click="info" variant="success">info</b-button>
    <b-button @click="cancel" variant="primary">cancel</b-button>
  </div>
</template>


<script>
export default {
  name: 'GrabMessage',

  computed: {
    grab() {
      return this.$store.getters['bsg/grab']
    },
    hidden() {
      return this.grab.source.length === 0
    },
    message() {
      if (this.hidden)
        return ''

      const card = this.$game.getCardByLocation(this.grab.source, this.grab.index)
      const cardName = this.$game.checkCardIsVisible(card) ? card.name : card.kind
      return `Holding ${cardName} from ${this.grab.source}`
    },
    visible() {
      if (this.hidden)
        return false
      const card = this.$game.getCardByLocation(this.grab.source, this.grab.index)
      return this.$game.checkIsVisible(card)
    },
  },

  methods: {
    cancel() {
      this.$store.dispatch('bsg/grabCancel')
    },

    async info() {
      const modal = await this.$store.dispatch('bsg/grabInfo')
      this.$bvModal.show(modal)
    },
  },
}
</script>


<style scoped>
.grab-message {
  position: fixed;
  top: 0;
  width: inherit;
  height: 4em;
  z-index: 1000;

  padding: .5em;

  background-color: cyan;
  box-shadow: 0 10px 10px cyan;

  display: flex;
  justify-content: space-between;
}

.message {
  margin-top: .7em;
  margin-left: 1em;
}
</style>
