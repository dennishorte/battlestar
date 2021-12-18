<template>
  <div class="waiting-choice">

    <OptionSelector :selector="action" :required="true" @selection-changed="childChanged" />

    <GameButton :owner="actor" @click="submit" :disabled="!isValid">
      choose
    </GameButton>

  </div>
</template>


<script>
import axios from 'axios'
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
      return this.$game.getWaiting(this.actor)
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
    async maybeNotifyPlayers() {
      if (process.env.NODE_ENV === 'development') {
        return
      }
      for (const player of this.$game.getPlayerAll()) {
        if (this.$game.checkPlayerHasActionWaiting(player)) {
          await axios.post('/api/game/notify', {
            gameId: this.$game.state._id,
            userId: player._id,
          })
        }
      }
    },

    async submit() {
      const payload = {
        actor: this.actor,
        name: this.action.name,
        option: this.selection.option,
      }
      this.$game.submit(payload)
      await this.$game.save()
      await this.maybeNotifyPlayers()
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
