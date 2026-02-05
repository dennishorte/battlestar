<template>
  <HexMap v-if="isDemonwebMap" />
  <div v-else class="game-map" :style="mapStyle">
    <CurveLayer :curves="elems.curves" :height="svgHeight" :width="svgWidth" />
    <DivLayer :styledDivs="styledDivs" />
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CurveLayer from '@/modules/mapmaker/components/CurveLayer.vue'
import DivLayer from './DivLayer.vue'
import HexMap from './HexMap.vue'

import maps from '../../res/maps.js'

export default {
  name: 'GameMap',

  components: {
    CurveLayer,
    DivLayer,
    HexMap,
  },

  inject: ['game'],

  data() {
    return {
    }
  },

  computed: {
    isDemonwebMap() {
      return this.mapName && this.mapName.startsWith('demonweb')
    },

    elems() {
      if (this.isDemonwebMap) {
        return { curves: [], divs: [] }
      }
      return maps[this.mapName].elems
    },

    elemMeta() {
      if (this.isDemonwebMap) {
        return { styles: { '.map': { width: '800px', height: '800px' } } }
      }
      return maps[this.mapName].elemMeta
    },

    mapName() {
      return this.game.settings.map
    },

    mapStyle() {
      return this.elemMeta.styles['.map']
    },

    styledDivs() {
      if (this.isDemonwebMap) {
        return []
      }

      const output = this
        .elems
        .divs
        .map(div => {
          const copy = util.deepcopy(div)

          const baseStyle = this.elemMeta.styles['.element'] || {}
          const classStyles = div
            .classes
            .map(cls => this.elemMeta.styles['.' + cls])
            .filter(style => style !== undefined)

          copy.renderStyle = Object.assign({}, baseStyle, ...classStyles, div.style)

          return copy
        })

      return output
    },

    svgHeight() {
      const mapStyle = this.elemMeta.styles['.map']
      return this.parsePx(mapStyle.height)
    },

    svgWidth() {
      const mapStyle = this.elemMeta.styles['.map']
      return this.parsePx(mapStyle.width)
    },
  },

  methods: {
    parsePx(px) {
      return parseInt(px.substr(0, px.length - 2))
    },
  },

}
</script>


<style scoped>
</style>
