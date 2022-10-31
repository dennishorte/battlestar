<template>
  <div class="waiting-choice">

    <OptionSelector
      :key="key"
      :selector="request"
      :required="true"
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

  inject: ['game', 'ui', 'bus'],

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
}
</script>


<style scoped>
.action-title {
  font-weight: bold;
  text-align: center;
}
</style>
