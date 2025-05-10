<template>
  <div class="cube-breakdown-section">

    <div class="section-name">{{ name }} ({{ cardlist.length }})</div>

    <div class="section-cards" :class="columnName">
      <template v-for="elem in sortedCardlist">
        <CubeBreakdownManaCostDivider v-if="elem.isDivider" :cost="elem.cost" />
        <CardListItem v-else
                      :card="elem"
                      class="section-card"
                      @click="cardClicked(elem)" />
      </template>
    </div>

  </div>
</template>


<script>
import CardListItem from '../CardListItem'
import CubeBreakdownManaCostDivider from './CubeBreakdownManaCostDivider'


export default {
  name: 'CubeBreakdownSection',

  components: {
    CardListItem,
    CubeBreakdownManaCostDivider,
  },

  props: {
    cardlist: Array,
    columnName: String,
    name: String,
  },

  inject: ['bus'],

  computed: {
    sortedCardlist() {
      const sortedCards = this.cardlist.sort((l, r) => {
        return (
          l.cmc() - r.cmc()
          || l.data.name.localeCompare(r.data.name)
        )
      })

      let manaCost = -1
      const output = []

      for (const card of sortedCards) {
        const cmc = Math.ceil(card.cmc())

        if (cmc !== manaCost) {
          output.push({
            isDivider: true,
            cost: cmc,
          })
          manaCost = cmc
        }
        output.push(card)
      }

      return output
    }
  },

  methods: {
    cardClicked(card) {
      this.bus.emit('card-clicked', card)
    },
  },
}
</script>


<style lang="scss" scoped>
$card-white: #ffffeb;
$card-blue: #d4edff;
$card-black: #d6cbd6;
$card-red: #fec8c8;
$card-green: #e9ffd4;
$card-multicolor: #fcf8a9;
$card-colorless: #e9e7eb;
$card-land: #ffe0c0;
$table-header: #f8f9fa;

.cube-breakdown-section {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
}

.section-card {
  margin: 2px 0;
}

.section-cards {
  font-size: .75em;
  width: 100%;
  overflow: hidden;
  padding: 0 .25em;
}

.section-cards.white {
  background-color: $card-white;
}
.section-cards.blue {
  background-color: $card-blue;
}
.section-cards.black {
  background-color: $card-black;
}
.section-cards.red {
  background-color: $card-red;
}
.section-cards.green {
  background-color: $card-green;
}
.section-cards.colorless {
  background-color: $card-colorless;
}
.section-cards.land {
  background-color: $card-land;
}
.section-cards.multicolor {
  background-color: $card-multicolor;
}

.section-name {
  text-align: center;
  background-color: $table-header;
  text-transform: capitalize;
}
</style>
