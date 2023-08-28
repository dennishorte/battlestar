<template>
  <div class="waiting-choice">

    <OptionSelector
      :key="key"
      :selector="request"
      :required="true"
      :owner="owner"
      @selection-changed="childChanged"
    />

    <div class="d-grid">
      <button @click="submit" :disabled="!isValid" class="btn btn-primary">choose</button>
    </div>

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

  inject: ['game', 'ui', 'bus', 'save'],

  inject: {
    bus: { from: 'bus' },
    game: { from: 'game' },
    ui: { from: 'ui' },

    save: {
      from: 'save',
      default: null,
    },
  },

  props: {
    owner: Object,
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
      const waiting = this.game.getWaiting(this.owner)
      this.insertSubtitles(waiting)
      return waiting
    },

    isValid() {
      return selector.validate(this.request, this.selection).valid
    },
  },

  watch: {
    request() {
      if (this.request) {
        this.selection.title = this.request.title
      }
      else {
        this.selection.title = ''
      }
      this.selection.selection = []
    },
  },

  methods: {
    async submit(extraPayload={}) {
      const payload = {
        actor: this.owner.name,
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

      if (this.save) {
        await this.save()
      }
      else if (this.game.save) {
        await this.game.save()
      }
      else {
        alert('No save function provided')
      }
    },

    submitIfValid() {
      if (this.isValid) {
        this.submit()
      }
    },

    childChanged(event) {
      this.selection = event
      this.bus.emit('waiting-selection-changed', [...this.selection.selection])
    },

    insertSubtitles(selector) {
      if (!selector) {
        return
      }

      if (this.ui.fn.insertSelectorSubtitles) {
        this.ui.fn.insertSelectorSubtitles(selector)
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

  mounted() {
    this.bus.on('click-choose-selected-option', this.submitIfValid)
  },
}
</script>


<style scoped>
.action-title {
  font-weight: bold;
  text-align: center;
}
</style>
