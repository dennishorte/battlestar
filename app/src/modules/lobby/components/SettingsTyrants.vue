<template>
  <div class="settings-tyrants">

    Expansions (choose 2)

    <div class="form-check" v-for="expansion in expansions" :key="expansion">
      <input
        class="form-check-input"
        type="checkbox"
        :value="models.randomizeExpansions ? false : expansion.value"
        :disabled="models.randomizeExpansions ? true : expansion.disabled"
        v-model="models.expansions"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ expansion.text }}</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.randomizeExpansions"
        @change="optionsChanged"
      />
      <label class="form-check-label">randomize expansions</label>
    </div>

    Map
    <div class="form-check" v-for="map in maps" :key="map">
      <input
        class="form-check-input"
        type="radio"
        v-model="models.map"
        :value="map.value"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ map.text }}</label>
    </div>

    <div v-if="isDemonwebMap" class="map-layout-import">
      <label class="form-label">Import map layout</label>
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="paste layout string (e.g. demonweb-2:B1r3,C4r0,...)"
        v-model="models.mapLayoutString"
        @input="onMapLayoutInput"
      />
      <small v-if="mapLayoutError" class="text-danger">{{ mapLayoutError }}</small>
      <small v-else-if="models.mapLayout" class="text-success">layout loaded</small>
    </div>

    <hr />

    <div class="form-check">
      <input class="form-check-input"
             type="checkbox"
             v-model="models.menzoExtraNeutral"
             @change="optionsChanged" />
      <label class="form-check-label">extra neutral in Menzoberranzan</label>
    </div>
  </div>
</template>


<script>
import { tyrants } from 'battlestar-common'

const { decodeMapLayout, validateMapLayout } = tyrants.res.mapLayoutCodec

export default {
  name: 'TyrantsSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      expansions: [
        {
          text: 'Demons',
          value: 'demons',
          disabled: false
        },
        {
          text: 'Dragons',
          value: 'dragons',
          disabled: false
        },
        {
          text: 'Drow',
          value: 'drow',
          disabled: false
        },
        {
          text: 'Elementals',
          value: 'elementals',
          disabled: false
        },
        {
          text: 'Illithid',
          value: 'illithid',
          disabled: false
        },
        {
          text: 'Undead',
          value: 'undead',
          disabled: false
        },
      ],

      maps: [
        {
          text: 'base-2',
          value: 'base-2',
          disabled: false,
          minPlayers: 2,
          maxPlayers: 2,
        },
        {
          text: 'base-3a',
          value: 'base-3a',
          disabled: true,
          minPlayers: 3,
          maxPlayers: 3,
        },
        {
          text: 'base-3b',
          value: 'base-3b',
          disabled: false,
          minPlayers: 3,
          maxPlayers: 3,
        },
        {
          text: 'base-4',
          value: 'base-4',
          disabled: true,
          minPlayers: 4,
          maxPlayers: 4,
        },
        {
          text: 'demonweb-2',
          value: 'demonweb-2',
          disabled: false,
          minPlayers: 2,
          maxPlayers: 2,
        },
        {
          text: 'demonweb-3',
          value: 'demonweb-3',
          disabled: false,
          minPlayers: 3,
          maxPlayers: 3,
        },
        {
          text: 'demonweb-4',
          value: 'demonweb-4',
          disabled: false,
          minPlayers: 4,
          maxPlayers: 4,
        },
      ],

      mapLayoutError: '',

      models: {
        expansions: [],
        map: '',
        menzoExtraNeutral: true,
        randomizeExpansions: false,
        mapLayout: null,
        mapLayoutString: '',
      },
    }
  },

  computed: {
    isDemonwebMap() {
      return this.models.map && this.models.map.startsWith('demonweb')
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
    updateValid() {
      // Number of players must match map
      const map = this.maps.find(map => map.value === this.models.map)
      const numPlayers = this.lobby.users.length
      const mapAndPlayersCondition = (
        map
        && map.minPlayers <= numPlayers
        && map.maxPlayers >= numPlayers
      )

      // Exactly two expansions must be selected (or randomize is enabled)
      const expansionCondition = this.models.randomizeExpansions || this.models.expansions.length === 2

      this.lobby.valid = mapAndPlayersCondition && expansionCondition
    },

    optionsChanged() {
      this.lobby.options = {
        expansions: this.models.randomizeExpansions ? [] : [...this.models.expansions],
        map: this.models.map,
        mapLayout: this.models.mapLayout || undefined,
        menzoExtraNeutral: this.models.menzoExtraNeutral,
        randomizeExpansions: this.models.randomizeExpansions,
      }
      this.updateValid()
      this.save()
    },

    onMapLayoutInput() {
      const str = this.models.mapLayoutString.trim()
      if (!str) {
        this.models.mapLayout = null
        this.mapLayoutError = ''
        this.optionsChanged()
        return
      }

      try {
        const { mapName, entries } = decodeMapLayout(str)
        const result = validateMapLayout(mapName, entries)
        if (!result.valid) {
          this.mapLayoutError = result.error
          this.models.mapLayout = null
          this.optionsChanged()
          return
        }

        // Auto-switch map if needed
        if (mapName !== this.models.map) {
          this.models.map = mapName
        }

        this.models.mapLayout = entries
        this.mapLayoutError = ''
        this.optionsChanged()
      }
      catch (e) {
        this.mapLayoutError = e.message
        this.models.mapLayout = null
        this.optionsChanged()
      }
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.expansions = [...this.lobby.options.expansions]
      this.models.map = this.lobby.options.map
      this.models.randomizeExpansions = Boolean(this.lobby.options.randomizeExpansions)
      if (this.lobby.options.menzoExtraNeutral === undefined) {
        this.models.menzoExtraNeutral = true
      }
      else {
        this.models.menzoExtraNeutral = this.lobby.options.menzoExtraNeutral
      }
      if (this.lobby.options.mapLayout) {
        this.models.mapLayout = this.lobby.options.mapLayout
        // Reconstruct the display string from the stored layout
        const { encodeMapLayout } = tyrants.res.mapLayoutCodec
        this.models.mapLayoutString = encodeMapLayout(
          this.models.map,
          this.models.mapLayout.map(e => ({ tileId: e.tileId, rotation: e.rotation })),
        )
      }
      this.updateValid()
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>
