<template>
  <div class="dune">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">

        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
          </GameMenu>
          <GameLogDune />
        </div>

        <div class="col game-column">
          <DuneConflict />
          <DuneFactionTrack />
          <WaitingPanel />
        </div>

        <div class="col market-column">
          <DuneImperiumRow />
          <DuneContractMarket />
        </div>

        <div class="col player-column">
          <DunePlayerPanel
            v-for="player in orderedPlayers"
            :key="player.name"
            :player="player"
          />
        </div>

        <div class="col spaces-column">
          <DuneActionSpaces />
        </div>

      </div>
    </div>

    <DuneRulesModal />
    <DebugModal />

    <teleport to="body">
      <div v-if="ui.modals.cardViewer" class="dune-modal-backdrop" @click="ui.modals.cardViewer = null">
        <div class="dune-modal" @click.stop>
          <DuneCard :card="ui.modals.cardViewer" class="modal-card" />
        </div>
      </div>
      <div v-if="ui.modals.cardList" class="dune-modal-backdrop" @click="ui.modals.cardList = null">
        <div class="dune-modal card-list-modal" @click.stop>
          <div class="modal-title">{{ ui.modals.cardList.title }}</div>
          <div v-if="ui.modals.cardList.cards.length === 0" class="modal-empty">none</div>
          <DuneCard v-for="card in ui.modals.cardList.cards"
                    :key="card.id || card.name"
                    :card="card"
                    class="modal-card" />
        </div>
      </div>
    </teleport>
  </div>
</template>


<script>
import DropdownButton from '@/components/DropdownButton.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

import { dune } from 'battlestar-common'

import DuneCard from './DuneCard.vue'
import GameLogDune from './GameLogDune.vue'
import DunePlayerPanel from './DunePlayerPanel.vue'
import DuneImperiumRow from './DuneImperiumRow.vue'
import DuneConflict from './DuneConflict.vue'
import DuneFactionTrack from './DuneFactionTrack.vue'
import DuneContractMarket from './DuneContractMarket.vue'
import DuneActionSpaces from './DuneActionSpaces.vue'
import DuneOptionChip from './DuneOptionChip.vue'
import DuneRulesModal from './modals/DuneRulesModal.vue'


