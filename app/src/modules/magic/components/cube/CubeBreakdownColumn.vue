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
import cardUtil from '../../util/cardUtil.js'
import { util } from 'battlestar-common'

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
      if (cardUtil.COLORS.includes(this.name.toLowerCase())) {
        const collected = util.array.collect(this.cardlist, card => {
          const superTypes = cardUtil.supertypes(card)
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

      else {
        return [{
          name: 'section',
          cards: this.cardlist,
        }]
      }
    },
  },
}
</script>


<style scoped>
.cube-breakdown-column {
  display: flex;
  flex-direction: column;
  min-width: 125px;
  max-width: 200px;
}

.column-name {
  text-align: center;
  text-transform: capitalize;
}

.column-section {
  margin-top: .25em;
}
</style>
