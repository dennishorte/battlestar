<template>
  <div class="pre-game container">

    <div class="row">
      <div class="col">
        <div class="header">
          {{ game.settings.name }} | Pre-Game Deck Selection
        </div>
      </div>
    </div>


    <div class="row">

      <div class="col">
        <GameMenu :disabled="['debug', 'undo']" />

        <div class="players">
          <div v-for="player in game.settings.players">
            {{ player.name }}
          </div>
        </div>

        <MagicFileManager
          class="deck-selector"
          :filelist="deckfiles"
          @selection-changed="selectionChanged"
        />

        <div class="mt-2 d-grid">
          <button class="btn btn-warning" @click="toggleReady" v-if="ready">
            Click to shout: "Wait a minute!"
          </button>
          <button class="btn btn-success" @click="toggleReady" v-else>
            Click to shout: "I am ready!"
          </button>
        </div>
      </div>

      <div class="col">
        <Decklist v-if="activeDeck" :deck="activeDeck" :no-menu="true" />
      </div>

    </div>
  </div>
</template>


<script>
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import Decklist from '@/modules/magic/components/deck/Decklist'
import GameMenu from '@/modules/games/common/components/GameMenu'
import MagicFileManager from '@/modules/magic/components/MagicFileManager'

export default {
  name: 'PreGame',

  components: {
    Decklist,
    GameMenu,
    MagicFileManager,
  },

  inject: ['actor', 'game'],

  data() {
    return {
      activeDeck: null,
      ready: false,
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardLookup: 'lookup',
    }),

    ...mapState('magic/file', {
      filelist: 'filelist',
    }),

    deckfiles() {
      return this.filelist.filter(file => file.kind === 'deck')
    },
  },

  methods: {
    selectionChanged({ newValue }) {
      if (newValue.objectType === 'file') {
        const deck = mag.util.deck.deserialize(newValue.file)
        mag.util.card.lookup.insertCardData(deck.cardlist, this.cardLookup)
        this.activeDeck = deck
      }
    },

    toggleReady() {
      this.ready = !this.ready
    },
  },

  created() {
    this.$store.dispatch('magic/file/fetchAll')
  },
}
</script>


<style scoped>
.deck-selector {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  border-radius: .25em;
  margin-top: .25em;
}

.header {
  color: white;
  background-color: var(--bs-orange);
  text-align: center;
  font-size: 1.2em;
  border-radius: 0 0 .5em .5em;
}
</style>