export default {
  name: 'DuneGame',

  components: {
    DebugModal,
    DuneCard,
    DropdownButton,
    DuneActionSpaces,
    DuneConflict,
    DuneContractMarket,
    DuneFactionTrack,
    DuneImperiumRow,
    DunePlayerPanel,
    DuneRulesModal,
    GameLogDune,
    GameMenu,
    WaitingPanel,
  },

  inject: ['actor', 'bus', 'game'],

  data() {
    return {
      ui: {
        fn: {},
        modals: {
          rulesReference: { filter: null },
          cardViewer: null,
          cardList: null,
        },
      },
    }
  },

  provide() {
    return {
      ui: this.ui,
    }
  },

  computed: {
    orderedPlayers() {
      const viewer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewer)
    },
  },

  methods: {
    openRules() {
      this.$modal('dune-rules-reference').show()
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Dune Imperium: Uprising'

    // Name -> definition lookup. Names can collide across decks (e.g. imperium
    // "Desert Power" vs conflict "Desert Power"), so scan decks in priority
    // order and take the first hit. Imperium is by far the most common deck
    // represented in the option selector; conflict cards are revealed, not
    // chosen, so they fall last.
    const deckPriority = [
      dune.res.cards.imperiumCards,
      dune.res.cards.reserveCards,
      dune.res.cards.starterCards,
      dune.res.cards.contractCards,
      dune.res.cards.techCards,
      dune.res.cards.intrigueCards,
      dune.res.cards.conflictCards,
    ]
    const cardsByName = {}
    for (const deck of deckPriority) {
      for (const card of deck) {
        if (!(card.name in cardsByName)) {
          cardsByName[card.name] = card
        }
      }
    }
    const leadersByName = {}
    for (const leader of dune.res.leaderData) {
      leadersByName[leader.name] = leader
    }
    const spacesByName = {}
    for (const space of dune.res.boardSpaces) {
      spacesByName[space.name] = space
    }

    function spaceSubtitle(space) {
      if (!space.effects || space.effects.length === 0) {
        return null
      }
      const parts = []
      for (const effect of space.effects) {
        if (effect.type === 'choice') {
          const choiceDescs = effect.choices.map(c =>
            c.effects.map(e => describeEffect(e)).filter(Boolean).join(', ')
          )
          parts.push(choiceDescs.join(' OR '))
        }
        else {
          const desc = describeEffect(effect)
          if (desc) {
            parts.push(desc)
          }
        }
      }
      return parts.join(', ') || null
    }

    function describeEffect(effect) {
      const labels = {
        'troop': (e) => `+${e.amount} troop${e.amount > 1 ? 's' : ''}`,
        'draw': (e) => `draw ${e.amount}`,
        'intrigue': (e) => `+${e.amount} intrigue`,
        'gain': (e) => `+${e.amount} ${e.resource}`,
        'spy': () => '+1 spy',
        'contract': () => '+1 contract',
        'spice-harvest': (e) => e.amount > 0 ? `${e.amount} spice` : null,
        'sandworm': (e) => `+${e.amount} sandworm${e.amount > 1 ? 's' : ''}`,
        'high-council': () => 'High Council',
        'sword-master': () => 'Swordmaster',
        'influence-choice': (e) => `+${e.amount} influence`,
      }
      const fn = labels[effect.type]
      return fn ? fn(effect) : null
    }

    this.ui.fn.selectorOptionComponent = (option) => {
      const name = option.title || option
      if (typeof name !== 'string') {
        return null
      }

      const leader = leadersByName[name]
      if (leader) {
        return {
          component: DuneOptionChip,
          props: { name, leader },
        }
      }

      const space = spacesByName[name]
      if (space) {
        return {
          component: DuneOptionChip,
          props: { name, boardSpace: space, subtitle: spaceSubtitle(space) },
        }
      }

      const card = cardsByName[name]
      if (card) {
        return {
          component: DuneOptionChip,
          props: { name, card },
        }
      }

      // Contract choices: "Name (reward text)"
      const contractMatch = name.match(/^(.+?) \((.+)\)$/s)
      if (contractMatch) {
        const contractCard = cardsByName[contractMatch[1]]
        if (contractCard) {
          const cardWithReward = { ...contractCard, reward: contractMatch[2] }
          return {
            component: DuneOptionChip,
            props: { name: contractMatch[1], card: cardWithReward },
          }
        }
      }

      return null
    }
  },
}
</script>


<style scoped>
.dune {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow: auto;
  color: #2c2416;
  background-color: #f8f5f0;

  --waiting-bg: #f8f5f0;
  --waiting-active-bg: #efe8db;
  --waiting-border-color: #d4c8b4;
  --waiting-tab-color: #6b5a42;
  --waiting-tab-active-color: #2c2416;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 280px;
  max-width: 380px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.market-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.player-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.spaces-column {
  height: calc(100vh - 60px);
  min-width: 200px;
  max-width: 240px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.dune-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dune-modal {
  background: white;
  border-radius: .5em;
  min-width: 300px;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .3);
}

.modal-card {
  margin: 0;
  border: none;
  font-size: 1em;
  padding: .6em .8em;
}

.card-list-modal {
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: .75em;
  display: flex;
  flex-direction: column;
  gap: .35em;
}

.card-list-modal .modal-card {
  border: 1px solid #d4c8a8;
  font-size: .9em;
  padding: .4em .6em;
}

.modal-title {
  font-weight: 600;
  font-size: 1.05em;
  padding: 0 .25em .25em;
  border-bottom: 1px solid #e0d8c4;
  color: #2c2416;
}

.modal-empty {
  color: #8a7a68;
  font-style: italic;
  padding: .5em .25em;
}
</style>
