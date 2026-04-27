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

    <DuneCardViewerModal />
    <DuneCardListModal />
    <DuneRulesModal />
    <DuneTableauModal />
    <DebugModal />
  </div>
</template>


<script>
import DropdownButton from '@/components/DropdownButton.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

import { dune } from 'battlestar-common'

import GameLogDune from './GameLogDune.vue'
import DunePlayerPanel from './DunePlayerPanel.vue'
import DuneImperiumRow from './DuneImperiumRow.vue'
import DuneConflict from './DuneConflict.vue'
import DuneFactionTrack from './DuneFactionTrack.vue'
import DuneContractMarket from './DuneContractMarket.vue'
import DuneActionSpaces from './DuneActionSpaces.vue'
import DuneOptionChip from './DuneOptionChip.vue'
import DuneCardListModal from './modals/DuneCardListModal.vue'
import DuneCardViewerModal from './modals/DuneCardViewerModal.vue'
import DuneRulesModal from './modals/DuneRulesModal.vue'
import DuneTableauModal from './modals/DuneTableauModal.vue'


export default {
  name: 'DuneGame',

  components: {
    DebugModal,
    DropdownButton,
    DuneActionSpaces,
    DuneCardListModal,
    DuneCardViewerModal,
    DuneConflict,
    DuneContractMarket,
    DuneFactionTrack,
    DuneImperiumRow,
    DunePlayerPanel,
    DuneRulesModal,
    DuneTableauModal,
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
          tableau: null,
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

    // Canonical lookup path: resolve by id when a structured choice provides
    // one (see BaseActionManager.chooseCards). Card ids are globally unique
    // across Dune decks, so a single flat by-id table is sufficient.
    //
    // Name-based lookup remains as a fallback for engine sites that still
    // emit bare strings; within that fallback, decks are scanned in priority
    // order so the most commonly selected deck wins collisions (e.g.
    // imperium "Desert Power" beats conflict "Desert Power").
    const deckPriority = [
      dune.res.cards.imperiumCards,
      dune.res.cards.reserveCards,
      dune.res.cards.starterCards,
      dune.res.cards.contractCards,
      dune.res.cards.techCards,
      dune.res.cards.intrigueCards,
      dune.res.cards.conflictCards,
    ]
    const cardsById = {}
    const cardsByName = {}
    for (const deck of deckPriority) {
      for (const card of deck) {
        if (card.id) {
          cardsById[card.id] = card
        }
        if (!(card.name in cardsByName)) {
          cardsByName[card.name] = card
        }
      }
    }
    const leadersByName = {}
    const leadersById = {}
    for (const leader of dune.res.leaderData) {
      leadersByName[leader.name] = leader
      if (leader.id) {
        leadersById[leader.id] = leader
      }
    }
    const spacesByName = {}
    const spacesById = {}
    for (const space of dune.res.boardSpaces) {
      spacesByName[space.name] = space
      if (space.id) {
        spacesById[space.id] = space
      }
    }

    const resolveByKindId = (kind, id) => {
      if (!id) {
        return null
      }
      if (kind === 'leader') {
        return leadersById[id] || null
      }
      if (kind === 'board-space') {
        return spacesById[id] || null
      }
      // Default: card-like. Card ids are unique across all Dune decks.
      return cardsById[id] || null
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

      // Canonical path: structured option carries an id (and optionally kind).
      // Prefer defId for lookup — it's the card definition id; `id` is the
      // per-instance id used for disambiguating selections in the engine.
      if (option && typeof option === 'object' && (option.defId || option.id)) {
        const lookupId = option.defId || option.id
        const resolved = resolveByKindId(option.kind, lookupId)
        if (resolved) {
          if (option.kind === 'leader') {
            return { component: DuneOptionChip, props: { name, leader: resolved } }
          }
          if (option.kind === 'board-space') {
            return {
              component: DuneOptionChip,
              props: { name, boardSpace: resolved, subtitle: spaceSubtitle(resolved) },
            }
          }
          return { component: DuneOptionChip, props: { name, card: resolved } }
        }
      }

      // Fallback: legacy bare-string options resolved by name. The priority-
      // ordered cardsByName table above picks the most-likely deck when a
      // name collides across decks.
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

</style>
