<template>
  <div class="settings-pack-draft">

    <label class="form-label">Set</label>
    <select class="form-select" v-model="options.setId" @change="optionsChanged">
      <option v-for="set in sets" :key="set.short_name" :value="set.short_name">{{ set.name }}</option>
    </select>

    <label class="form-label">Number of Packs</label>
    <input class="form-control" v-model.number="options.numPacks" @change="optionsChanged" />

  </div>
</template>


<script>
import axios from 'axios'
import { util } from 'battlestar-common'


export default {
  name: 'SetDraftSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      options: {},

      users: [],
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

  computed: {

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

      this.lobby.valid = (
        numPlayersCondition
        && numPacksCondition
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
