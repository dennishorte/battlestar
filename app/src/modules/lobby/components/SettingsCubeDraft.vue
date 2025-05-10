<template>
  <div class="settings-cube-draft">

    <label class="form-label">Cube</label>
    <select class="form-select" v-model="options.cubeId" @change="optionsChanged">
      <option v-for="cube in cubes" :key="cube._id" :value="cube._id">{{ cube.name }}</option>
    </select>

    <label class="form-label">Number of Packs</label>
    <input class="form-control" v-model.number="options.numPacks" @input="optionsChanged" />

    <label class="form-label">Cards per Pack</label>
    <input class="form-control" v-model.number="options.packSize" @input="optionsChanged" />
  </div>
</template>


<script>
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

  methods: {
    async fetchCubes() {
      const response = await this.$post('/api/magic/cube/all')

      this.cubes = response
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

    defaultOptions() {
      return {
        numPacks: 3,
        packSize: 15,
        cubeId: '',
      }
    },
  },

  created() {
    if (!this.lobby.options) {
      // Initialize with default options
      this.options = this.defaultOptions()
      this.lobby.options = this.defaultOptions()
      this.updateValid()
      this.fetchCubes()
    }
    else {
      // Load the saved options into the selected options
      this.options = Object.assign(this.defaultOptions(), this.lobby.options)
      this.optionsChanged()
      this.fetchCubes()
    }
  },
}
</script>
