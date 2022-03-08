<template>
  <div class="decks">

    <b-row v-if="doubleColumn">
      <b-col lg="auto">
        <div v-for="age in [10,9,8,7,6]" :key="age" class="decks-row">
          <div class="decks-box">
            <div class="age-box">{{ age }}</div>
          </div>
          <div
            v-for="exp in expansions"
            :key="exp"
            class="decks-box"
            :class="`text-${exp}`">
            {{ game.getZoneByDeck(exp, age).cards().length }}
          </div>
        </div>
      </b-col>

      <b-col lg="auto">
        <div v-for="age in [5,4,3,2,1]" :key="age" class="decks-row">
          <div class="decks-box">
            <div class="age-box">{{ age }}</div>
          </div>
          <div
            v-for="exp in expansions"
            :key="exp"
            class="decks-box"
            :class="`text-${exp}`">
            {{ game.getZoneByDeck(exp, age).cards().length }}
          </div>
        </div>
      </b-col>
    </b-row>

    <div v-else>
      <div v-for="age in [10,9,8,7,6,5,4,3,2,1]" :key="age" class="decks-row">
        <div class="decks-box">
          <div class="age-box">{{ age }}</div>
        </div>
        <div
          v-for="exp in expansions"
          :key="exp"
          class="decks-box"
          :class="`text-${exp}`">
          {{ game.getZoneByDeck(exp, age).cards().length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Decks',

  inject: ['game'],

  computed: {
    doubleColumn() {
      return this.expansions.length < 3
    },

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
  margin-bottom: 1px;
  padding-right: 4px;
}

.age-box {
  padding: 0;
  color: white;
  background-color: #bba37a;
  text-align: center;
}
</style>
