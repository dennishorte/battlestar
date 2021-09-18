<template>
  <div class="deck-zone">

    <div class="top-row">

      <Variant :name="variant">
        <div
          class="deck-name"
          :class="classes"
          @click="click"
        >

          {{ name }}
          <template v-if="count !== 'none'">
            {{ cards.length }}
          </template>
        </div>
      </Variant>

      <div v-if="discardable" class="discard" @click="clickDiscard">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </div>

      <div v-else-if="!hideMenu">
        <b-dropdown right>

          <b-dropdown-item
            v-for="opt in fullMenuOptions"
            :key="opt.name"
            @click="opt.func"
          >
            {{ opt.name }}
          </b-dropdown-item>

        </b-dropdown>
      </div>

    </div>

    <div v-if="expand" class="bottom-row">

      <template v-for="(card, index) in cards">
        <div class="expanded-card" :key="card.id">
          <Variant :name="cardVariant(card)">

          <div
            class="expanded-card-inner"
            :class="[
              index === grabbedIndex ? 'grabbed-card' : '',
              grabbed && index !== grabbedIndex ? 'ungrabbed-card' : '',
            ]
            "
            @click="clickCard(index)"
          >
            <div :class="displayClasses(card)">{{ displayName(card) }}</div>
            <div>{{ displayExtra(card) }}</div>
          </div>
        </Variant>
        </div>
      </template>

    </div>

  </div>
</template>


<script>
import Variant from './Variant'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash)


export default {
  name: 'DeckZone',

  components: {
    Variant,
  },

  props: {
    name: String,
    deckName: String,

    expanded: {
      type: Boolean,
      default: false,
    },

    count: {
      type: String,
      default: 'deck',
    },

    hideMenu: {
      type: Boolean,
      default: false,
    },

    menuOptions: {
      type: Array,
      default: function () {
        return []
      },
    },

    variant: {
      type: String,
      default: '',
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
    discard() {
      if (this.discardName) {
        return this.$store.getters['bsg/zone'](this.discardName)
      }
      else {
        return null
      }
    },
    discardName() {
      if (['open', 'hidden'].includes(this.deck.discard)) {
        return this.deckName.replace(/^decks./, 'discard.')
      }
      else {
        return ''
      }
    },
    discardViewable() {
      return !!this.discard && this.discard.kind === 'open'
    },
    discardable() {
      const grabbed = this.$store.getters['bsg/grab']
      return !!grabbed.source && !!this.discard
    },
    droppable() {
      const grabbed = this.$store.getters['bsg/grab']
      return grabbed.source && grabbed.source !== this.deckName
    },
    expandable() {
      return this.deck.kind === 'open'
          || this.deck.kind === 'hand'
    },
    grabbed() {
      return this.$store.getters['bsg/grab'].source === this.deckName
    },
    grabbedIndex() {
      return this.grabbed ? this.$store.getters['bsg/grab'].index : -1
    },
    locationNames() {
      return this.$store.getters['bsg/dataLocations'].map(l => l.name)
    },

    fullMenuOptions() {
      const menu = [
        {
          name: 'details',
          func: this.details,
        },
        {
          name: 'shuffle',
          func: this.shuffle,
        },
      ]

      if (this.expandable) {
        menu.push({
          name: 'expand',
          func: this.toggleExpand
        })
      }

      if (this.discardable) {
        menu.push({
          name: 'view discard',
          func: this.discardDetails,
        })
      }

      for (const opt of this.menuOptions) {
        if (opt.enabled === false) {
          const index = menu.findIndex(m => m.name === opt.name)
          if (index !== 0) {
            menu.splice(index, 1)
          }
        }

        else {
          opt.func = opt.func.bind(this)
          menu.push(opt)
        }
      }

      return menu
    },
  },

  methods: {
    cardVariant(card) {
      if (!this.$store.getters['bsg/visible'](card)) {
        return ''
      }

      if (card.kind === 'skill') {
        return card.deck.split('.').slice(-1)[0]
      }
    },

    click() {
      this.$store.dispatch('bsg/zoneClick', {
        source: this.deckName,
        index: 'top',
      })
    },

    clickCard(index) {
      this.$store.dispatch('bsg/zoneClick', {
        source: this.deckName,
        index: index,
      })
    },

    clickDiscard() {
      this.$store.dispatch('bsg/zoneClick', {
        source: this.discardName,
        index: 'top',
      })
    },

    details() {
      this.$store.dispatch('bsg/zoneViewer', this.deckName)
      this.$bvModal.show('zone-modal')
    },

    discardDetails() {
      this.$store.dispatch('bsg/zoneViewer', this.discardName)
      this.$bvModal.show('zone-modal')
    },

    displayClasses(card) {
      if (this.$store.getters['bsg/viewerCanSeeCard'](card)) {
        return []
      }
      else {
        return ['hidden']
      }
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

    shuffle() {
      this.$store.commit('bsg/zoneShuffle', this.deckName)
    },

    toggleExpand() {
      this.expand = !this.expand
    },

  },
}
</script>


<style scoped>
.wrapper {
  position: relative;
  flex-grow: 1;
  justify-content: stretch;
  display: flex;
}

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
  min-height: 38px;
}

.deck-zone {
  margin-bottom: .5em;
}

.discard {
  min-height: 38px;
  min-width: 35.59px;
  background-color: black;
  color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expanded-card:not(:first-of-type) {
  border-top: 1px solid darkgray;
}

.expanded-card-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: .25em;
}

.hidden {
  color: #777;
  font-style: italic;
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
  box-shadow: inset 5px 5px 10px #ff9, inset -5px -5px 10px #ff9;
}

.grabbed {
  box-shadow: inset 5px 5px 10px #444, inset -5px -5px 10px #444;
}

.grabbed-card {
  box-shadow: inset 3px 3px 8px #444, inset -3px -3px 8px #444;
}

.ungrabbed-card {
  background-color: #444;
}
</style>
