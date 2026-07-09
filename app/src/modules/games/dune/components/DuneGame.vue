<template>
  <div class="dune">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row" style="--bs-gutter-x: 0.75rem">

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

        <div class="col player-column">
          <DunePlayerSummary />
        </div>

        <div class="col cards-column">
          <DunePlayerCards />
        </div>

        <div class="col spaces-column">
          <DuneActionSpaces />
        </div>

        <div class="col faction-column">
          <DuneActionSpaces :factions="true" />
        </div>

        <div class="col imperium-column">
          <DuneImperiumRow />
          <DuneContractMarket />
        </div>

      </div>
    </div>

    <DuneCardViewerModal />
    <DuneCardListModal />
    <DuneRefreshInfoModal />
    <DuneRulesModal />
    <DuneShieldWallModal />
    <DuneStrengthBreakdownModal />
    <DuneTableauModal />
    <DuneVpBreakdownModal />
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
import DunePlayerSummary from './DunePlayerSummary.vue'
import DuneImperiumRow from './DuneImperiumRow.vue'
import DuneConflict from './DuneConflict.vue'
import DuneFactionTrack from './DuneFactionTrack.vue'
import DuneContractMarket from './DuneContractMarket.vue'
import DunePlayerCards from './DunePlayerCards.vue'
import DuneActionSpaces from './DuneActionSpaces.vue'
import DuneOptionChip from './DuneOptionChip.vue'
import DuneCardListModal from './modals/DuneCardListModal.vue'
import DuneCardViewerModal from './modals/DuneCardViewerModal.vue'
import DuneRefreshInfoModal from './modals/DuneRefreshInfoModal.vue'
import DuneRulesModal from './modals/DuneRulesModal.vue'
import DuneShieldWallModal from './modals/DuneShieldWallModal.vue'
import DuneStrengthBreakdownModal from './modals/DuneStrengthBreakdownModal.vue'
import DuneTableauModal from './modals/DuneTableauModal.vue'
import DuneVpBreakdownModal from './modals/DuneVpBreakdownModal.vue'


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
    DunePlayerCards,
    DunePlayerSummary,
    DuneRefreshInfoModal,
    DuneRulesModal,
    DuneShieldWallModal,
    DuneStrengthBreakdownModal,
    DuneTableauModal,
    DuneVpBreakdownModal,
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
          vpBreakdown: null,
          strengthBreakdown: null,
        },
      },
    }
  },

  provide() {
    return {
      ui: this.ui,
    }
  },

  methods: {
    openRules() {
      this.$modal('dune-rules-reference').show()
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Dune Imperium: Uprising'

    // Canonical lookup path: resolve by id when a structured choice provides
    // one (see BaseActionManager.chooseCards).
    //
    // Card definition ids are NOT globally unique — the same name/id can exist
    // in more than one deck (e.g. "Crysknife" is both an imperium card and an
    // intrigue card). So the option's `kind` decides which deck(s) to search,
    // and per-deck id tables keep the collisions apart. A flat id table would
    // be ambiguous: whichever deck was scanned last would silently win, which
    // is exactly how the intrigue chip used to show for the imperium card.
    //
    // Within a kind, and for the bare-name fallback, decks are scanned in
    // priority order so the most commonly selected deck wins collisions (e.g.
    // imperium "Desert Power" beats conflict "Desert Power").
    const decksByName = {
      imperium: dune.res.cards.imperiumCards,
      reserve: dune.res.cards.reserveCards,
      starter: dune.res.cards.starterCards,
      contract: dune.res.cards.contractCards,
      tech: dune.res.cards.techCards,
      intrigue: dune.res.cards.intrigueCards,
      conflict: dune.res.cards.conflictCards,
    }
    const deckPriority = ['imperium', 'reserve', 'starter', 'contract', 'tech', 'intrigue', 'conflict']

    // Map the engine's option `kind` to the ordered set of decks it can name.
    // Anything not listed here (or a card option with no kind) falls back to
    // the full priority scan.
    const decksByKind = {
      'imperium-card': ['imperium', 'reserve', 'starter', 'contract', 'tech'],
      'intrigue-card': ['intrigue'],
      'conflict-card': ['conflict'],
      'tech-card': ['tech'],
      'contract-card': ['contract', 'imperium'],
    }

    const idMapsByDeck = {}
    const cardsByName = {}
    for (const deckName of deckPriority) {
      const map = {}
      for (const card of decksByName[deckName]) {
        if (card.id && !(card.id in map)) {
          map[card.id] = card
        }
        if (!(card.name in cardsByName)) {
          cardsByName[card.name] = card
        }
      }
      idMapsByDeck[deckName] = map
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

    const resolveCardById = (kind, id) => {
      const order = decksByKind[kind] || deckPriority
      for (const deckName of order) {
        const hit = idMapsByDeck[deckName]?.[id]
        if (hit) {
          return hit
        }
      }
      // Last resort: the kind's decks didn't have it, so scan everything in
      // priority order rather than return nothing.
      for (const deckName of deckPriority) {
        const hit = idMapsByDeck[deckName]?.[id]
        if (hit) {
          return hit
        }
      }
      return null
    }

    const resolveByKindId = (kind, id) => {
      if (!id) {
        return null
      }
      if (kind === 'leader') {
        return leadersById[id] || leadersByName[id] || null
      }
      if (kind === 'board-space') {
        return spacesById[id] || null
      }
      return resolveCardById(kind, id)
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

      // Fallback: legacy bare-string options resolved by name. Cards take
      // priority over leaders and board spaces because in-game prompts choose
      // cards far more often, and card names can collide with leader names
      // (e.g. "Duncan Idaho" exists as both an imperium card and a leader).
      // Leaders only appear as choices during setup, where the engine already
      // emits a structured option with kind:'leader' and we never reach this
      // fallback. Belt-and-suspenders for stored games recorded before
      // structured options shipped; the engine-side `_warnOnBareStrings` in
      // BaseActionManager surfaces new bare-string emissions during dev play.
      const card = cardsByName[name]
      if (card) {
        return {
          component: DuneOptionChip,
          props: { name, card },
        }
      }

      const space = spacesByName[name]
      if (space) {
        return {
          component: DuneOptionChip,
          props: { name, boardSpace: space, subtitle: spaceSubtitle(space) },
        }
      }

      const leader = leadersByName[name]
      if (leader) {
        return {
          component: DuneOptionChip,
          props: { name, leader },
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
  height: 100vh;
  height: 100dvh;
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
  height: 100vh;
  height: 100dvh;
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.game-column {
  height: 100vh;
  height: 100dvh;
  min-width: 280px;
  max-width: 380px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

.player-column {
  height: 100vh;
  height: 100dvh;
  min-width: 280px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

.cards-column {
  height: 100vh;
  height: 100dvh;
  min-width: 280px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

.spaces-column {
  height: 100vh;
  height: 100dvh;
  min-width: 200px;
  max-width: 240px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

.faction-column {
  height: 100vh;
  height: 100dvh;
  min-width: 180px;
  max-width: 220px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

.imperium-column {
  height: 100vh;
  height: 100dvh;
  min-width: 220px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: .5em;
  padding-bottom: 3em;
}

</style>
