<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>

    <div v-else class="cube-draft">
      <div class="game-column log-column">
        <GameMenu />
        <ChatInput />
      </div>

      <div class="game-column data-column">
        <WaitingPanel />
      </div>

      <!-- <div class="game-column">
           <CardSelector />
           </div>
      -->
      <div class="game-column deck-column">
        <Decklist :deck="tempDeck()" />
      </div>

    </div>

    <DebugModal />
  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import mitt from 'mitt'

import { computed } from 'vue'
import { mapState } from 'vuex'

import { mag } from 'battlestar-common'

import CardSelector from './CardSelector'

import ChatInput from '@/modules/games/common/components/ChatInput'
import DebugModal from '@/modules/games/common/components/DebugModal'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import CardListItem from '@/modules/magic/components/CardListItem'
import Decklist from '@/modules/magic/components/deck/Decklist'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'CubeDraft',

  components: {
    CardSelector,
    ChatInput,
    DebugModal,
    Decklist,
    GameMenu,
    MagicWrapper,
    WaitingPanel,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      bus: mitt(),  // Used by WaitingPanel
    }
  },

  computed: {
    ...mapState('magic/cubeDraft', {
      game: 'game',
      gameReady: 'ready',
    }),

    player() {
      return this.game.getPlayerByName(this.actor.name)
    },
  },

  provide() {
    return {
      actor: this.actor,
      do: this.do,
      game: computed(() => this.game),
      save: this.save,

      bus: this.bus,
      ui: this.uiFactory(),
    }
  },

  methods: {
    loadGame() {
      this.$store.dispatch('magic/cubeDraft/loadGame', {
        gameData: this.data,
        doFunc: this.do,
      })
    },

    do(player, action) {
      const request = this.game.getWaiting()
      const selector = request.selectors[0]

      if (player) {
        action.playerName = player.name
      }

      this.game.respondToInputRequest({
        actor: selector.actor,
        title: selector.title,
        selection: [action],
        key: request.key,
      })
    },

    async save() {
      const game = this.game
      const payload = {
        gameId: game._id,
        responses: game.responses,
        chat: game.getChat(),
        waiting: game.waiting,
        gameOver: game.gameOver,
        gameOverData: game.gameOverData,
      }

      const requestResult = await axios.post('/api/game/saveFull', payload)

      if (requestResult.data.status === 'success') {
        console.log('saved')
        this.game.usedUndo = false
      }
      else {
        alert('Save game failed. Try reloading and trying again.\n' + requestResult.data.message)
      }
    },

    tempDeck() {
      const deckData = {
        _id: "temp deck",
        userId: "fake user id",
        name: '__draft_deck__',
        path: '/__draft_decks',
        kind: 'deck',
        createdTimestamp: Date.now(),
        updatedTimestamp: Date.now(),
        cardlist: this
          .game
          .getPicksByPlayer(this.player)
          .map(c => ({
            name: c.name,
            zone: 'main'
          })),

        /* [
         *   {
         *     name: 'ash barrens',
         *     setCode: null,
         *     collectorNumber: null,
         *     zone: 'main'
         *   },
         * ], */
      }

      const deck = mag.util.deck.deserialize(deckData)
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(deck.cardlist, lookupFunc)

      return deck
    },

    uiFactory() {

      const selectorOptionComponent = (option) => {
        const cardId = option.title ? option.title : option
        const card = this.game.getCardById(cardId)

        if (card) {
          return {
            component: CardListItem,
            props: { card, showManaCost: true },
          }
        }
        else {
          return undefined
        }
      }

      return {
        fn: {
          selectorOptionComponent,
        },
      }
    },
  },
}
</script>


<style scoped>
.cube-draft {
  display: flex;
  flex-direction: row;

  width: 100vw;
  height: 100vh;
  font-size: .8rem;
  overflow: scroll;
}

.game-column {
  height: 100vh;
  min-width: 220px;
  max-width: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 3em;
}

.data-column {
  padding: 1em;
}

.log-column {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.deck-column {
  font-size: 1.3em;
}

.game-column:not(:first-of-type) {
  margin-left: .5em;
}
</style>
