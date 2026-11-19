<template>
  <div class="ix-column">
    <section class="ix-panel">
      <div class="section-header">
        <span>Shipping</span>
        <span class="header-note">How it works</span>
      </div>
      <div class="track"
           role="button"
           tabindex="0"
           title="How freighters work"
           @click="openInfo"
           @keydown.enter.prevent="openInfo"
           @keydown.space.prevent="openInfo">
        <div v-for="row in rows"
             :key="row.space"
             class="track-row"
             :class="{ 'is-eligible': row.eligible, 'is-collecting': row.collecting, 'is-home': row.home }">
          <div class="marker-well">
            <span v-for="disc in row.discs"
                  :key="disc.name"
                  class="disc"
                  :class="{ collecting: disc.collecting }"
                  :style="disc.style"
                  :title="disc.title">{{ disc.initials }}</span>
          </div>
          <div v-if="row.home" class="reward reward-empty"/>
          <div v-else class="reward">
            <span class="reward-level">{{ row.level }}</span>
            <span class="reward-text">{{ row.reward }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ix-panel tech-panel">
      <div class="section-header">
        <span>Tech</span>
        <span class="pile-count" :title="pileTitle">{{ pileCount }} in pile</span>
      </div>
      <div class="cards">
        <DuneCard v-for="tile in faceUp" :key="tile.id" :card="tile" />
        <div v-if="faceUp.length === 0" class="empty">No tech tiles left</div>
      </div>
    </section>

    <DuneContractMarket />

    <teleport to="body">
      <ModalBase id="dune-freighter-info">
        <template #header>Freighters</template>

        <div class="freighter-info">
          <p>Each player has one freighter. The track has four spaces. The freighter starts on the bottom space, which lines up with no reward.</p>
          <p>When you move your freighter, choose one:</p>
          <ul>
            <li>Advance one space toward the top. You cannot advance from the top. Advancing does not pay a reward.</li>
            <li>Recall to the bottom. You take the reward for your current space and every reward space below it, in any order. The bottom space pays nothing. Recalling from the space just above it takes only that reward.</li>
          </ul>
          <p>While you are choosing a reward, your freighter sits on that space. When the recall is finished, it returns to the bottom.</p>

          <div class="reward-block">
            <div class="reward-title">Bottom</div>
            <p>Choose one: Dividends, or 2 spice. Dividends pays you 5 Solari, and each other player 1 Solari.</p>
          </div>
          <div class="reward-block">
            <div class="reward-title">Middle</div>
            <p>Recruit 2 troops and gain 1 influence with one faction. The troops go to your garrison. If your agent is on a combat space this turn, you may deploy them. Troop Transports recruits one extra troop.</p>
          </div>
          <div class="reward-block">
            <div class="reward-title">Top</div>
            <p>Acquire a tech tile for 2 spice less than its printed cost.</p>
          </div>
        </div>

        <template #footer>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </template>
      </ModalBase>
    </teleport>
  </div>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import DuneCard from './DuneCard.vue'
import DuneContractMarket from './DuneContractMarket.vue'

const LEVELS = [
  { space: 3, level: 'Top', reward: 'Acquire Tech, −2 spice' },
  { space: 2, level: 'Middle', reward: '2 troops and 1 influence' },
  { space: 1, level: 'Bottom', reward: 'Dividends or 2 spice' },
  { space: 0, home: true },
]

export default {
  name: 'DuneIxColumn',

  components: { DuneCard, DuneContractMarket, ModalBase },

  inject: ['game'],

  computed: {
    orderedPlayers() {
      const allPlayers = this.game.players.all()
      if (!allPlayers.length) {
        return []
      }
      const firstIdx = this.game.state.firstPlayerIndex || 0
      const firstPlayer = allPlayers[firstIdx] || allPlayers[0]
      return this.game.players.startingWith(firstPlayer)
    },

    rewardFocus() {
      return this.game.state.freighterReward || null
    },

    eligibleSpaces() {
      const reward = this.rewardFocus
      if (!reward) {
        return new Set()
      }
      const selector = this.selectorFor(reward.player)
      if (!selector || selector.title !== 'Take a Shipping reward') {
        return new Set()
      }
      const spaces = new Set()
      for (const choice of selector.choices || []) {
        const id = typeof choice === 'object' ? choice.id : choice
        const match = String(id || '').match(/^space-(\d)$/)
        if (match) {
          spaces.add(Number(match[1]))
        }
        else if (choice === 'Top' || choice?.title === 'Top') {
          spaces.add(3)
        }
        else if (choice === 'Middle' || choice?.title === 'Middle') {
          spaces.add(2)
        }
        else if (choice === 'Bottom' || choice?.title === 'Bottom') {
          spaces.add(1)
        }
      }
      return spaces
    },

    rows() {
      const reward = this.rewardFocus
      const collectingPlayer = reward && this.isCollecting(reward.player) ? reward.player : null
      return LEVELS.map(level => {
        const discs = []
        for (const player of this.orderedPlayers) {
          const position = this.displayPosition(player)
          if (position !== level.space) {
            continue
          }
          const collecting = collectingPlayer === player.name
          discs.push({
            name: player.name,
            initials: initials(player.name),
            title: collecting
              ? `${player.name} is taking this reward`
              : `${player.name}'s freighter`,
            collecting,
            style: {
              backgroundColor: player.color || '#8a7a68',
              color: inkFor(player.color),
            },
          })
        }
        return {
          ...level,
          discs,
          eligible: this.eligibleSpaces.has(level.space),
          collecting: discs.some(disc => disc.collecting),
        }
      })
    },

    faceUp() {
      const tiles = []
      for (const stack of this.game.state.techStacks || []) {
        if (stack[0]) {
          tiles.push(stack[0])
        }
      }
      return tiles
    },

    pileCount() {
      let hidden = 0
      for (const stack of this.game.state.techStacks || []) {
        if (!stack.length) {
          continue
        }
        hidden += stack[0] ? stack.length - 1 : stack.length
      }
      return hidden
    },

    pileTitle() {
      return 'Face-down tech tiles. Buying a tile turns up the next one from the pile.'
    },
  },

  methods: {
    openInfo() {
      this.$modal('dune-freighter-info').show()
    },

    selectorFor(playerName) {
      const selectors = this.game.waiting?.selectors || []
      return selectors.find(selector => selector.actor === playerName) || null
    },

    isCollecting(playerName) {
      const reward = this.rewardFocus
      if (!reward || reward.player !== playerName) {
        return false
      }
      const selector = this.selectorFor(playerName)
      if (!selector) {
        return false
      }
      return selector.title !== 'Take a Shipping reward' && selector.title !== 'Move your Freighter'
    },

    displayPosition(player) {
      const reward = this.rewardFocus
      if (reward && reward.player === player.name && this.selectorFor(player.name)?.title !== 'Move your Freighter') {
        return reward.space
      }
      return player.freighterPosition || 0
    },
  },
}

function initials(name) {
  const letters = String(name || '').replace(/[^A-Za-z0-9]/g, '')
  return (letters.slice(0, 2) || '?').toUpperCase()
}

function inkFor(hex) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return '#fff'
  }
  const red = parseInt(hex.slice(1, 3), 16)
  const green = parseInt(hex.slice(3, 5), 16)
  const blue = parseInt(hex.slice(5, 7), 16)
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000
  return luminance > 160 ? '#2c2416' : '#fff'
}
</script>


