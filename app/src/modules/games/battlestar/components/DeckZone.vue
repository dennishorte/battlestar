<template>
  <div class="deck-zone">
    <div
      class="deck-name"
      :class="classes"
      @click="click">
      {{ name }}
      {{ cards.length }}
    </div>

    <b-dropdown right>
      <b-dropdown-item>
        draw
      </b-dropdown-item>

      <b-dropdown-item>
        shuffle
      </b-dropdown-item>

      <b-dropdown-item>
        peek
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>


<script>
export default {
  name: 'DeckZone',

  props: {
    name: String,
    deckName: String,
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
  },

  methods: {
    click() {
      this.$store.commit('bsg/zoneClick', {
        source: this.deckName,
        sourceIndex: 0,
      })
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
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1rem;
  margin-bottom: .5em;
}

.droppable {
  box-shadow: inset 10px 10px 20px #ccf, inset -10px -10px 20px #ccf;
}

.grabbed {
  box-shadow: inset 10px 10px 20px #444, inset -10px -10px 20px #444;
  color: #ddd;
}
</style>
