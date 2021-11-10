<template>
  <div class="waiting-choice">

    <OptionSelector :selector="action" :required="true" @selection-changed="childChanged" />

    <GameButton :owner="actor" @click="submit" :disabled="!isValid">
      choose
    </GameButton>

  </div>
</template>


<script>
import GameButton from './GameButton'
import OptionSelector from './OptionSelector'
import { selector } from 'battlestar-common'

export default {
  name: 'WaitingChoice',

  components: {
    GameButton,
    OptionSelector,
  },

  props: {
    actor: String,
  },

  data() {
    return {
      selection: {
        name: '',
        option: []
      },
    }
  },

  computed: {
    action() {
      return this.$game.getWaiting(this.actor).actions[0]
    },

    isValid() {
      return selector.validate(this.action, this.selection).valid
    },
  },

  watch: {
    action() {
      this.selection.name = this.action.name
      this.selection.option = []
    },
  },

  methods: {
    async submit() {
      this.$game.submit({
        actor: this.actor,
        name: this.action.name,
        option: this.selection.option,
      })
      await this.$game.save()
    },

    childChanged(event) {
      this.selection = event
    },
  },

  beforeMount() {
    this.selection.name = this.action.name
  },
}
</script>


<style scoped>
.action-name {
  font-weight: bold;
  text-align: center;
}
</style>
