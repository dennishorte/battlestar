<template>
  <div class="decks">
    <div class="decks-row">
      <div class="decks-box"></div>
      <div
        v-for="exp in expansions"
        :key="exp"
        class="decks-box"
        :class="`text-${exp}`">
        {{ exp[0].toUpperCase() }}
      </div>
    </div>

    <div v-for="age in [10,9,8,7,6,5,4,3,2,1]" :key="age" class="decks-row">
      <div class="decks-box">{{ age }}</div>
      <div
        v-for="exp in expansions"
        :key="exp"
        class="decks-box"
        :class="`text-${exp}`">
        {{ game.getZoneByDeck(exp, age).cards().length }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Decks',

  inject: ['game'],

  computed: {
    expansions() {
      return ['arti', 'city', 'figs', 'echo', 'base']
        .filter(exp => this.game.getExpansionList().includes(exp))
    },
  },
}
</script>


<style scoped>
.decks-row {
  display: flex;
  flex-direction: row;
}

.decks-box {
  height: 1.2rem;
  width: 1.5rem;
  text-align: right;
}
</style>
