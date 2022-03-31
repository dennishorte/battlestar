<template>
  <div class="waiting-choice">

    <OptionSelector
      :key="key"
      :selector="request"
      :required="true"
      @selection-changed="childChanged"
    />

    <GameButton :owner="actor.name" @click="submit" :disabled="!isValid">
      choose
    </GameButton>

  </div>
</template>


<script>
// import axios from 'axios'
import GameButton from './GameButton'
import OptionSelector from './OptionSelector'
import { selector } from 'battlestar-common'

export default {
  name: 'WaitingChoice',

  components: {
    GameButton,
    OptionSelector,
  },

  inject: ['game'],

  props: {
    actor: Object,
  },

  data() {
    return {
      selection: {
        title: '',
        selection: []
      },
    }
  },

  computed: {
    key() {
      return this.game.getWaitingKey()
    },

    request() {
      return this.game.getWaiting(this.actor)
    },

    isValid() {
      return selector.validate(this.request, this.selection).valid
    },
  },

  watch: {
    request() {
      this.selection.title = this.request.title
      this.selection.selection = []
    },
  },

  methods: {
    async submit() {
      const payload = {
        actor: this.actor.name,
        title: this.request.title,
        selection: this.selection.selection,
        key: this.game.getWaitingKey(),
      }
      try {
        this.game.respondToInputRequest(payload)
      }
      catch (e) {
        alert('Error!\nCheck console for details.')
        throw e
      }
      await this.game.save()
    },

    childChanged(event) {
      this.selection = event
    },
  },

  beforeMount() {
    this.selection.title = this.request.title
  },
}
</script>


<style scoped>
.action-title {
  font-weight: bold;
  text-align: center;
}
</style>
