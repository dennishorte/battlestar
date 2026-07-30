<template>
  <div class="card-set">
    {{ expansion }}

    <GameCard v-for="(card, index) in cards"
              :key="card.id || index"
              :card="card"
              :expandedIn="true"
              :showCost="true" />
  </div>
</template>


<script>
import { tyrants } from 'battlestar-common'
import GameCard from '@/modules/games/tyrants/components/GameCard.vue'

const cardData = tyrants.res.cards.factory(null)

export default {
  name: 'TyrantsCardSet',

  components: {
    GameCard,
  },

  props: {
    expansion: {
      type: String,
      default: 'base'
    },
  },

  computed: {
    cards() {
      return cardData.byExpansion[this.expansion] || []
    },
  },
}
</script>