<style scoped>
.ix-column {
  display: flex;
  flex-direction: column;
  gap: .35em;
}

.ix-panel {
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: .5em;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .35em;
}

.header-note,
.pile-count {
  font-weight: 500;
  font-size: .75em;
  color: #8a7a68;
}

.tech-panel .section-header {
  color: #1f6f78;
}

.pile-count {
  color: #1f6f78;
  font-variant-numeric: tabular-nums;
}

.track {
  display: flex;
  flex-direction: column;
  border: 1px solid #6b4e2e;
  border-radius: .2em;
  background:
    linear-gradient(180deg, #f6e7c4 0%, #ead3a4 100%);
  cursor: pointer;
  overflow: hidden;
}

.track:hover {
  border-color: #8b6914;
}

.track:focus-visible {
  outline: 2px solid #8b6914;
  outline-offset: 2px;
}

.track-row {
  position: relative;
  display: grid;
  grid-template-columns: 5.8rem minmax(0, 1fr);
  min-height: 2.7rem;
  border-top: 1px solid #c4a574;
}

.track-row:first-child {
  border-top: none;
}

.track-row.is-eligible {
  background-color: rgba(255, 248, 220, .72);
  box-shadow: inset 3px 0 0 #c8962e;
}

.track-row.is-collecting {
  background-color: rgba(255, 236, 180, .9);
}

.marker-well {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: .2rem;
  padding: .25rem .3rem;
  background-color: rgba(120, 84, 40, .08);
  border-right: 1px solid #c4a574;
}

.disc {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 50%;
  border: 1px solid rgba(44, 36, 22, .45);
  font-size: .62rem;
  font-weight: 700;
  letter-spacing: .02em;
  line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .35);
}

.disc.collecting {
  position: absolute;
  left: 5.95rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .35),
    0 0 0 2px #e8b830;
}

.track-row.is-collecting .reward {
  padding-left: 1.9rem;
}

.track-row.is-home .marker-well {
  border-right: none;
  background-color: rgba(120, 84, 40, .16);
}

.reward-empty {
  background: transparent;
}

.reward {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .05rem;
  padding: .2rem .45rem;
  min-width: 0;
}

.reward-level {
  font-size: .62rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #8a5a28;
}

.reward-text {
  font-size: .78rem;
  color: #3a2c18;
  line-height: 1.25;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.empty {
  color: #8a7a68;
  font-style: italic;
  font-size: .85em;
}

.freighter-info {
  font-size: .9em;
  color: #3a3024;
  line-height: 1.45;
}

.freighter-info p {
  margin: 0 0 .55em;
}

.freighter-info ul {
  margin: 0 0 .7em;
  padding-left: 1.15em;
}

.freighter-info li {
  margin-bottom: .3em;
}

.reward-block {
  margin-top: .65em;
  padding-top: .45em;
  border-top: 1px solid #e8e0d0;
}

.reward-title {
  font-weight: 600;
  color: #8b6914;
  margin-bottom: .15em;
}

</style>
