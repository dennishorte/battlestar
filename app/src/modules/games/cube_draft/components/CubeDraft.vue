<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>

    <div v-else class="cube-draft">
      <div class="game-column log-column">
        <GameMenu :disabled="['undo']">
          <DropdownRouterLink :to="'/magic/cube/' + game.settings.cubeId">cube</DropdownRouterLink>
        </GameMenu>
        <GameLog />
        <ChatInput />
      </div>

      <div
        v-if="tableauCards.length > 0 || showWaitingPanel"
        class="game-column data-column"
        :class="widthClass"
      >
        <div v-if="doingScars" class="alert alert-warning">
          <h3>Scar Round!</h3>

          <template v-if="scars.length === 0">
            {{ scarMessage }}
          </template>

          <template v-else>
            <div v-for="scar in scars">
              {{ scar.text }}
            </div>

            <div class="small border-top border-warning mt-2">
              Reloading the page will cause new scars to be chosen.
            </div>
          </template>
        </div>
        <CardTableau
          :cards="tableauCards"
          :cardScroll="false"
          @card-clicked="cardClicked"
        />
        <WaitingPanel :class="waitingPanelClasses" />
      </div>

      <div class="game-column deck-column" :class="modifiedClass">
        <Decklist v-if="activeDeck" :deck="activeDeck" @card-clicked="showCardCloseup">
          <template #menu-options>
            <DropdownButton @click="saveDeck">save</DropdownButton>
            <DropdownRouterLink to="/magic/decks">deck manager</DropdownRouterLink>
          </template>
        </Decklist>
      </div>

      <div class="game-column info-column">
        <MatchResults v-if="game.gameOver || showGameStats" class="mb-4" />
        <SeatingInfo class="mb-4" />

        <div>
          <router-link :to="'/magic/cube/' + game.settings.cubeId">cube</router-link>
          <br />
          <router-link :to="'/magic/cube/' + game.settings.cubeId + '/achievements'">achievements</router-link>
        </div>

        <AdminOptions />
      </div>

    </div>

    <DebugModal />
  </MagicWrapper>

  <CardCloseupModal :id="cardCloseupModalId" :card="closeupCard" />
  <CardDraftModal :id="cardDraftModalId" :card="closeupDraftCard" @draft-card="chooseCard" />

  <CardEditorModal :original="scarCard">

    <!-- Need this v-if="!!game" to prevent errors before the game finished loading. -->
    <template #before-card v-if="!!game">
      <div class="alert alert-warning">
        <ol>
          <li v-for="scar in scars">{{ scar.text }}</li>
        </ol>

        <div class="small border-top border-warning">
          You must manually edit the card text.
        </div>
      </div>
    </template>

    <template #footer="footerProps">
      <div>
        <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>

        <button
          class="btn btn-danger"
          @click="scarApplied(0, footerProps.updated, footerProps.original)"
          data-bs-dismiss="modal"
        >
          manually applied 1
        </button>

        <button
          class="btn btn-danger"
          @click="scarApplied(1, footerProps.updated, footerProps.original)"
          data-bs-dismiss="modal"
        >
          manually applied 2
        </button>
      </div>

    </template>
  </CardEditorModal>

</template>


<script>
import mitt from 'mitt'
import { v4 as uuidv4 } from 'uuid'

import { computed, nextTick } from 'vue'
import { mapState } from 'vuex'

import { mag } from 'battlestar-common'

import AdminOptions from './AdminOptions'
import CardCloseupModal from './CardCloseupModal'
import CardDraftModal from './CardDraftModal'
import CardTableau from './CardTableau'
import GameLog from './log/GameLog'
import MatchResults from './MatchResults'
import SeatingInfo from './SeatingInfo'

import DropdownButton from '@/components/DropdownButton'
import DropdownRouterLink from '@/components/DropdownRouterLink'

