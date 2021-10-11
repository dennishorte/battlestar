<template>
  <div class="character-assign-button">
    <b-button :variant="variant" @click="choose" :disabled="!isValidAction">
      {{ label }}
    </b-button>
  </div>
</template>


<script>
export default {
  name: 'CharacterAssignButton',

  props: {
    name: String,
  },

  computed: {
    assignedPlayer() {
      return this.$game.getPlayerWithCard(this.name)
    },

    isValidAction() {
      if (!this.waitingAction) {
        return false
      }
      else {
        return this.waitingAction.options.includes(this.name)
      }
    },

    label() {
      if (this.isValidAction) {
        return 'choose'
      }
      else if (this.assignedPlayer) {
        return this.assignedPlayer.name
      }
      else {
        return ''
      }
    },

    variant() {
      if (this.isValidAction)
        return 'primary'
      else if (this.assignedPlayer)
        return 'success'
      else
        return 'secondary'
    },

    waitingAction() {
      const waiting = this.$game.getWaiting()
      return waiting.actions.find(action => action.name === 'Select Character')
    },
  },

  methods: {
    choose() {
      if (this.isValidAction) {
        this.$game.submit({
          actor: this.$game.getActor().name,
          name: this.waitingAction.name,
          option: this.name,
        })
      }
    },
  },
}
</script>


<style scoped>
</style>
