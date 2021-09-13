<template>
  <div class="deck-zone">
    <div class="top-row">
      <div
        class="deck-name"
        :class="classes"
        @click="click">
        {{ name }}
        {{ cards.length }}
      </div>

      <b-dropdown right>
        <b-dropdown-item @click="details">
          details
        </b-dropdown-item>

        <b-dropdown-item @click="toggleExpand">
          <span v-if="expand">collapse</span>
          <span v-else>expand</span>
        </b-dropdown-item>

      </b-dropdown>
    </div>

    <div v-if="expand" class="bottom-row">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="expanded-card"
        :class="[
          index === grabbedIndex ? 'grabbed-card' : '',
          grabbed && index !== grabbedIndex ? 'ungrabbed-card' : '',
        ]
        "
        @click="clickCard(index)"
      >
        <div>{{ displayName(card) }}</div>
        <div>{{ displayExtra(card) }}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DeckZone',

  props: {
    name: String,
    deckName: String,

    expanded: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expand: this.expanded,
    }
  },

  computed: {
    cards() {
      return this.deck.cards
    },
    classes() {
      return [
        this.droppable ? 'droppable' : '',
        this.grabbed ? 'grabbed' : '',
      ]
    },
    deck() {
      return this.$store.getters['bsg/zone'](this.deckName)
    },
    droppable() {
      const grabbed = this.$store.getters['bsg/grab']
      return grabbed.source && grabbed.source !== this.deckName
    },
    grabbed() {
      return this.$store.getters['bsg/grab'].source === this.deckName
    },
    grabbedIndex() {
      return this.grabbed ? this.$store.getters['bsg/grab'].index : -1
    },
  },

  methods: {
    click() {
      this.$store.dispatch('bsg/zoneClick', {
        source: this.deckName,
        index: 0,
      })
    },

    clickCard(index) {
      this.$store.dispatch('bsg/zoneClick', {
        source: this.deckName,
        index: index,
      })
    },

    details() {
      this.$store.dispatch('bsg/zoneViewer', this.deckName)
      this.$bvModal.show('zone-modal')
    },

    displayExtra(card) {
      if (!this.$store.getters['bsg/viewerCanSeeCard'](card)) {
        return ''
      }

      if (card.kind === 'skill') {
        return card.value
      }
    },

    displayName(card) {
      return this.$store.getters['bsg/viewerCanSeeCard'](card) ? card.name : card.kind
    },

    toggleExpand() {
      this.expand = !this.expand
    },
  },
}
</script>


<style scoped>
.deck-name {
  align-items: center;
  border: 1px solid darkgray;
  border-radius: .25em;

  font-size: .7em;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: .25em;
}

.deck-zone {
  margin-bottom: .5em;
}

.expanded-card {
  padding: .25em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.expanded-card:not(:first-of-type) {
  border-top: 1px solid darkgray;
}

.top-row {
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1rem;
}

.bottom-row {
  border-bottom: 1px solid darkgray;
  border-left: 1px solid darkgray;
  border-right: 1px solid darkgray;
  border-radius: .25em;
  font-size: .7em;
  min-height: .5em;
}

.droppable {
  background-color: white;
  box-shadow: inset 10px 10px 20px #ccf, inset -10px -10px 20px #ccf;
}

.grabbed {
  background-color: white;
  box-shadow: inset 10px 10px 20px #444, inset -10px -10px 20px #444;
  color: #ddd;
}

.grabbed-card {
  background-color: white;
  box-shadow: inset 5px 5px 20px #444, inset -5px -5px 20px #444;
  color: #ddd;
}

.ungrabbed-card {
  background-color: #444;
}
</style>
