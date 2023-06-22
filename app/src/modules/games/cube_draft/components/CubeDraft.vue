<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>

    <div v-else class="cube-draft">
      <div class="game-column log-column">
        <GameMenu />
        <GameLog />
        <ChatInput />
      </div>

      <div class="game-column data-column" :class="widthClass" v-if="tableauCards.length > 0 || showWaitingPanel">
        <CardTableau
          :cards="tableauCards"
          :cardScroll="false"
          @card-clicked="showDraftModal"
        />
        <WaitingPanel :class="waitingPanelClasses" />
      </div>

      <div class="game-column deck-column">
        <Decklist v-if="activeDeck" :deck="activeDeck" @card-clicked="swapCardZone">
          <template #menu-options>
            <DropdownRouterLink to="/magic/decks">deck manager</DropdownRouterLink>
          </template>
        </Decklist>
      </div>

      <div class="game-column info-column">
        <SeatingInfo />
        <AdminOptions />
      </div>

    </div>

    <DebugModal />
  </MagicWrapper>

  <CardCloseupModal :id="cardCloseupModalId" :cardData="closeupCardData" />
  <CardDraftModal :id="cardDraftModalId" :card="closeupDraftCard" @draft-card="chooseCard" />
  <CardTableauModal :id="cardTableauModalId" :cards="tableauCards" title="Card Tableau" />
</template>


<script>
import axios from 'axios'
import mitt from 'mitt'
import { v4 as uuidv4 } from 'uuid'

import { computed, nextTick } from 'vue'
import { mapState } from 'vuex'

import { mag } from 'battlestar-common'

import AdminOptions from './AdminOptions'
import CardCloseupModal from './CardCloseupModal'
import CardDraftModal from './CardDraftModal'
import CardTableau from './CardTableau'
import CardTableauModal from './CardTableauModal'
import GameLog from './log/GameLog'
import SeatingInfo from './SeatingInfo'

