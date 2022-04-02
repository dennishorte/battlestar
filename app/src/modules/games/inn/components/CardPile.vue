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

      <CardBiscuit v-for="(extra, index) in extras()" :key="index" :biscuit="extra" />
    </div>
  </div>
</template>

<script>
import CardFull from './CardFull'
import CardSquare from './CardSquare'
import CardBiscuit from './CardBiscuit'

const orderedExpansions = ['base', 'echo', 'figs', 'city', 'arti']

export default {
  name: 'CardPile',

  components: {
    CardFull,
    CardSquare,
    CardBiscuit,
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

    extras: {
      type: Function,
      default: () => [],
    },

    zone: Object,
  },

  data() {
    return {
      showDetails: this.expanded,
    }
  },

  computed: {
    canView() {
      const owner = this.game.getPlayerByZone(this.zone)
      return this.zone.public || owner.name === this.actor.name
    },

    cards() {
      return this.zone.cards().sort((l, r) => {
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
        this.game.ui.modals.cardsViewer.cards = this.zone.cards()
        this.$bvModal.show('cards-viewer-modal')
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
