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
        <ScarRound v-if="doingScars" :scars="availableScars" />
        <CardTableau
          :cards="tableauCards"
          :cardScroll="false"
          @card-clicked="cardClicked"
        />
        <WaitingPanel :class="waitingPanelClasses" />
      </div>

      <div class="game-column deck-column">
        <DeckList v-if="deck" :deck="deck" @card-clicked="showCardManager" />
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

    <CardDraftModal :id="cardDraftModalId" :card="closeupDraftCard" @draft-card="chooseCard" />
    <DebugModal />

    <CardEditorModal v-model="scarModalVis" :card="scarModalCard" title="Scar Applicator">
      <template #before-card>
        <BAlert :model-value="true" v-for="(scar, index) in availableScars" :key="scar.id">
          {{ `scar ${index+1}: ${scar.text}` }}
        </BAlert>
      </template>

      <template #after-card>
        <BFormTextarea rows="4" placeholder="tell us about this scar..." v-model="scarComment" />
      </template>

      <template #footer>
        <BButton variant="warning" @click="scarHelpModalVis = true">help!?</BButton>
        <BButton @click="scarApplied(0)">scar 1</BButton>
        <BButton @click="scarApplied(1)">scar 2</BButton>
      </template>


      <BModal v-model="scarHelpModalVis" title="How to Scar a Card">
        <div>To apply a scar, you just edit the card to make it match what the scar says. You can edit any part of the card by clicking on it and putting in the new values you want it to have.</div>

        <div class="mt-4">When you're done, click on the button matching the scar you applied. This is important so that the scar will be marked as used and not given out again in future rounds.</div>

        <BAlert :model-value="true" class="mt-4">
          tips
          <ul>
            <li>It's funny to make a really broken card, but later on, when someone is playing against that card, and they're having a fun game of magic, and then suddenly lose to their opponent's uber-bomb, it's less funny.</li>
            <li>The same scar applied to a one drop might be broken but applied to a six drop might be boring.</li>
            <li>You don't have to apply the scar exactly as written; play around with it.</li>
            <li>Some good flavor and a little spice go a long way.</li>
          </ul>
        </BAlert>
      </BModal>
    </CardEditorModal>

  </MagicWrapper>
</template>


<script>
import { v4 as uuidv4 } from 'uuid'

import { mapState } from 'vuex'
import { magic } from 'battlestar-common'

import AdminOptions from './AdminOptions'
import CardDraftModal from './CardDraftModal'
import CardTableau from './CardTableau'
import GameLogCubeDraft from './GameLogCubeDraft'
import MatchResults from './MatchResults'
import ScarRound from './ScarRound'
import SeatingInfo from './SeatingInfo'

import DropdownRouterLink from '@/components/DropdownRouterLink'

import DebugModal from '@/modules/games/common/components/DebugModal'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import CardEditorModal from '@/modules/magic/components/CardEditorModal'
import CardListItem from '@/modules/magic/components/CardListItem'
import DeckList from '@/modules/magic/components/deck/DeckList'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'CubeDraft',

  components: {
    AdminOptions,
    CardDraftModal,
    CardEditorModal,
    CardTableau,
    DebugModal,
    DeckList,
    DropdownRouterLink,
    GameLogCubeDraft,
    GameMenu,
    MagicWrapper,
    MatchResults,
    ScarRound,
    SeatingInfo,
    WaitingPanel,
  },

  data() {
    return {
      cardDraftModalId: 'card-draft-modal-' + uuidv4(),

      deck: null,
      closeupCard: null,
      closeupDraftCard: null,
      scarredCard: null,
      scarComment: '',

      gameReady: false,
      showGameStats: false,
      showWaitingPanel: false,

      scarHelpModalVis: false,
      scarModalVis: false,
      scarModalCard: null,
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

    ...mapState('magic/cube', {
      cube: 'cube',
    }),

    availableScars() {
      if (this.cube && this.doingScars) {
        const player = this.game.players.byName(this.actor.name)
        const waiting = this.game.getWaiting(player)
        return waiting
          .choices
          .map(scarId => this.cube.getScarById(scarId))
      }
      else {
        return []
      }
    },

    doingScars() {
      const player = this.game.players.byName(this.actor.name)
      const waiting = this.game.getWaiting(player)
      return waiting && waiting.title === 'Apply Scar'
    },

    player() {
      return this.game.players.byName(this.actor.name)
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
        this.scarModalVis = true
        this.scarModalCard = card
      }
      else {
        this.showDraftModal(card)
      }
    },

    cardUpdated({ updated, original }) {
      this.scarredCard = updated
      this.scarredCard.g.id = original.g.id
    },

    async chooseCard(card) {
      await this.$store.dispatch('game/submitAction', {
        actor: this.actor.name,
        title: 'Draft Card',
        selection: [card.g.id],
        ignoreBranch: true,
      })

      // Add the card to the player's deck.
      this.deck.addCard(card, 'main')
      await this.$store.dispatch('magic/saveDeck', this.deck)
    },

    async loadGame() {
      // Load deck
      const player = this.game.players.byName(this.actor.name)
      const { deck } = await this.$post('/api/magic/deck/fetch', {
        deckId: player.deckId,
      })
      this.deck = new magic.util.wrapper.deck(deck)
      this.deck.initializeCardsSync(this.cardLookup.deckJuicer)

      if (this.game.settings.cubeId) {
        await this.$store.dispatch('magic/cube/loadCube', {
          cubeId: this.game.settings.cubeId
        })
      }

      // Signal that everything is ready to go
      this.gameReady = true
    },

    async scarApplied(index) {
      if (!this.scarredCard) {
        alert('No changes made to card')
        return
      }

      const scar = this.availableScars[index]


      await this.$store.dispatch('game/submitAction', {
        actor: this.actor.name,
        title: 'Apply Scar',
        selection: [{
          scarId: scar.id,
          cardId: this.scarredCard.g.id,
        }],
      })

      // Update the card and the scar on the server
      let comment = this.scarComment
      if (!comment) {
        comment = `Applied scar: ${scar.text}`
      }

      await this.$store.dispatch('magic/cards/update', {
        scar,
        card: this.scarredCard,
        comment: this.scarComment,
      })

      this.scarredCard = null
      this.scarComment = ''
      this.scarModalVis = false
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

    uiFactory() {
      const selectorOptionComponent = (option) => {
        if (option.title === 'Draft Card') {
          const cardId = option.title ? option.title : option
          const internalCard = this.game.getCardById(cardId)
          const externalCard = this.cardLookup.byId[internalCard._id]

          if (externalCard) {
            return {
              component: CardListItem,
              props: {
                card: externalCard,
                showManaCost: true,
                onClick: () => {
                  this.showCardManager(cardId)
                },
              },
            }
          }
          else {
            return undefined
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

  mounted() {
    this.bus.on('card-editor:updated', this.cardUpdated)
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