import ChatInput from '@/modules/games/common/components/ChatInput'
import DebugModal from '@/modules/games/common/components/DebugModal'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import CardEditorModal from '@/modules/magic/components/CardEditorModal'
import CardListItem from '@/modules/magic/components/CardListItem'
import Decklist from '@/modules/magic/components/deck/Decklist'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'CubeDraft',

  components: {
    AdminOptions,
    CardCloseupModal,
    CardDraftModal,
    CardEditorModal,
    CardTableau,
    ChatInput,
    DebugModal,
    Decklist,
    DropdownButton,
    DropdownRouterLink,
    GameLog,
    GameMenu,
    MagicWrapper,
    MatchResults,
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
      fileModalId: 'file-manager-edit-modal-' + uuidv4(),

      closeupCard: null,
      closeupDraftCard: null,
      scarCard: null,

      scars: [],
      scarMessage: 'loading scars',

      showGameStats: false,
      showWaitingPanel: false,
    }
  },

  inject: ['actor'],

  provide() {
    return {
      bus: this.bus,
      game: computed(() => this.game),
      save: this.save,
      ui: this.uiFactory(),
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

    doingScars() {
      const player = this.game.getPlayerByName(this.actor.name)
      const waiting = this.game.getWaiting(player)
      return waiting && waiting.title === 'Apply Scar'
    },

    modifiedClass() {
      if (this.modified) {
        return 'deck-modified'
      }
      else {
        return undefined
      }
    },

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

  methods: {
    cardClicked(card) {
      if (this.doingScars) {
        this.showScarModal(card)
      }
      else {
        this.showDraftModal(card)
      }
    },

    async chooseCard(card) {
      this.bus.emit('user-select-option', {
        actor: this.actor,
        optionName: card.id
      })
      await nextTick()
      this.bus.emit('click-choose-selected-option')

      // Add the card to the player's deck.
      await this.$store.dispatch('magic/dm/addCard', {
        card: card.data,
        zoneName: 'main',
      })
      await this.$store.dispatch('magic/dm/saveActiveDeck')
    },

    async fetchScars() {
      this.scars = []
      this.scarMessage = 'Loading scars'

      // Make sure the doingScars property will be updated by now.
      await nextTick()

      if (this.doingScars) {
        // Release any previously reserved scars
        await this.$post('/api/magic/scar/releaseByUser', {
          userId: this.actor._id,
        })

        // Load some scars, in case needed
        const { scars } = await this.$post('/api/magic/scar/fetchAvailable', {
          cubeId: this.game.settings.cubeId,
          userId: this.actor._id,
          count: 2,
          lock: true,
        })

        this.scars = scars
        if (this.scars.length === 0) {
          this.scarMessage = 'No scars available'
        }
      }
    },

    async loadGame() {
      await this.$store.dispatch('magic/cubeDraft/loadGame', {
        gameData: this.data,
        doFunc: this.do,
      })

      if (this.game.settings.cubeId) {
        // Loading the cube ensures the achievements will be available to render on relevant cards.
        await this.$store.dispatch('magic/cube/loadCube', {
          cubeId: this.game.settings.cubeId,
        })
      }
    },

    async save() {
      const game = this.game

      if (game.usedUndo) {
        const payload = {
          gameId: game._id,
          responses: game.responses,

          // Include these because Magic doesn't run on the backend when saving,
          // so can't calculate these values.
          waiting: game.waiting,
          gameOver: game.gameOver,
          gameOverData: game.gameOverData,
        }

        const response = await this.$post('/api/game/saveFull', payload)
        this.game.branchId = response.branchId
      }

      else {
        const payload = {
          gameId: game._id,
          response: game.getLastUserAction(),
        }

        await this.$post('/api/game/saveResponse', payload)
      }

      this.game.usedUndo = false

      // Fetch scars when a new game is loaded or when the game is saved.
      this.fetchScars()
    },

    saveDeck() {
      this.$store.dispatch('magic/dm/saveActiveDeck')
    },

    async scarApplied(scarIndex, updated, original) {
      if (!updated) {
        alert('No changes where made to the card')
        return
      }

      const savedCard = await this.$store.dispatch('magic/cards/save', {
        actor: this.actor,
        cubeId: this.game.settings.cubeId,
        updated,
        original,
        comment: `Scarred in ${this.game.settings.name}.`,
      })

      await this.$post('/api/magic/scar/apply', {
        scarId: this.scars[scarIndex]._id,
        userId: this.actor._id,
        cardIdDict: mag.util.card.createCardIdDict(savedCard),
      })

      await this.$post('/api/magic/scar/releaseByUser', {
        userId: this.actor._id,
      })

      this.game.respondToInputRequest({
        actor: this.actor.name,
        title: 'Apply Scar',
        selection: [{
          scarIndex,
          originalId: original.id,
          newData: savedCard,
        }]
      })

      await this.save()
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

    showCardCloseup(card) {
      this.closeupCard = card

      if (this.closeupCard) {
        this.$modal(this.cardCloseupModalId).show()
      }
    },

    showScarModal(card) {
      this.scarCard = card
      this.$modal('card-editor-modal').show()
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

      const toggleGameStats = () => this.showGameStats = !this.showGameStats
      const toggleWaitingPanel = () => this.showWaitingPanel = !this.showWaitingPanel

      return {
        fn: {
          selectorOptionComponent,
          toggleGameStats,
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
      const { deck } = await this.$post('/api/magic/deck/fetch', {
        deckId: player.deckId,
      })

      this.$store.dispatch('magic/dm/selectDeck', deck)

      // Fetch scars when a new game is loaded or when the game is saved.
      this.fetchScars()
    }
  },
}
</script>

<style>
.heading {
  font-size: 1.5em;
}
</style>

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

.deck-modified {
  background-color: #faa;
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
