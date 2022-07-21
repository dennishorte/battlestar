<template>
  <div class="biscuits">

    <div class="biscuits-row">
      <div class="biscuits-box-name"></div>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i']"
        :key="biscuit"
        class="biscuits-box">
        <CardBiscuit :biscuit="biscuit" />
      </div>
      <div class="biscuits-box"><CardBiscuit biscuit="1" /></div>
      <div class="biscuits-box">A</div>
    </div>

    <div v-for="player in players" :key="player.name" class="biscuits-row">
      <div class="biscuits-box-name">{{ player.name }}</div>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i']"
        :key="biscuit"
        class="biscuits-box">
        {{ biscuits[player.name][biscuit] }}
      </div>
      <div class="biscuits-box">{{ scores[player.name] }}</div>
      <div class="biscuits-box">{{ achievements[player.name] }}</div>
    </div>

  </div>
</template>

<script>
import CardBiscuit from './CardBiscuit'

export default {
  name: 'Biscuits',

  components: {
    CardBiscuit,
  },

  inject: ['game'],

  computed: {
    achievements() {
      const achievements = {}
      this.players.forEach(p => achievements[p.name] = this.game.getAchievementsByPlayer(p).total)
      return achievements
    },

    biscuits() {
      return this.game.getBiscuits()
    },

    scores() {
      const scores = {}
      this.players.forEach(p => scores[p.name] = this.game.getScore(p))
      return scores
    },

    players() {
      const viewer = this.game.getPlayerByName(this.game.viewerName)
      return this.game.getPlayersStarting(viewer)
    },
  },
}
</script>


<style scoped>
.biscuits-row {
  display: flex;
  flex-direction: row;
}

.biscuits-box {
  height: 1.2em;
  width: 1.5em;
  text-align: center;
}

.biscuits-box-name {
  width: 3.5rem;
}
</style>
