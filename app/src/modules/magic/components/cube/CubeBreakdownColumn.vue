<template>
  <div class="cube-breakdown-column">

    <div class="column-name">{{ name }} ({{ cardlist.length }})</div>

    <CubeBreakdownSection
      v-for="section in sections"
      :cardlist="section.cards"
      :column-name="name"
      :name="section.name"
      class="column-section"
    />

  </div>
</template>


<script>
import cubeUtil from '../../util/cubeUtil.js'
import { mag, util } from 'battlestar-common'

import CubeBreakdownSection from './CubeBreakdownSection'


export default {
  name: 'CubeBreakdownColumn',

  components: {
    CubeBreakdownSection,
  },

  data() {
    return {
      cardTypeSections: [
        'creature',
        'planeswalker',
        'sorcery',
        'instant',
        'artifact',
        'enchantment',
        'battle',
        'other',
      ],
    }
  },

  props: {
    cardlist: Array,
    name: String,
  },

  computed: {
    sections() {
      if (mag.util.card.COLORS.includes(this.name.toLowerCase()) || this.name.toLowerCase() === 'colorless') {
        const collected = util.array.collect(this.cardlist, card => {
          const superTypes = mag.util.card.supertypes(card.data.card_faces[0])
          for (const kind of this.cardTypeSections) {
            if (superTypes.includes(kind)) {
              return kind
            }
          }
          return 'other'
        })
        const output = Object
          .entries(collected)
          .map(([name, cards]) => ({ name, cards }))
          .sort((l, r) => this.cardTypeSections.indexOf(l.name) - this.cardTypeSections.indexOf(r.name))
        return output
      }

      else if (this.name.toLowerCase() === 'land') {
        return [{
          name: 'land',
          cards: this.cardlist,
        }]
      }

      else if (this.name.toLowerCase() === 'multicolor') {
        const collected = util.array.collect(this.cardlist, card => {
          return mag.util.card.colorKey(mag.util.card.identity(card))
        })

        const output = Object
          .entries(collected)
          .map(([name, cards]) => ({ name: mag.util.card.COLOR_KEY_TO_NAME[name], cards }))
          .sort((l, r) => cubeUtil.GOLD_SORT_ORDER.indexOf(l.name) - cubeUtil.GOLD_SORT_ORDER.indexOf(r.name))

          return output
      }

            else {
              throw new Error('Unhandled cube classification: ' + this.name)
            }
    },
  },
}
</script>


<style scoped>
.cube-breakdown-column {
  display: flex;
  flex-direction: column;
  min-width: 12%;
  max-width: 12%;
}

.column-name {
  text-align: center;
  text-transform: capitalize;
}

.column-section {
  margin-top: .25em;
}
</style>
