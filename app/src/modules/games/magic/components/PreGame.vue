<template>
  <div class="pre-game container">

    <div class="row">

      <div class="col">
        <GameMenu :disabled="['debug', 'undo']" />

        <MagicFileManager
          class="deck-selector"
          :filelist="deckfiles"
          @selection-changed="selectionChanged"
        />
      </div>

      <div class="col">
        <Decklist v-if="activeDeck" :deck="activeDeck" />
      </div>

    </div>
  </div>
</template>


<script>
import cardUtil from '@/modules/magic/util/cardUtil.js'
import deckUtil from '@/modules/magic/util/deckUtil.js'
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
        const deck = deckUtil.deserialize(newValue.file)
        cardUtil.lookup.insertCardData(deck.cardlist, this.cardLookup)
        console.log(deck)
        this.activeDeck = deck
      }
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
</style>
