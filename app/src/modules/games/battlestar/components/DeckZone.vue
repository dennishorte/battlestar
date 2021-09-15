<template>
  <div class="deck-zone">
    <div class="top-row">
      <div
        class="wrapper"
        @click="click"
      >

        <div
          class="deck-name"
          :style="styles()"
          :class="classes"
        >

          {{ name }}
          {{ cards.length }}

        </div>
        <div :style="overlayColor()"></div>
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
        <div :class="displayClasses(card)">{{ displayName(card) }}</div>
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

    backgroundImage: {
      type: String,
      default: '',
    },

    fontColor: {
      type: String,
      default: '',  // Can be any valid CSS color definition
    },

    overlay: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      expand: this.expanded,

      colors: {
        politics: '#fff90050',
        leadership: '#19782150',
        tactics: '#9a06c750',
        piloting: '#f00e0250',
        engineering: '#042fbd50',
        treachery: '#e8b86f50',
      },

      images: {
        concrete_seamless: require('../assets/images/concrete_seamless.png'),
        first_aid_kit: require('../assets/images/first_aid_kit.png'),
        space: require('../assets/images/space.jpg'),
      },
    }
  },

  mounted() {
    console.log(this.images)
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
    overlayColor() {
      if (this.overlay) {
        return {
          backgroundColor: this.colors[this.overlay],
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }
      }
      else {
        return {}
      }
    },

    styles() {
      const style = {}

      if (this.backgroundImage) {
        style.backgroundImage = `url(${this.images[this.backgroundImage]})`
        style.objectFit = 'cover'
      }

      if (this.fontColor) {
        style.color = this.fontColor
      }

      return style
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

    details() {
      this.$store.dispatch('bsg/zoneViewer', this.deckName)
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
  background-color: white;

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
