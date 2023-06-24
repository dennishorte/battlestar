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
import axios from 'axios'
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
      const userRequestResult = await axios.post('/api/user/all')
      this.users = userRequestResult
        .data
        .users
        .sort((l, r) => l.name.localeCompare(r.name))
      this.updateValid()
    },

    // Called by both optionsChanged, and a watcher on users in the lobby.
    updateValid() {
      const opts = this.lobby.options

      const numPlayersCondition = this.lobby.users.length >= 2
      const numPacksCondition = opts.numPacks > 0
      const setSelectedCondition = opts.set && ['expansion', 'core', 'draft_innovation'].includes(opts.set.set_type)

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

    makePacks(lobby) {
      const pack = this.packs.find(c => c._id === this.options.packId)
      const cards = util
        .deepcopy(pack.cardlist)
        .map((card, index) => ({
          id: card.name + `(${index})`,
          name: card.name
        }))
      util.array.shuffle(cards)

      const packs = util.array.chunk(cards, this.lobby.options.packSize)
      const totalPacks = this.lobby.users.length * this.lobby.options.numPacks
      lobby.packs = packs.slice(0, totalPacks)

      lobby.options.packName = pack.name
    },

    openSetPicker() {
      this.$modal(this.setPickerModalId).show()
    },

    selectSet(sett) {
      this.options.set = sett
      this.optionsChanged()
    },

    defaultOptions() {
      return {
        numPacks: 3,
      }
    },
  },

  created() {
    this.lobby.onStart = this.makePacks

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
