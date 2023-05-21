<template>
  <div class="settings-cube-draft">

    <label class="form-label">Cube Owner</label>
    <select class="form-select" v-model="options.cubeOwnerId" @change="ownerChanged">
      <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
    </select>

    <label class="form-label">Cube</label>
    <select class="form-select" v-model="options.cubeId" @change="optionsChanged">
      <option v-for="cube in cubes" :key="cube._id" :value="cube._id">{{ cube.name }}</option>
    </select>

    <label class="form-label">Number of Packs</label>
    <input class="form-control" v-model.number="options.numPacks" @change="optionsChanged" />

    <label class="form-label">Cards per Pack</label>
    <input class="form-control" v-model.number="options.packSize" @change="optionsChanged" />

  </div>
</template>


<script>
import axios from 'axios'
import { util } from 'battlestar-common'


export default {
  name: 'CubeDraftSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      options: {},

      cubes: [],
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

    async fetchCubesForUser(userId) {
      const cubeRequestResult = await axios.post('/api/user/magic/cubes', { userId })
      this.cubes = cubeRequestResult
        .data
        .cubes
        .sort((l, r) => l.name.localeCompare(r.name))
      this.updateValid()
    },

    // Called by both optionsChanged, and a watcher on users in the lobby.
    updateValid() {
      const opts = this.lobby.options

      const numPlayersCondition = this.lobby.users.length >= 2
      const numPacksCondition = opts.numPacks > 0
      const packSizeCondition = opts.packSize > 0
      const cubeSelectedCondition = Boolean(opts.cubeId)

      const neededCards = this.lobby.users.length * opts.numPacks * opts.packSize
      const selectedCube = this.cubes.find(c => c._id === opts.cubeId)
      const availableCards = selectedCube ? selectedCube.cardlist.length : 0
      const sufficientCardsCondition = neededCards <= availableCards

      this.lobby.valid = (
        numPlayersCondition
        && numPacksCondition
        && packSizeCondition
        && cubeSelectedCondition
        && sufficientCardsCondition
      )
    },

    optionsChanged() {
      this.lobby.options = util.deepcopy(this.options)
      this.updateValid()
      this.save()
    },

    ownerChanged() {
      this.options.cubeId = ''
      this.optionsChanged()
      this.fetchCubesForUser(this.options.cubeOwnerId)
    },

    makePacks(lobby) {
      const cube = this.cubes.find(c => c._id === this.options.cubeId)
      const cards = util
        .deepcopy(cube.cardlist)
        .map((card, index) => ({
          id: card.name + `(${index})`,
          name: card.name
        }))
      util.array.shuffle(cards)

      const packs = util.array.chunk(cards, this.lobby.options.packSize)
      const totalPacks = this.lobby.users.length * this.lobby.options.numPacks
      lobby.packs = packs.slice(0, totalPacks)
    },

    defaultOptions() {
      return {
        numPacks: 3,
        packSize: 15,
        cubeOwnerId: '',
        cubeId: ''
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
      if (this.options.cubeOwnerId) {
        this.fetchCubesForUser(this.options.cubeOwnerId)
      }
    }

    this.fetchUsers()
  },
}
</script>
