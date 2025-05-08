<template>
  <div class="settings-pack-draft">

    <div class="set-picker-div">
      <div class="form-label">Set: {{ selectedSet }}</div>
      <button class="btn btn-secondary" @click="openSetPicker">Open Set Picker</button>
    </div>

    <label class="form-label">Number of Packs</label>
    <input class="form-control" v-model.number="options.numPacks" @change="optionsChanged" />

    <SetPickerModal :id="setPickerModalId" @set-selected="selectSet" />
  </div>
</template>


<script>
import { util } from 'battlestar-common'
import { v4 as uuidv4 } from 'uuid'

import SetPickerModal from '@/modules/magic/components/SetPickerModal'


export default {
  name: 'SetDraftSettings',

  components: {
    SetPickerModal,
  },

  inject: ['lobby', 'save'],

  data() {
    return {
      options: {},

      users: [],

      setPickerModalId: 'set-picker-modal-' + uuidv4(),
    }
  },

  computed: {
    selectedSet() {
      return this.options.set ? this.options.set.name : 'none'
    },
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
    async fetchUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users.sort((l, r) => l.name.localeCompare(r.name))
      this.updateValid()
    },

    // Called by both optionsChanged, and a watcher on users in the lobby.
    updateValid() {
      const opts = this.lobby.options

      const numPlayersCondition = this.lobby.users.length >= 2
      const numPacksCondition = opts.numPacks > 0
      const setSelectedCondition = opts.set && ['expansion', 'core', 'draft_innovation', 'masters'].includes(opts.set.set_type)

      this.lobby.valid = (
        numPlayersCondition
        && numPacksCondition
        && setSelectedCondition
      )
    },

    optionsChanged() {
      this.lobby.options = util.deepcopy(this.options)
      this.updateValid()
      this.save()
    },

    openSetPicker() {
      this.$modal(this.setPickerModalId).show()
    },

    selectSet(sett) {
      this.options.set = {
        name: sett.name,
        code: sett.code,
        set_type: sett.set_type,
      }
      this.optionsChanged()
    },

    defaultOptions() {
      return {
        numPacks: 3,
      }
    },
  },

  created() {
    if (!this.lobby.options) {
      // Initialize with default options
      this.options = this.defaultOptions()
      this.lobby.options = this.defaultOptions()
      this.updateValid()
    }
    else {
      // Load the saved options into the selected options
      this.options = Object.assign(this.defaultOptions(), this.lobby.options)
      this.optionsChanged()
    }

    this.fetchUsers()
  },
}
</script>


<style scoped>
</style>
