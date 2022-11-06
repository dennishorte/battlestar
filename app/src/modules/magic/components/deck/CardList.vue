<template>
  <div class="card-list">
    <div v-for="name in cardNames" :key="name" class="game-card" @click="highlightCard(name)">
      {{ name }}
    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { mapState } from 'vuex'
import { util } from 'battlestar-common'


const numberFields = ['cmc', 'power', 'toughness', 'loyalty']
const textFields = ['name', 'text', 'flavor', 'type']
const fieldMapping = {
  cmc: 'cmc',
  name: 'name',
  text: 'oracle_text',
  flavor: 'flavor_text',
  type: 'type_line',
  power: 'power',
  toughness: 'toughness',
  loyalty: 'loyalty',
  colors: 'colors',
  identity: 'color_identity',
}
const colorNameToSymbol = {
  white: 'W',
  blue: 'U',
  black: 'B',
  red: 'R',
  green: 'G',
}

export default {
  name: 'CardList',

  data() {
    return {
      filters: [],
    }
  },

  computed: {
    ...mapState('magic/dm', {
      allcards: state => state.cardDatabase.cards,
    }),

    cardsFiltered() {
      if (this.filters.length === 0) {
        return this.allcards
      }

      return this
        .allcards
        .filter(card => this.filters.every(filter => {
          if (filter.kind === 'legality' && 'legalities' in card) {
            return card.legalities[filter.value] === 'legal'
          }
          else if (filter.kind === 'colors' || filter.kind === 'identity') {
            const fieldKey = fieldMapping[filter.kind]
            const fieldValue = fieldKey in card ? card[fieldKey] : []
            const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
              .map(color => filter[color] ? colorNameToSymbol[color] : undefined)
              .filter(symbol => symbol !== undefined)
              .map(symbol => fieldValue.includes(symbol))

            if (filter.or) {
              if (filter.only) {
                return (
                  targetValueMatches.some(x => x)
                  && fieldValue.length === targetValueMatches.filter(x => x).length
                )
              }
              else {
                return targetValueMatches.some(x => x)
              }
            }
            else {  // and
              if (filter.only) {
                return (
                  targetValueMatches.every(x => x)
                  && fieldValue.length === targetValueMatches.length
                )
              }
              else {
                return targetValueMatches.every(x => x)
              }
            }
          }
          else if (textFields.includes(filter.kind)) {
            const fieldKey = fieldMapping[filter.kind]
            const fieldValue = fieldKey in card ? card[fieldKey].toLowerCase() : ''
            const targetValue = filter.value.toLowerCase()

            if (filter.operator === 'and') {
              return fieldValue.includes(targetValue)
            }
            else if (filter.operator === 'not') {
              return !fieldValue.includes(targetValue)
            }
            else {
              throw new Error(`Unhandled string operator: ${filter.operator}`)
            }
          }
          else if (numberFields.includes(filter.kind)) {
            const fieldKey = fieldMapping[filter.kind]
            const fieldValue = fieldKey in card ? parseFloat(card[fieldKey]) : -999
            const targetValue = parseFloat(filter.value)

            if (fieldValue === -999) {
              return false
            }
            else if (filter.operator === '=') {
              return fieldValue === targetValue
            }
            else if (filter.operator === '>=') {
              return fieldValue >= targetValue
            }
            else if (filter.operator === '<=') {
              return fieldValue <= targetValue
            }
            else {
              throw new Error(`Unhandled numeric operator: ${filter.operator}`)
            }
          }
          else {
            throw new Error(`Unhandled filter field: ${filter.kind}`)
          }

          return false
        }))
    },

    cardNames() {
      return util.array.distinct(this.cardsFiltered.map(c => c.name)).sort().slice(0,1000)
    },
  },

  methods: {
    applyFilters(filters) {
      this.filters = filters
    },

    highlightCard(name) {
      const card = this.cardsFiltered.find(c => c.name === name)
      this.$store.dispatch('magic/dm/manageCard', card)
    },
  },
}
</script>


<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  font-size: .8em;
  max-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.game-card {
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
}
</style>
