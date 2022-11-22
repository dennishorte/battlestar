<template>
  <div class="settings-innovation">

    <label class="form-label">Format</label>
    <select class="form-select" v-model="format">
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
      this.lobby.valid = (
        this.lobby.users.length === 2
        && Boolean(this.format)
      )
    },

    optionsChanged() {
      this.updateValid()
      this.save()
    },
  },

  created() {
    if (!this.lobby.options) {
      this.updateValid()
      this.format = this.lobby.options.format || ''
    }
    else {
      this.lobby.options = {
        format: 'Constructed',
      }
      this.format = this.lobby.options.format || ''
      this.optionsChanged()
    }
  },
}
</script>
