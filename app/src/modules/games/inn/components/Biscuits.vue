<template>
  <div class="biscuits">

    <div class="biscuits-row">
      <div class="biscuits-box-name"></div>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i']"
        :key="biscuit"
        class="biscuits-box">
        {{ biscuit }}
      </div>
    </div>

    <div v-for="player in players" :key="player.name" class="biscuits-row">
      <div class="biscuits-box-name">{{ player.name }}</div>
      <div
        v-for="biscuit in ['k', 'c', 's', 'l', 'f', 'i']"
        :key="biscuit"
        class="biscuits-box">
        {{ biscuits[player.name][biscuit] }}
      </div>
    </div>

  </div>
</template>

<script>


export default {
  name: 'Biscuits',

  inject: ['game'],

  computed: {
    biscuits() {
      return this.game.getBiscuits()
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
