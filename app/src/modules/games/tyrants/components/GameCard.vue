<template>
  <div class="game-card" @click="toggleExpand">
    <div class="header">
      <div class="name">{{ card.name }}</div>
      <div class="cost" v-if="showCost">{{ cost }}</div>
    </div>

    <div v-if="expanded" class="details">
      <div class="type-line">
        <div class="race">{{ card.race }}</div>
        <div class="aspect">{{ card.aspect }}</div>
        <div class="points">
          <div class="deck-vp">{{ card.points }}</div> /
          <div class="inner-vp">{{ card.innerPoints }}</div>
        </div>
      </div>

      <div class="text">
        <div v-for="(line, index) in card.text" :key="index">
          {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'GameCard',

  props: {
    card: Object,
    expandedIn: {
      type: Boolean,
      default: false,
    },
    showCost: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expanded: this.expandedIn,
    }
  },

  computed: {
    cost() {
      return this.card.cost < 0 ? '-' : this.card.cost
    },
  },

  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    },
  }
}
</script>


<style scoped>
.game-card {
  border: 1px solid #3b2345;
  margin: 1px 0;
  padding: 4px;

  color: #eee1f2;
  background-color: #78498c;

  border-radius: 3px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cost {
  height: 1.7em;
  width: 1.7em;
  border: 2px solid #eee1f2;
  border-radius: 50%;
  font-size: .9em;
  text-align: center;
}

.type-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: .8em;
}

.points {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.text {
  color: black;
  background-color: #ebd3f5;
  padding: 3px;
  border-radius: 2px;
}
</style>
