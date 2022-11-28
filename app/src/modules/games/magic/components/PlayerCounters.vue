<template>
  <div class="player-counters">
    <div v-for="[name, count] in Object.entries(player.counters)" class="counter">
      <div class="counter-text">
        {{ name }}: {{ count }}
      </div>

      <div class="counter-buttons">
        <i class="bi bi-dice-5-fill counter-green" @click="increment(name, 5)"></i>
        <i class="bi bi-dice-1-fill counter-green" @click="increment(name, 1)"></i>
        <i class="bi bi-dice-1-fill counter-red" @click="increment(name, -1)"></i>
        <i class="bi bi-dice-5-fill counter-red" @click="increment(name, -5)"></i>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'TableauZone',

  inject: ['actor', 'do', 'game'],

  props: {
    player: Object,
  },

  methods: {
    increment(name, count) {
      const actorPlayer = this.game.getPlayerByName(this.actor.name)
      this.do(actorPlayer, {
        name: 'adjust counter',
        playerName: this.player.name,
        counter: name,
        amount: count,
      })
    },
  },
}
</script>


<style scoped>
.counter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.counter-buttons {
  font-size: .9em;
}

.bi:not(:first-of-type) {
  margin-left: 2px;
}

.counter-green {
  color: green;
}

.counter-red {
  color: red;
}
</style>
