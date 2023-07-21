<template>
  <div class="settings-magic">

    <label class="form-label">Format</label>
    <select class="form-select" v-model="format" @change="optionsChanged">
      <option>Constructed</option>
    </select>

  </div>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'MagicSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      format: '',
      linkedDraftId: '',
    }
  },

  watch: {
    'lobby.users': {
      handler() {
        this.updateValid()
      },
      deep: true,
    },
  },

  methods: {
    // Called by both optionsChanged, and a watcher on users in the lobby.
    updateValid() {
      const numPlayersCondition = this.lobby.users.length >= 2
      const formatSelectedCondition = Boolean(this.lobby.options.format)

      this.lobby.valid = (
        numPlayersCondition
        && formatSelectedCondition
      )
    },

    optionsChanged() {
      this.lobby.options.format = this.format
      this.updateValid()
      this.save()
    },
  },

  created() {
    if (!this.lobby.options) {
      this.format = ''
      this.lobby.options = {}
      this.updateValid()
    }
    else {
      this.format = this.lobby.options.format || ''
      this.optionsChanged()
    }
  },
}
</script>