import DropdownButton from '@/components/DropdownButton'
import DropdownRouterLink from '@/components/DropdownRouterLink'

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
    AdminOptions,
    CardCloseupModal,
    CardDraftModal,
    CardTableau,
    CardTableauModal,
    ChatInput,
    DebugModal,
    Decklist,
    DropdownButton,
    DropdownRouterLink,
    GameLog,
    GameMenu,
    MagicWrapper,
    SeatingInfo,
    WaitingPanel,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      bus: mitt(),  // Used by WaitingPanel

      cardCloseupModalId: 'card-closeup-modal-' + uuidv4(),
      cardDraftModalId: 'card-draft-modal-' + uuidv4(),
      cardTableauModalId: 'card-tableau-modal-' + uuidv4(),
      fileModalId: 'file-manager-edit-modal-' + uuidv4(),

      closeupCardData: null,
      closeupDraftCard: null,
      showWaitingPanel: false,
    }
  },

  computed: {
    ...mapState('magic/cubeDraft', {
      game: 'game',
      gameReady: 'ready',
    }),

    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      modified: 'modified',
    }),

    player() {
      return this.game.getPlayerByName(this.actor.name)
    },

    tableauCards() {
      if (!this.game) {
        return []
      }

      const pack = this.game.getNextPackForPlayer(this.player)

      if (pack) {
        return pack.getRemainingCards()
      }

      else {
        return []
      }
    },

    waitingPanelClasses() {
      return [
        this.showWaitingPanel ? '' : 'd-none',
      ]
    },

    widthClass() {
      if (this.tableauCards.length === 1) {
        return 'one-card-width'
      }
      else if (this.tableauCards.length <= 6) {
        return 'two-card-width'
      }
      else {
        return 'three-card-width'
      }
    },
  },

  provide() {
    return {
      actor: this.actor,
      game: computed(() => this.game),
      save: this.save,

      bus: this.bus,
      ui: this.uiFactory(),
    }
  },

  methods: {
    async chooseCard(card) {
      this.bus.emit('user-select-option', { optionName: card.id })
      await nextTick()
      this.bus.emit('click-choose-selected-option')

      // Add the card to the player's deck.
      this.$store.dispatch('magic/dm/addCard', {
        card: card.data,
        zoneName: 'main',
      })
      this.$store.dispatch('magic/dm/saveActiveDeck')
    },

    loadGame() {
      this.$store.dispatch('magic/cubeDraft/loadGame', {
        gameData: this.data,
        doFunc: this.do,
      })
    },

    async save() {
      const game = this.game
      let requestResult

      if (game.usedUndo) {
        const payload = {
          gameId: game._id,
          responses: game.responses,
          chat: game.getChat(),
          waiting: game.waiting,
          gameOver: game.gameOver,
          gameOverData: game.gameOverData,
        }

        requestResult = await axios.post('/api/game/saveFull', payload)
      }

      else {
        const payload = {
          gameId: game._id,
          response: game.getLastUserAction(),
        }

        requestResult = await axios.post('/api/game/saveResponse', payload)
      }

      if (requestResult.data.status === 'success') {
        console.log('saved')
        this.game.usedUndo = false
      }
      else {
        alert('Save game failed. Try reloading and trying again.\n' + requestResult.data.message)
      }
    },

    showDraftModal(card) {
      if (!card.data) {
        card.data = this.$store.getters['magic/cards/getLookupFunc'](card)
      }

      this.closeupDraftCard = card

      if (this.closeupDraftCard) {
        this.$modal(this.cardDraftModalId).show()
      }
    },

    showCardCloseup(cardId) {
      // Handle a card with data already populated
      if (cardId.data) {
        this.closeupCardData = cardId.data
      }

      // Handle just getting a card id
      else {
        const card = this.game.getCardById(cardId)
        this.closeupCardData = this.$store.getters['magic/cards/getLookupFunc'](card)
      }

      if (this.closeupCardData) {
        this.$modal(this.cardCloseupModalId).show()
      }
    },

    showPackTableau() {
      this.$modal(this.cardTableauModalId).show()
    },

    swapCardZone(card) {
      this.$store.dispatch('magic/dm/clickCard', card)
    },

    uiFactory() {
      const selectorOptionComponent = (option) => {
        const cardId = option.title ? option.title : option
        const card = this.game.getCardById(cardId)

        if (card) {
          return {
            component: CardListItem,
            props: {
              card,
              showManaCost: true,
              onClick: () => { this.showCardCloseup(cardId) },
            },
          }
        }
        else {
          return undefined
        }
      }

      const toggleWaitingPanel = () => {
        this.showWaitingPanel = !this.showWaitingPanel
      }

      return {
        fn: {
          selectorOptionComponent,
          toggleWaitingPanel,
        },
      }
    },
  },

  watch: {
    async game(newValue) {
      if (!newValue) {
        return
      }

      // Load deck
      const player = newValue.getPlayerByName(this.actor.name)
      const response = await axios.post('/api/magic/deck/fetch', {
        deckId: player.deckId,
      })

      if (response.data.status === 'success') {
        this.$store.dispatch('magic/dm/selectDeck', response.data.deck)
      }
      else {
        alert('Unable to load deck')
      }
    }
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
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 3em;
}

.data-column {
  padding: 1em;
}

.data-column.one-card-width {
  min-width: 260px;
}

.data-column.two-card-width {
  min-width: 480px;
}

.data-column.three-card-width {
  min-width: 700px;
}

.deck-column {
  min-width: 18em;
}

.log-column {
  display: flex;
  flex-direction: column;
  min-width: 340px;
  max-width: 340px;
  height: 100vh;
  overflow: hidden;
}

.deck-column {
  font-size: 1.3em;
}

.game-column:not(:first-of-type) {
  margin-left: .5em;
}
</style>
