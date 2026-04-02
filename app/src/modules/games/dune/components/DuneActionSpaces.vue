<template>
  <div class="action-spaces">
    <div class="control-row" v-if="hasControl">
      <span v-for="(owner, loc) in game.state.controlMarkers"
            :key="loc"
            v-show="owner"
            class="control-chip">
        {{ formatName(loc) }}: {{ owner }}
      </span>
    </div>

    <div class="board-layout">
      <div class="spaces-column" ref="spacesColumn">
        <div class="section-header">
          Action Spaces
          <span class="shield-wall-destroyed" v-if="!game.state.shieldWall">Shield Wall Destroyed</span>
        </div>
        <div v-for="group in spaceGroups" :key="group.label" class="space-group">
          <div class="group-label" :class="`group-${group.icon}`">
            <DuneFactionIcon v-if="isFaction(group.icon)"
                             :faction="group.icon"
                             size=".9em"
                             class="group-icon" />
            {{ group.label }}
          </div>
          <div v-for="space in group.spaces"
               :key="space.id"
               class="space-entry"
               :class="{ occupied: game.state.boardSpaces[space.id] }"
               :data-space-id="space.id">
            <div class="space-row">
              <DuneFactionIcon v-if="isFaction(space.icon)"
                               :faction="space.icon"
                               size=".85em" />
              <span v-else class="space-icon" :class="`icon-${space.icon}`" />
              <span class="space-name">{{ space.name }}</span>
              <span class="space-occupant" v-if="game.state.boardSpaces[space.id]">
                {{ game.state.boardSpaces[space.id] }}
              </span>
              <span class="space-cost" v-if="costLabel(space)">{{ costLabel(space) }}</span>
              <span class="space-req" v-if="space.influenceRequirement">
                {{ reqLabel(space.influenceRequirement) }}
              </span>
              <span class="space-combat" v-if="space.isCombatSpace" title="Combat">C</span>
            </div>
            <div class="space-effects">
              <div v-for="(line, i) in describeSpace(space)"
                   :key="i"
                   :class="line.startsWith('+') ? 'effect-always' : 'effect-line'">
                {{ line }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-group" v-if="hasBonusSpice">
          <div class="group-label group-yellow">Bonus Spice</div>
          <div v-for="(count, spaceId) in game.state.bonusSpice"
               :key="spaceId"
               v-show="count > 0"
               class="space-row">
            <span class="space-name">{{ formatName(spaceId) }}</span>
            <span class="bonus-amount">+{{ count }}</span>
          </div>
        </div>
      </div>

      <svg class="spy-track" ref="spyTrack">
        <template v-for="post in postPositions" :key="post.id">
          <line v-for="(sy, si) in post.spaceYs"
                :key="si"
                :x1="0"
                :y1="sy"
                :x2="trackCx"
                :y2="post.y"
                stroke="#6a5a48"
                stroke-width="1.5" />
          <circle :cx="trackCx"
                  :cy="post.y"
                  :r="clickablePostIds.has(post.id) ? postRadius + 2 : postRadius"
                  :fill="postFill(post.id)"
                  :stroke="clickablePostIds.has(post.id) ? '#e8b830' : '#6a5a48'"
                  :stroke-width="clickablePostIds.has(post.id) ? 2.5 : 1.5"
                  :class="{ 'clickable-post': clickablePostIds.has(post.id) }"
                  @click="clickPost(post.id)" />
          <text :x="trackCx"
                :y="post.y + 3.5"
                text-anchor="middle"
                font-size="9"
                font-weight="600"
                :fill="postTextFill(post.id)"
                :class="{ 'clickable-post': clickablePostIds.has(post.id) }"
                @click="clickPost(post.id)">
            {{ post.id }}
          </text>
          <!-- Multiple occupants: show colored dots above the post circle -->
          <template v-if="postOccupants(post.id).length > 1">
            <circle v-for="(color, oi) in postOccupantColors(post.id)"
                    :key="'o' + oi"
                    :cx="trackCx - 6 + oi * 12 / (postOccupants(post.id).length - 1 || 1)"
                    :cy="post.y - postRadius - 5"
                    r="3"
                    :fill="color"
                    stroke="#6a5a48"
                    stroke-width="0.75" />
          </template>
        </template>
      </svg>
    </div>
  </div>
</template>


<script>
import { dune } from 'battlestar-common'
import DuneFactionIcon from './DuneFactionIcon.vue'

const boardSpaces = dune.res.boardSpaces
const observationPosts = dune.res.observationPosts
const factionIds = new Set(['emperor', 'guild', 'bene-gesserit', 'fremen'])

export default {
  name: 'DuneActionSpaces',

  components: {
    DuneFactionIcon,
  },

  inject: ['actor', 'bus', 'game'],

  data() {
    return {
      trackWidth: 30,
      trackCx: 18,
      postRadius: 10,
      postPositions: [],
    }
  },

  computed: {
    spaceGroups() {
      const groups = [
        { label: 'City', icon: 'purple', icons: ['purple'] },
        { label: 'Desert', icon: 'yellow', icons: ['yellow'] },
        { label: 'Landsraad', icon: 'green', icons: ['green'] },
        { label: 'Emperor', icon: 'emperor', icons: ['emperor'] },
        { label: 'Spacing Guild', icon: 'guild', icons: ['guild'] },
        { label: 'Bene Gesserit', icon: 'bene-gesserit', icons: ['bene-gesserit'] },
        { label: 'Fremen', icon: 'fremen', icons: ['fremen'] },
      ]

      return groups.map(g => ({
        ...g,
        spaces: boardSpaces.filter(s => g.icons.includes(s.icon)),
      })).filter(g => g.spaces.length > 0)
    },

    hasControl() {
      return Object.values(this.game.state.controlMarkers).some(v => v != null)
    },

    hasBonusSpice() {
      return Object.values(this.game.state.bonusSpice).some(v => v > 0)
    },

    playerColorMap() {
      const map = {}
      for (const player of this.game.players) {
        map[player.name] = player.color
      }
      return map
    },

    spyPlacementRequest() {
      const owner = this.game.players.byName(this.actor.name)
      const request = this.game.getWaiting(owner)
      if (request && request.title === 'Choose an observation post for your Spy') {
        return request
      }
      return null
    },

    clickablePostIds() {
      if (!this.spyPlacementRequest) {
        return new Set()
      }
      const ids = new Set()
      for (const choice of this.spyPlacementRequest.choices) {
        const name = choice.title || choice
        const match = name.match(/^Post ([A-M])\b/)
        if (match) {
          ids.add(match[1])
        }
      }
      return ids
    },
  },

  mounted() {
    this.updatePostPositions()
  },

  updated() {
    this.$nextTick(() => this.updatePostPositions())
  },

  methods: {
    updatePostPositions() {
      const col = this.$refs.spacesColumn
      if (!col) {
        return
      }

      const colRect = col.getBoundingClientRect()
      const spaceYMap = {}

      col.querySelectorAll('[data-space-id]').forEach(el => {
        const id = el.dataset.spaceId
        const rect = el.getBoundingClientRect()
        // Use center of the first row (space name line), not the full entry with effects
        const row = el.querySelector('.space-row')
        if (row) {
          const rowRect = row.getBoundingClientRect()
          spaceYMap[id] = rowRect.top + rowRect.height / 2 - colRect.top
        }
        else {
          spaceYMap[id] = rect.top + rect.height / 2 - colRect.top
        }
      })

      const positions = []
      for (const post of observationPosts) {
        const spaceYs = post.spaces
          .map(id => spaceYMap[id])
          .filter(y => y != null)
        if (spaceYs.length === 0) {
          continue
        }

        const y = spaceYs.reduce((a, b) => a + b, 0) / spaceYs.length
        positions.push({ id: post.id, y, spaceYs })
      }

      // Only update reactive data if positions actually changed to avoid infinite update loop
      const posKey = positions.map(p => `${p.id}:${Math.round(p.y)}`).join(',')
      if (posKey === this._lastPosKey) {
        return
      }
      this._lastPosKey = posKey

      this.postPositions = positions

      // Set SVG height to match column
      const svg = this.$refs.spyTrack
      if (svg) {
        svg.setAttribute('height', colRect.height)
      }
    },

    postFill(postId) {
      const occupants = this.game.state.spyPosts[postId] || []
      if (occupants.length === 1) {
        return this.playerColorMap[occupants[0]] || '#6a5a48'
      }
      return '#fff'
    },

    postTextFill(postId) {
      const occupants = this.game.state.spyPosts[postId] || []
      if (occupants.length === 1) {
        return '#fff'
      }
      return '#6a5a48'
    },

    postOccupants(postId) {
      return this.game.state.spyPosts[postId] || []
    },

    postOccupantColors(postId) {
      return this.postOccupants(postId).map(name => this.playerColorMap[name] || '#6a5a48')
    },

    isFaction(icon) {
      return factionIds.has(icon)
    },

    describeEffect(effect) {
      const labels = {
        'troop': (e) => `+${e.amount} troop${e.amount > 1 ? 's' : ''}`,
        'draw': (e) => `draw ${e.amount} card${e.amount > 1 ? 's' : ''}`,
        'intrigue': (e) => `+${e.amount} intrigue`,
        'gain': (e) => `+${e.amount} ${e.resource}`,
        'spy': () => '+1 spy',
        'contract': () => '+1 contract',
        'spice-harvest': (e) => e.amount > 0 ? `harvest ${e.amount} spice` : null,
        'sandworm': (e) => `+${e.amount} sandworm${e.amount > 1 ? 's' : ''}`,
        'maker-hook': () => '+1 maker hook',
        'trash-card': () => 'trash a card',
        'steal-intrigue': () => 'steal intrigue (4+ cards)',
        'high-council': () => 'gain High Council seat',
        'sword-master': () => 'gain Swordmaster (3rd agent)',
        'recall-agent': () => 'recall an agent',
        'intrigue-trash-draw': () => 'trash intrigue → draw intrigue',
        'break-shield-wall': () => 'destroy Shield Wall',
        'influence-choice': (e) => `+${e.amount} influence (any faction)`,
      }
      const fn = labels[effect.type]
      return fn ? fn(effect) : effect.type
    },

    describeEffects(effects) {
      if (!effects || effects.length === 0) {
        return []
      }
      const lines = []
      for (const effect of effects) {
        if (effect.type === 'choice') {
          effect.choices.forEach((choice, ci) => {
            const parts = choice.effects.map(e => this.describeEffect(e)).filter(Boolean)
            let line = parts.join(', ')
            if (choice.cost) {
              const costStr = Object.entries(choice.cost).map(([r, a]) => `${a} ${r}`).join(', ')
              line = `pay ${costStr} → ${line}`
            }
            if (choice.requires) {
              line = `with ${choice.requires}: ${line}`
            }
            if (ci > 0) {
              lines.push('  OR')
            }
            lines.push(`· ${line}`)
          })
        }
        else {
          const desc = this.describeEffect(effect)
          if (desc) {
            lines.push(`· ${desc}`)
          }
        }
      }
      return lines
    },

    describeSpace(space) {
      const lines = this.describeEffects(space.effects)
      if (space.isMakerSpace) {
        lines.push('+ bonus spice')
      }
      return lines
    },

    costLabel(space) {
      if (space.dynamicCost === 'sword-master') {
        return '8/6 solari'
      }
      if (!space.cost) {
        return null
      }
      return Object.entries(space.cost)
        .map(([resource, amount]) => `${amount} ${resource}`)
        .join(', ')
    },

    reqLabel(req) {
      const labels = {
        emperor: 'Emp',
        guild: 'Guild',
        'bene-gesserit': 'BG',
        fremen: 'Fremen',
      }
      return `${labels[req.faction] || req.faction} ${req.amount}+`
    },

    clickPost(postId) {
      if (!this.clickablePostIds.has(postId)) {
        return
      }
      const owner = this.game.players.byName(this.actor.name)
      this.bus.emit('user-select-option', {
        actor: owner,
        optionName: `post ${postId}`,
        opts: { prefix: true },
      })
      this.$nextTick(() => {
        this.bus.emit('click-choose-selected-option')
      })
    },

    formatName(id) {
      return id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    },
  },
}
</script>


<style scoped>
.action-spaces {
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.shield-wall-destroyed {
  font-size: .8em;
  color: #c04040;
  font-weight: 400;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: .3em;
  margin-bottom: .5em;
}

.control-chip {
  font-size: .8em;
  background-color: #f5f0e8;
  border: 1px solid #d4c8a8;
  padding: .1em .4em;
  border-radius: .15em;
}

.board-layout {
  display: flex;
  align-items: flex-start;
}

.spy-track {
  width: 30px;
  flex-shrink: 0;
}

.spaces-column {
  flex: 1;
  min-width: 0;
}

.space-group {
  margin-bottom: .5em;
}

.group-label {
  font-weight: 600;
  font-size: .8em;
  text-transform: uppercase;
  padding: .15em .4em;
  border-radius: .15em;
  margin-bottom: .15em;
  color: white;
}

.group-icon { color: white; }
.group-purple { background-color: #6a3d8a; }
.group-yellow { background-color: #b8860b; }
.group-green { background-color: #3a7d3a; }
.group-emperor { background-color: #8b2020; }
.group-guild { background-color: #c07020; }
.group-bene-gesserit { background-color: #5b3a8a; }
.group-fremen { background-color: #2a6090; }

.space-entry {
  border-bottom: 1px solid #e8e0d4;
  padding-bottom: .15em;
  margin-bottom: .15em;
}

.space-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.space-entry.occupied {
  opacity: .45;
}

.space-row {
  display: flex;
  align-items: center;
  gap: .3em;
  padding: .15em .3em;
  font-size: .85em;
}

.space-effects {
  padding-left: 1.3em;
  font-size: .75em;
  color: #6a5a48;
  line-height: 1.3;
}

.effect-line {
  padding-left: .5em;
}

.effect-always {
  margin-top: .15em;
  font-style: italic;
  color: #8a7a68;
}

.space-icon {
  display: inline-block;
  width: .7em;
  height: .7em;
}

.icon-purple { background-color: #6a3d8a; border-radius: 50%; }
.icon-yellow { background-color: #b8860b; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
.icon-green { background-color: #3a7d3a; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }

.space-name {
  flex: 1;
}

.space-occupant {
  font-weight: 600;
  color: #c04040;
  font-size: .85em;
}

.space-cost {
  color: #8a7a68;
  font-size: .8em;
}

.space-combat {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  text-align: center;
  background-color: #c04040;
  color: white;
  border-radius: .15em;
  font-size: .7em;
  font-weight: bold;
}

.space-req {
  color: #6a5a48;
  font-size: .75em;
  font-style: italic;
}

.bonus-amount {
  color: #b8860b;
  font-weight: bold;
}

.clickable-post {
  cursor: pointer;
}

.clickable-post:hover {
  filter: brightness(1.2);
}
</style>
