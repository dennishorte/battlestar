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
    <div class="form-check" v-for="map in maps" :key="map.value">
      <input
        class="form-check-input"
        type="radio"
        v-model="models.map"
        :value="map.value"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ map.text }}</label>
    </div>

    <fieldset v-if="models.map" class="map-options">
      <legend>Map Options</legend>
      <template v-if="models.map === 'base'">
        <div v-if="lobby.users.length === 3">
          <small class="text-muted">3-player variant</small>
          <div class="form-check" v-for="variant in base3Variants" :key="variant.value">
            <input
              class="form-check-input"
              type="radio"
              v-model="models.base3Variant"
              :value="variant.value"
              @change="optionsChanged"
            />
            <label class="form-check-label">{{ variant.text }}</label>
          </div>
        </div>
        <div>
          <small class="text-muted">Menzoberranzan</small>
          <div class="form-check">
            <input class="form-check-input"
                   type="checkbox"
                   v-model="models.menzoExtraNeutral"
                   @change="optionsChanged" />
            <label class="form-check-label">extra neutral</label>
          </div>
        </div>
      </template>

      <template v-if="models.map === 'demonweb'">
        <div v-if="lobby.users.length === 2">
          <small class="text-muted">2-player variant</small>
          <div class="form-check" v-for="variant in demonweb2Variants" :key="variant.value">
            <input
              class="form-check-input"
              type="radio"
              v-model="models.demonweb2Variant"
              :value="variant.value"
              @change="optionsChanged"
            />
            <label class="form-check-label">{{ variant.text }}</label>
          </div>
        </div>
        <small class="text-muted">Import map layout</small>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="paste layout string (e.g. demonweb-2:B1r3,C4r0,...)"
          v-model="models.mapLayoutString"
          @input="onMapLayoutInput"
        />
        <small v-if="mapLayoutError" class="text-danger">{{ mapLayoutError }}</small>
        <small v-else-if="models.mapLayout" class="text-success">layout loaded</small>
      </template>
    </fieldset>
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
        { text: 'Demonweb', value: 'demonweb' },
        { text: 'Base', value: 'base' },
      ],

      base3Variants: [
        { text: 'random', value: 'random' },
        { text: '3a', value: 'base-3a' },
        { text: '3b', value: 'base-3b' },
      ],

      demonweb2Variants: [
        { text: 'small (7 hex)', value: 'demonweb-2s' },
        { text: 'large (9 hex)', value: 'demonweb-2' },
      ],

      mapLayoutError: '',

      models: {
        expansions: [],
        map: 'base',
        base3Variant: 'random',
        demonweb2Variant: 'demonweb-2s',
        menzoExtraNeutral: true,
        randomizeExpansions: true,
        mapLayout: null,
        mapLayoutString: '',
      },
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
    updateValid() {
      const mapCondition = !!this.models.map

      // Exactly two expansions must be selected (or randomize is enabled)
      const expansionCondition = this.models.randomizeExpansions || this.models.expansions.length === 2

      this.lobby.valid = mapCondition && expansionCondition
    },

    optionsChanged() {
      this.lobby.options = {
        expansions: this.models.randomizeExpansions ? [] : [...this.models.expansions],
        map: this.models.map,
        base3Variant: this.models.base3Variant,
        demonweb2Variant: this.models.demonweb2Variant,
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

        // Auto-switch map family if needed
        const mapFamily = mapName.startsWith('demonweb') ? 'demonweb' : 'base'
        if (mapFamily !== this.models.map) {
          this.models.map = mapFamily
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
      this.models.randomizeExpansions = Boolean(this.lobby.options.randomizeExpansions)
      if (this.lobby.options.menzoExtraNeutral === undefined) {
        this.models.menzoExtraNeutral = true
      }
      else {
        this.models.menzoExtraNeutral = this.lobby.options.menzoExtraNeutral
      }

      // Handle old specific map names from existing lobbies
      const savedMap = this.lobby.options.map
      if (savedMap && savedMap.startsWith('demonweb-')) {
        this.models.map = 'demonweb'
      }
      else if (savedMap && savedMap.startsWith('base-')) {
        this.models.map = 'base'
        if (savedMap === 'base-3a') {
          this.models.base3Variant = 'base-3a'
        }
        else if (savedMap === 'base-3b') {
          this.models.base3Variant = 'base-3b'
        }
      }
      else {
        this.models.map = savedMap || 'base'
      }

      this.models.base3Variant = this.lobby.options.base3Variant || this.models.base3Variant
      this.models.demonweb2Variant = this.lobby.options.demonweb2Variant || this.models.demonweb2Variant

      if (this.lobby.options.mapLayout) {
        this.models.mapLayout = this.lobby.options.mapLayout
        // Reconstruct the display string from the stored layout
        const { encodeMapLayout } = tyrants.res.mapLayoutCodec
        this.models.mapLayoutString = encodeMapLayout(
          this.lobby.options.map,
          this.models.mapLayout.map(e => ({ tileId: e.tileId, rotation: e.rotation })),
        )
      }

      // Re-save with normalized map name
      this.optionsChanged()
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>

<style scoped>
.map-options {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
}

.map-options legend {
  float: none;
  font-size: 0.8rem;
  color: #6c757d;
  width: auto;
  padding: 0 0.3rem;
  margin-bottom: 0.25rem;
}
</style>
