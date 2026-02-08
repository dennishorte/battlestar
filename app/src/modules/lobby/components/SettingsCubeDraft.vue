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

    <label class="form-label">Scar Rounds</label>
    <input class="form-control" v-model="options.scarRounds" @input="optionsChanged" />

    <div v-if="scarInfo" class="scar-info mt-2">
      <small :class="scarInfo.sufficient ? 'text-muted' : 'text-danger'">
        Scars needed: {{ scarInfo.needed }} / Available: {{ scarInfo.available }}
      </small>
    </div>

    <BAlert :model-value="warnings.length > 0" variant="danger">
      <div v-for="warning in warnings" :key="warning">
        {{ warning }}
      </div>
    </BAlert>
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
      warnings: [],
    }
  },

  computed: {
    scarInfo() {
      const opts = this.lobby.options
      const selectedCube = this.cubes.find(c => c._id === opts?.cubeId)
      const scarRounds = _parseScarRounds(opts?.scarRounds)

      if (!selectedCube || scarRounds.length === 0) {
        return null
      }

      const needed = scarRounds.length * this.lobby.users.length * 2
      const available = selectedCube.scarlist.filter(s => !s.appliedAt).length

      return {
        needed,
        available,
        sufficient: available >= needed,
      }
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
      const selectedCube = this.cubes.find(c => c._id === opts.cubeId)
      const scarRounds = _parseScarRounds(opts.scarRounds)

      const numPlayersCondition = {
        value: () => this.lobby.users.length >= 2,
        message: 'At least two players are required',
      }
      const numPacksCondition = {
        value: () => opts.numPacks > 0,
        message: 'Packs must be greater than zero',
      }
      const packSizeCondition = {
        value: () => opts.packSize > 0,
        message: 'Pack size must be greater than zero',
      }
      const cubeSelectedCondition = {
        value: () => Boolean(opts.cubeId),
        message: 'A cube must be selected',
      }


      const sufficientCardsCondition = {
        value: () => {
          const neededCards = this.lobby.users.length * opts.numPacks * opts.packSize
          const availableCards = selectedCube ? selectedCube.cardlist.length : 0
          return neededCards <= availableCards
        },
        message: 'Not enough cards in the cube'
      }

      const sufficientScarsCondition = {
        value: () => {
          const neededScars = scarRounds.length * this.lobby.users.length * 2
          const unusedScars = selectedCube ? selectedCube.scarlist.filter(s => !s.appliedAt).length : 0
          return unusedScars >= neededScars
        },
        message: 'Not enough unused scars in the cube'
      }
      const scarRoundsCondition = {
        value: () => _validateScarRounds(scarRounds, opts.numPacks),
        message: 'Invalid scar rounds',
      }

      const conditions = [
        numPlayersCondition,
        numPacksCondition,
        packSizeCondition,
        cubeSelectedCondition,
        scarRoundsCondition,
        sufficientScarsCondition,
        sufficientCardsCondition,
      ]

      this.lobby.valid = conditions.every(c => c.value())
      this.warnings = conditions.filter(c => !c.value()).map(c => c.message)
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

function _parseScarRounds(str) {
  if (!str) {
    return []
  }

  str = str.trim()
  if (str.length === 0) {
    return []
  }

  return str.split(',').filter(t => t.trim().length > 0).map(x => parseInt(x))
}

function _validateScarRounds(rounds, numPacks) {
  for (const round of rounds) {
    if (Number.isNaN(round)) {
      return false
    }
    if (round <= 0) {
      return false
    }
    if (round > numPacks) {
      return false
    }
  }

  return true
}
</script>
