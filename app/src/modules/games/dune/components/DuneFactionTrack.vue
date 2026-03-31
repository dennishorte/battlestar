<template>
  <div class="faction-tracks">
    <div class="section-header">Factions</div>
    <div class="tracks">
      <div v-for="faction in factions"
           :key="faction"
           class="track"
           :class="`track-${faction}`">
        <div class="faction-label">{{ factionLabel(faction) }}</div>
        <div class="faction-players">
          <span v-for="player in players"
                :key="player.name"
                class="player-influence"
                :style="{ color: player.color }">
            {{ player.name[0] }}:{{ player.getInfluence(faction) }}
          </span>
        </div>
        <div class="alliance" v-if="game.state.alliances[faction]">
          alliance: {{ game.state.alliances[faction] }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DuneFactionTrack',

  inject: ['game'],

  data() {
    return {
      factions: ['emperor', 'guild', 'bene-gesserit', 'fremen'],
    }
  },

  computed: {
    players() {
      return this.game.players.all()
    },
  },

  methods: {
    factionLabel(faction) {
      const labels = {
        emperor: 'Emperor',
        guild: 'Spacing Guild',
        'bene-gesserit': 'Bene Gesserit',
        fremen: 'Fremen',
      }
      return labels[faction] || faction
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

.tracks {
  display: flex;
  flex-direction: column;
  gap: .3em;
}

.track {
  display: flex;
  align-items: center;
  gap: .5em;
  padding: .2em .4em;
  border-radius: .2em;
  font-size: .85em;
}

.track-emperor { background-color: rgba(139, 32, 32, 0.12); }
.track-guild { background-color: rgba(192, 112, 32, 0.12); }
.track-bene-gesserit { background-color: rgba(91, 58, 138, 0.12); }
.track-fremen { background-color: rgba(42, 96, 144, 0.12); }

.faction-label {
  font-weight: 600;
  min-width: 6em;
  color: #2c2416;
}

.faction-players {
  display: flex;
  gap: .5em;
}

.player-influence {
  font-weight: bold;
}

.alliance {
  font-size: .8em;
  color: #8b6914;
  font-style: italic;
}
</style>
