<template>
<div class="crisis-card">
  <div class="heading">
    {{ card.name }}
  </div>

  <div v-if="choice">
    {{ card['who chooses?'] }} chooses
  </div>

  <div v-if="cylonAttack" class="cylon-attack">
    Cylon Attack!
  </div>

  <b-list-group>
    <b-list-group-item v-if="card.type === 'Choice'">
      {{ card['fail effect / choose option 1 / cac effect'] }}
    </b-list-group-item>

    <b-list-group-item v-else-if="!!card['pass effect']">
      <SkillCheck :card="card" :showTitle="false" />
    </b-list-group-item>

    <b-list-group-item v-if="optionTwo" class="option">
      {{ card['choose option 2'] }}
    </b-list-group-item>
  </b-list-group>


  <div v-if="!!card.consequence" class="consequence">
    {{ card.consequence }}
  </div>

  <div>
    <span class="heading">Cylon Activation:</span> {{ card['cylon activation'] }}
  </div>

  <div>
    <span class="heading">Advance Jump:</span> {{ card['jump track?'] }}
  </div>
</div>
</template>


<script>
import SkillCheck from './SkillCheck'

export default {
  name: 'CrisisCard',

  components: {
    SkillCheck,
  },

  props: {
    card: Object,
  },

  computed: {
    choice() {
      return this.card.type === "Optional Skill Check" || this.card.type === "Choice"
    },
    cylonAttack() {
      return this.card.type === "Cylon Attack"
    },
    optionOne() {
      return this.choice || this.card.type === "Skill Check"
    },
    optionTwo() {
      return this.choice
    }
  },

  methods: {
  },
}
</script>


<style scoped>
.crisis-card {
    border: 1px solid #aaa;
    border-radius: .5em;
    padding: .25em;
    background-color: #ddd;
}

.list-group-item {
    background-color: #eee;
}
</style>
