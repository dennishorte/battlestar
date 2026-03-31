<template>
  <div class="faction-tracks">
    <div class="section-header">Factions</div>
    <div v-for="faction in factions" :key="faction.id" class="track">
      <div class="track-header" :class="`track-${faction.id}`">
        <span class="faction-label">{{ faction.label }}</span>
        <span class="alliance-holder" v-if="game.state.alliances[faction.id]">
          {{ game.state.alliances[faction.id] }}
        </span>
      </div>

      <div class="track-bar">
        <div v-for="level in 7"
             :key="level - 1"
             class="track-cell"
             :class="{ 'threshold-vp': level - 1 === 2, 'threshold-alliance': level - 1 === 4 }">
          <span class="cell-number">{{ level - 1 }}</span>
          <div class="cell-markers">
            <span v-for="player in playersAtLevel(faction.id, level - 1)"
                  :key="player.name"
                  class="player-marker"
                  :style="{ 'background-color': player.color }"
                  :class="{ 'is-viewer': player.name === actor.name }"
                  :title="player.name">
              {{ player.name[0] }}
            </span>
          </div>
        </div>
      </div>

      <div class="track-legend">
        <span class="legend-item">2: +1 VP</span>
        <span class="legend-item">4: {{ faction.bonus }}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DuneFactionTrack',

  inject: ['actor', 'game'],

  data() {
    return {
      factions: [
        { id: 'emperor', label: 'Emperor', bonus: '+1 Spy' },
        { id: 'guild', label: 'Spacing Guild', bonus: '+3 Solari' },
        { id: 'bene-gesserit', label: 'Bene Gesserit', bonus: '+1 Intrigue' },
        { id: 'fremen', label: 'Fremen', bonus: '+1 Water' },
      ],
    }
  },

  methods: {
    playersAtLevel(faction, level) {
      return this.game.players.all().filter(p => p.getInfluence(faction) === level)
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
  margin-bottom: .4em;
}

.track {
  margin-bottom: .6em;
}

.track:last-child {
  margin-bottom: 0;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .15em .4em;
  border-radius: .15em;
  color: white;
  font-size: .8em;
  font-weight: 600;
}

.track-emperor { background-color: #d03030; }
.track-guild { background-color: #e08828; }
.track-bene-gesserit { background-color: #8855cc; }
.track-fremen { background-color: #3088cc; }

.alliance-holder {
  font-weight: 400;
  font-size: .9em;
  opacity: .9;
}

.track-bar {
  display: flex;
  margin-top: 2px;
}

.track-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #e8e0d4;
  padding: .15em 0;
  min-height: 2em;
}

.track-cell:last-child {
  border-right: none;
}

.threshold-vp {
  background-color: rgba(139, 105, 20, 0.1);
  border-bottom: 2px solid #8b6914;
}

.threshold-alliance {
  background-color: rgba(139, 105, 20, 0.15);
  border-bottom: 2px solid #c09020;
}

.cell-number {
  font-size: .65em;
  color: #8a7a68;
  line-height: 1;
}

.cell-markers {
  display: flex;
  gap: 1px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1px;
}

.player-marker {
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  line-height: 1.3em;
  text-align: center;
  border-radius: 50%;
  font-size: .65em;
  font-weight: bold;
  color: white;
}

.player-marker.is-viewer {
  box-shadow: 0 0 0 2px #2c2416;
}

.track-legend {
  display: flex;
  gap: .75em;
  font-size: .7em;
  color: #8a7a68;
  margin-top: 1px;
  padding-left: .2em;
}
</style>
