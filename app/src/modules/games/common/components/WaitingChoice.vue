<template>
  <div class="waiting-choice">
    <!-- Custom action handler (game-specific, e.g., animal-placement modal) -->
    <template v-if="actionTypeHandler">
      <div class="alert alert-info mt-3">
        <div class="mb-2">{{ actionTypeHandler.message }}</div>
        <button class="btn btn-primary" @click="actionTypeHandler.handler()">
          {{ actionTypeHandler.buttonLabel }}
        </button>
      </div>
    </template>
    <!-- Generic action type (freeform input) -->
    <template v-else-if="isActionType">
      <div class="alert alert-info mt-3">
        <div>This is a special action: {{ request.title }}.</div>
        <div>You cannot use this selector pane for it.</div>
        <div>There should be an alternate UI for performing this action.</div>
      </div>
    </template>
    <!-- Regular selector -->
    <template v-else-if="request">
      <OptionSelector
        :selector="processedRequest"
        :required="true"
        :owner="owner"
        :key="selection.title"
        @selection-changed="childChanged"
      />
      <div class="d-grid">
        <button @click="submitIfValid" :disabled="!isValid" class="btn btn-primary">choose</button>
      </div>
    </template>
  </div>
</template>

<script>
import { selector } from 'battlestar-common'
import OptionSelector from './OptionSelector.vue'

export default {
  name: 'WaitingChoice',

  components: {
    OptionSelector,
  },

  inject: {
    bus: { from: 'bus' },
    game: { from: 'game' },
    ui: { from: 'ui' },
  },

  props: {
    owner: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      selection: {
        title: '',
        selection: []
      },
      processedRequest: null
    }
  },

  computed: {
    request() {
      return this.game.getWaiting(this.owner)
    },
    isValid() {
      return this.request && selector.validate(this.request, this.selection).valid
    },
    isActionType() {
      return this.request && selector.getSelectorType(this.request) === 'action'
    },
    actionTypeHandler() {
      if (this.ui.fn?.getActionTypeHandler && this.request) {
        return this.ui.fn.getActionTypeHandler(this.request)
      }
      return null
    },
  },

  watch: {
    request: {
      immediate: true,
      handler(newRequest) {
        if (newRequest) {
          // Create a deep copy to avoid modifying the original
          this.processedRequest = JSON.parse(JSON.stringify(newRequest))
          this.insertSubtitles(this.processedRequest)

          // Reset selection
          this.selection.title = newRequest.title
          this.selection.selection = []
        }
        else {
          this.processedRequest = null
          this.selection.title = ''
          this.selection.selection = []
        }
      }
    }
  },

  methods: {
    clearSelection() {
      this.selection = {
        title: '',
        selection: [],
      }
    },

    async submitIfValid(options = {}) {
      if (this.isValid) {
        const payload = {
          actor: this.owner.name,
          title: this.request.title,
          selection: this.selection.selection,
        }
        try {
          this.game.respondToInputRequest(payload)
          this.clearSelection()
        }
        catch (e) {
          alert('Error!\nCheck console for details.')
          throw e
        }
        await this.$store.dispatch('game/save')
        if (options && options.callback) {
          await options.callback()
        }
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
      for (const option of selector.choices || []) {
        if (this.optionHasChildren(option)) {
          this.insertSubtitles(option)
        }
      }
    },
    optionHasChildren(selector) {
      return selector && Array.isArray(selector.choices)
    },
  },

  mounted() {
    this.bus.on('click-choose-selected-option', this.submitIfValid)
  },

  beforeUnmount() {
    this.bus.off('click-choose-selected-option', this.submitIfValid)
  }
}
</script>

<style scoped>
.action-title {
  font-weight: bold;
  text-align: center;
}
</style>
