<template>
  <div class="cube-breakdown-column">

    <div class="column-name">{{ name }} ({{ cardlist.length }})</div>

    <CubeBreakdownSection
      v-for="section in sections"
      :key="section.name"
      :cardlist="section.cards"
      :column-name="name"
      :name="section.name"
      class="column-section"
    />

  </div>
</template>


<script>
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
    cardlist: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },

  computed: {
    sections() {
      if (mag.util.card.COLORS.includes(this.name.toLowerCase()) || this.name.toLowerCase() === 'colorless') {
        const collected = util.array.collect(this.cardlist, card => {
          for (const kind of this.cardTypeSections) {
            if (card.supertypes().includes(kind)) {
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
        const GOLD_SORT_ORDER = [
          'azorius',
          'boros',
          'dimir',
          'golgari',
          'gruul',
          'izzet',
          'orzhov',
          'rakdos',
          'selesnya',
          'simic',
          'abzan',
          'bant',
          'esper',
          'grixis',
          'jeskai',
          'jund',
          'mardu',
          'naya',
          'sultai',
          'temur',
          'non-red',
          'non-green',
          'non-white',
          'non-blue',
          'non-black',
          'five-color',
        ]

        const collected = util.array.collect(this.cardlist, card => {
          return card.colorKey()
        })

        const output = Object
          .entries(collected)
          .map(([name, cards]) => ({ name: mag.util.card.COLOR_KEY_TO_NAME[name], cards }))
          .sort((l, r) => GOLD_SORT_ORDER.indexOf(l.name) - GOLD_SORT_ORDER.indexOf(r.name))

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
