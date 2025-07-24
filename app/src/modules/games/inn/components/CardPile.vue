<template>
  <div class="card-pile" @click="openCardsViewerModal">
    <div class="card-pile-header">
      {{ headerComputed }}
    </div>

    <div v-if="expanded">
      <CardFull
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>

    <div v-else class="card-pile-list">
      <CardSquare
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />

      <slot/>

    </div>
  </div>
</template>

<script>
import CardFull from './CardFull'
import CardSquare from './CardSquare'

const orderedExpansions = ['base', 'echo', 'figs', 'city', 'arti']

export default {
  name: 'CardPile',

  components: {
    CardFull,
    CardSquare,
  },

  inject: ['game', 'actor'],

  props: {
    expanded: {
      type: Boolean,
      default: false,
    },

    header: {
      type: Function,
      default: null,
    },

    zone: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      showDetails: this.expanded,
    }
  },

  computed: {
    canView() {
      if (this.zone.kind === 'achievements') {
        return false
      }

      if (this.zone.kind === 'public') {
        return true
      }

      const owner = this.game.players.byZone(this.zone)
      return owner && owner.name === this.actor.name
    },

    cards() {
      return this.zone.cardlist().sort((l, r) => {
        if (l.age === r.age) {
          return orderedExpansions.indexOf(l.expansion) - orderedExpansions.indexOf(r.expansion)
        }
        else {
          return l.age - r.age
        }
      })
    },

    headerComputed() {
      if (this.header) {
        return this.header()
      }
      else {
        return this.zone.name.split('.').slice(-1)[0]
      }
    },
  },

  methods: {
    openCardsViewerModal() {
      if (this.canView) {
        this.game.ui.modals.cardsViewer.title = this.zone.name
        this.game.ui.modals.cardsViewer.cards = this.zone.cardlist()
        this.$modal('cards-viewer-modal').show()
      }
    },
  },
}
</script>

<style scoped>
.card-pile-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1px;
}


.card-pile-header {
  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: .25rem;
  padding-left: .25rem;
  border-top: 1px solid #7d6c50;
  border-right: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  background-color: #bba37a;
  max-width: 284px;
}
</style>
