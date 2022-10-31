<template>
  <div class="waiting-choice">

    <OptionSelector
      :key="key"
      :selector="request"
      :required="true"
      @selection-changed="childChanged"
    />

    <button @click="submit" :disabled="!isValid">choose</button>

  </div>
</template>


<script>
import { selector } from 'battlestar-common'

import OptionSelector from './OptionSelector'

export default {
  name: 'WaitingChoice',

  components: {
    OptionSelector,
  },

  inject: ['game', 'bus'],

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
      const waiting = this.game.getWaiting(this.actor)
      this.insertSubtitles(waiting)
      return waiting
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
      this.bus.emit('waiting-selection-changed', [...this.selection.selection])
    },

    insertDogmaShareSubtitles(selector) {
      const player = this.game.getPlayerByName(this.actor.name)
      const updated = []
      for (const option of selector.choices) {
        const cardName = option.title || option
        const card = this.game.getCardByName(cardName)
        const shareInfo = this.game.getDogmaShareInfo(player, card, { noBiscuitKarma: true })

        const subtitles = []

        if (shareInfo.hasShare && shareInfo.sharing.length > 0) {
          const shareNames = shareInfo.sharing.map(p => p.name).join(', ')
          subtitles.push(`share with ${shareNames}`)
        }

        if (shareInfo.hasCompel && shareInfo.sharing.length > 0) {
          const compelNames = shareInfo.sharing.map(p => p.name).join(', ')
          subtitles.push(`compel ${compelNames}`)
        }

        if (shareInfo.hasDemand && shareInfo.demanding.length > 0) {
          const demandNames = shareInfo.demanding.map(p => p.name).join(', ')
          subtitles.push(`demand ${demandNames}`)
        }

        updated.push({
          title: cardName,
          subtitles,
        })
      }

      selector.choices = updated
    },

    insertSubtitles(selector) {
      if (selector.title === 'Dogma') {
        this.insertDogmaShareSubtitles(selector)
      }

      for (const option of selector.choices) {
        if (this.optionHasChildren(option)) {
          this.insertSubtitles(option)
        }
      }
    },

    optionHasChildren(selector) {
      return Array.isArray(selector.choices)
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
