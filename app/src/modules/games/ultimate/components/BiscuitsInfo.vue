<template>
  <div class="biscuits">

    <div class="biscuits-row">
      <div class="biscuits-box-name"/>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i', 'p']"
        :key="biscuit"
        class="biscuits-box">
        <CardBiscuit :biscuit="biscuit" />
      </div>
      <div class="biscuits-box extra-space"><CardBiscuit biscuit="1" /></div>
      <div class="biscuits-box extra-space"><CardBiscuit biscuit=":" /></div>
    </div>

    <div v-for="player in players" :key="player.name" class="biscuits-row">
      <div class="biscuits-box-name">{{ player.name }}</div>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i', 'p']"
        :key="biscuit"
        class="biscuits-box">
        {{ biscuits[player.name][biscuit] }}
      </div>
      <div class="biscuits-box extra-space">{{ scores[player.name] }}</div>
      <div class="biscuits-box extra-space">{{ achievements[player.name] }}</div>
    </div>

  </div>
</template>

<script>
import CardBiscuit from './CardBiscuit'

export default {
  name: 'BiscuitsInfo',

  components: {
    CardBiscuit,
  },

  inject: ['actor', 'game'],

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
      const viewer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewer)
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

.extra-space {
  margin-left: .5em;
}

.biscuits-box-name {
  width: 3.5em;
  overflow: hidden;
}
</style>
