<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!tableauCards">Loading game data</div>

    <div v-else class="cube-draft">
      <div class="game-column log-column">
        <GameMenu :disabled="['undo']">
          <DropdownRouterLink :to="'/magic/cube/' + game.settings.cubeId">cube</DropdownRouterLink>
        </GameMenu>
        <GameLogCubeDraft />
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

      <div class="game-column deck-column">
        <Decklist v-if="deck" :deck="deck" @card-clicked="showCardManager">
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

  <CardManagerModal :deck="deck" />
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
import { v4 as uuidv4 } from 'uuid'

import { computed, nextTick } from 'vue'
import { mapState } from 'vuex'
import { magic } from 'battlestar-common'

import AdminOptions from './AdminOptions'
import CardDraftModal from './CardDraftModal'
import CardTableau from './CardTableau'
import GameLogCubeDraft from './GameLogCubeDraft'
import MatchResults from './MatchResults'
import SeatingInfo from './SeatingInfo'

import DropdownButton from '@/components/DropdownButton'
import DropdownRouterLink from '@/components/DropdownRouterLink'

import DebugModal from '@/modules/games/common/components/DebugModal'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import CardEditorModal from '@/modules/magic/components/CardEditorModal'
import CardListItem from '@/modules/magic/components/CardListItem'
import CardManagerModal from '@/modules/magic/components/deck/CardManagerModal'
import Decklist from '@/modules/magic/components/deck/Decklist'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'CubeDraft',

  components: {
    AdminOptions,
    CardManagerModal,
    CardDraftModal,
    CardEditorModal,
    CardTableau,
    DebugModal,
    Decklist,
    DropdownButton,
    DropdownRouterLink,
    GameLogCubeDraft,
    GameMenu,
    MagicWrapper,
    MatchResults,
    SeatingInfo,
    WaitingPanel,
  },

  data() {
    return {
      cardDraftModalId: 'card-draft-modal-' + uuidv4(),
      fileModalId: 'file-manager-edit-modal-' + uuidv4(),

      deck: null,
      closeupCard: null,
      closeupDraftCard: null,
      scarCard: null,

      scars: [],
      scarMessage: 'loading scars',

      gameReady: false,
      showGameStats: false,
      showWaitingPanel: false,
    }
  },

  inject: ['actor', 'bus', 'game'],

  provide() {
    return {
      ui: this.uiFactory(),
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardLookup: 'cards',
      cardsReady: 'cardsReady',
    }),

    doingScars() {
      const player = this.game.getPlayerByName(this.actor.name)
      const waiting = this.game.getWaiting(player)
      return waiting && waiting.title === 'Apply Scar'
    },

    player() {
      return this.game.getPlayerByName(this.actor.name)
    },

    tableauCards() {
      if (!this.game || !this.cardsReady) {
        return []
      }

      const pack = this.game.getNextPackForPlayer(this.player)

      if (pack) {
        const cards = pack
          .getRemainingCards()
          .map(c => {
            const wrapped = this.cardLookup.byId[c._id]
            const clone = wrapped.clone()
            clone.g.id = c.id
            return clone
          })
        return cards
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
      await this.$store.dispatch('game/submitAction', {
        actor: this.actor.name,
        title: 'Draft Card',
        selection: [card.g.id],
      })

      // Add the card to the player's deck.
      this.deck.addCard(card, 'main')
      await this.$store.dispatch('magic/saveDeck', this.deck)
    },

    async loadGame() {
      // Load deck
      const player = this.game.getPlayerByName(this.actor.name)
      const { deck } = await this.$post('/api/magic/deck/fetch', {
        deckId: player.deckId,
      })
      this.deck = new magic.util.wrapper.deck(deck)
      this.deck.initializeCardsSync(this.cardLookup.deckJuicer)

      // Signal that everything is ready to go
      this.gameReady = true
    },

    async scarApplied(scarIndex, updated, original) {
      throw new Error('not implemented')
      /* if (!updated) {
       *   alert('No changes where made to the card')
       *   return
       * }

       * const savedCard = await this.$store.dispatch('magic/cards/save', {
       *   actor: this.actor,
       *   cubeId: this.game.settings.cubeId,
       *   updated,
       *   original,
       *   comment: `Scarred in ${this.game.settings.name}.`,
       * })

       * await this.$post('/api/magic/scar/apply', {
       *   scarId: this.scars[scarIndex]._id,
       *   userId: this.actor._id,
       *   cardIdDict: mag.util.card.id.asDict(savedCard),
       * })

       * await this.$post('/api/magic/scar/release_by_user', {
       *   userId: this.actor._id,
       * })

       * this.game.respondToInputRequest({
       *   actor: this.actor.name,
       *   title: 'Apply Scar',
       *   selection: [{
       *     scarIndex,
       *     originalId: original.id,
       *     newData: savedCard,
       *   }]
       * })

       * await this.save() */
    },

    showDraftModal(card) {
      if (card) {
        this.closeupDraftCard = card
        this.$modal(this.cardDraftModalId).show()
      }
    },

    showCardManager(payload) {
      this.bus.emit('card-manager:begin', {
        card: payload.card,
        zone: payload.zone,
      })
    },

    showScarModal(card) {
      this.scarCard = card
      this.$modal('card-editor-modal').show()
    },

    uiFactory() {
      const selectorOptionComponent = (option) => {
        const cardId = option.title ? option.title : option
        const internalCard = this.game.getCardById(cardId)
        const externalCard = this.cardLookup.byId[internalCard._id]

        if (externalCard) {
          return {
            component: CardListItem,
            props: {
              card: externalCard,
              showManaCost: true,
              onClick: () => { this.showCardManager(cardId) },
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
  overflow: auto;
}

.game-column {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
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
