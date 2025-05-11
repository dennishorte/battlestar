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

export default {
  name: 'TyrantsCardSet',

  components: {
    GameCard,
  },

  props: {
    expansion: String,
  },

  computed: {
    cards() {
      return tyrants.res.cards.byExpansion[this.expansion]
    },
  },
}
</script>
