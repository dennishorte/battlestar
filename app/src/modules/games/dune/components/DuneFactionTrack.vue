<template>
  <div class="faction-tracks">
    <div class="section-header">Factions</div>
    <table class="track-table">
      <thead>
        <tr>
          <th/>
          <th v-for="player in players"
              :key="player.name"
              :style="{ 'border-bottom-color': player.color }"
              class="player-col"
              :class="{ 'is-viewer': player.name === actor.name }">
            {{ player.name }}
          </th>
          <th class="alliance-col">Alliance</th>
          <th class="bonus-col">4 Bonus</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="faction in factions" :key="faction.id" class="faction-row">
          <td class="faction-label" :class="`label-${faction.id}`">
            <DuneFactionIcon :faction="faction.id" size="1em" />
            {{ faction.short }}
          </td>
          <td v-for="player in players" :key="player.name" class="influence-cell">
            <span class="influence-val"
                  :class="levelClass(player.getInfluence(faction.id))">
              {{ player.getInfluence(faction.id) }}
            </span>
          </td>
          <td class="alliance-cell">
            <span v-if="game.state.alliances[faction.id]" class="alliance-name">
              {{ game.state.alliances[faction.id] }}
            </span>
            <span v-else class="alliance-empty">—</span>
          </td>
          <td class="bonus-cell">{{ faction.bonus }}</td>
        </tr>
      </tbody>
    </table>
    <div class="track-footnote">2 = +1 VP · 4 = alliance + bonus</div>
  </div>
</template>


<script>
import DuneFactionIcon from './DuneFactionIcon.vue'

export default {
  name: 'DuneFactionTrack',

  components: {
    DuneFactionIcon,
  },

  inject: ['actor', 'game'],

  data() {
    return {
      factions: [
        { id: 'emperor', short: 'Emp', bonus: 'Spy' },
        { id: 'guild', short: 'Guild', bonus: '3 sol' },
        { id: 'bene-gesserit', short: 'BG', bonus: 'Intrigue' },
        { id: 'fremen', short: 'Fremen', bonus: 'Water' },
      ],
    }
  },

  computed: {
    players() {
      return this.game.players.all()
    },
  },

  methods: {
    levelClass(level) {
      if (level >= 4) {
        return 'level-alliance'
      }
      if (level >= 2) {
        return 'level-vp'
      }
      return ''
    },
  },
}
</script>


<style scoped>
.faction-tracks {
  margin: .5em 0;
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
}

.section-header {
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.track-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .85em;
}

.track-table th {
  font-weight: 600;
  padding: .15em .3em;
  text-align: center;
  font-size: .85em;
  color: #4a3a20;
}

.player-col {
  border-bottom: 3px solid transparent;
}

.player-col.is-viewer {
  font-weight: 700;
}

.alliance-col {
  color: #8a7a68;
  font-weight: 400;
  font-size: .8em;
}

.faction-label {
  display: flex;
  align-items: center;
  gap: .25em;
  font-weight: 600;
  padding: .2em .3em;
  font-size: .85em;
  white-space: nowrap;
}

.label-emperor { color: #d03030; }
.label-guild { color: #c07020; }
.label-bene-gesserit { color: #8855cc; }
.label-fremen { color: #3088cc; }

.influence-cell {
  text-align: center;
  padding: .15em .2em;
}

.influence-val {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  text-align: center;
  border-radius: .2em;
  font-weight: 700;
  color: #6a5a48;
  background-color: #f5f0e8;
}

.influence-val.level-vp {
  background-color: #e8dcc0;
  color: #6a5010;
}

.influence-val.level-alliance {
  background-color: #8b6914;
  color: white;
}

.alliance-cell {
  text-align: center;
  padding: .15em .2em;
  font-size: .85em;
}

.alliance-name {
  color: #8b6914;
  font-weight: 600;
}

.alliance-empty {
  color: #ccc;
}

.bonus-col {
  color: #8a7a68;
  font-weight: 400;
  font-size: .8em;
}

.bonus-cell {
  font-size: .75em;
  color: #8a7a68;
  padding: .15em .3em;
  text-align: center;
}

.track-footnote {
  font-size: .7em;
  color: #8a7a68;
  margin-top: .2em;
}
</style>
