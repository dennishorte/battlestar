<template>
  <div class="deck-zone">
    <div class="top-row">
      <div
        class="wrapper"
        @click="click"
      >

        <div
          class="deck-name"
          :class="classes"
          :style="variantForeground(variant)"
        >

          {{ name }}
          {{ cards.length }}

        </div>
        <div :style="variantBackground(variant)"></div>
      </div>

      <div v-if="discardable" class="discard" @click="clickDiscard">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </div>

      <div v-else>
        <b-dropdown right>
          <b-dropdown-item @click="details">
            details
          </b-dropdown-item>

          <b-dropdown-item @click="discardDetails">
            discard
          </b-dropdown-item>

          <b-dropdown-item @click="toggleExpand">
            <span v-if="expand">collapse</span>
            <span v-else>expand</span>
          </b-dropdown-item>

          <b-dropdown-item @click="shuffle">
            shuffle
          </b-dropdown-item>

        </b-dropdown>
      </div>
    </div>

    <div v-if="expand" class="bottom-row">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="expanded-card wrapper"
        :class="[
          index === grabbedIndex ? 'grabbed-card' : '',
          grabbed && index !== grabbedIndex ? 'ungrabbed-card' : '',
        ]
        "
        @click="clickCard(index)"
      >
        <div :class="displayClasses(card)">{{ displayName(card) }}</div>
        <div>{{ displayExtra(card) }}</div>
        <div :style="variantCardBackground(card)"></div>
      </div>
    </div>
  </div>
</template>


<script>
import variants from '../lib/variants.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash)


export default {
  name: 'DeckZone',

  props: {
    name: String,
    deckName: String,

    expanded: {
      type: Boolean,
      default: false,
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
    discardName() {
      if (['open', 'hidden'].includes(this.deck.discard)) {
        return this.deckName.replace(/^decks./, 'discard.')
      }
      else {
        return ''
      }
    },
    discard() {
      if (this.discardName) {
        return this.$store.getters['bsg/zone'](this.discardName)
      }
      else {
        return null
      }
    },
    discardable() {
      const grabbed = this.$store.getters['bsg/grab']
      return !!grabbed.source && !!this.discard
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
    locationNames() {
      return this.$store.getters['bsg/dataLocations'].map(l => l.name)
    },
  },

  methods: {
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

    variantCardBackground(card) {
      if (!this.$store.getters['bsg/visible'](card)) {
        return {}
      }

      if (card.kind === 'skill') {
        const skillType = card.deck.split('.').slice(-1)[0]
        return this.variantBackground(skillType)
      }
    },

    variantBackground(name) {
      const backgroundImage = variants.fetch(name).bgImage
      const overlayColor = variants.fetch(name).bgColor

      if (backgroundImage || overlayColor) {
        const style ={
          zIndex: -1,
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }

        if (backgroundImage) {
          style.backgroundImage = `url(${backgroundImage})`
        }
        if (overlayColor) {
          style.boxShadow = `inset 0 0 0 500px ${overlayColor}`
        }

        return style
      }
      else {
        return {}
      }
    },

    variantForeground(name) {
      if (variants.fetch(name)) {
        return {
          color: variants.fetch(name).fgColor
        }
      }
      else {
        return {}
      }
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

.expanded-card {
  padding: .25em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.expanded-card:not(:first-of-type) {
  border-top: 1px solid darkgray;
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
