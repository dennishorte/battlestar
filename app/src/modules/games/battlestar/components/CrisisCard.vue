<template>
<div class="crisis-card">
  <div class="heading">
    {{ card.name }}
  </div>

  <div v-if="choice">
    {{ card['who chooses?'] }} Chooses
  </div>

  <div v-if="cylonAttack" class="cylon-attack">
    Cylon Attack!
  </div>

  <div v-if="optionOne" class="option">
    <template v-if="card.type === 'Choice'">
      {{ card['fail effect / choose option 1 / cac effect'] }}
    </template>

    <template v-if="!!card['pass effect']">
      <SkillCheck :card="card" :showTitle="false" />
    </template>
  </div>

  <div v-if="optionTwo" class="option">
    {{ card['choose option 2'] }}
  </div>

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
    card: {}
  },

  data() {
    return {

    }
  },

  computed: {
    choice() {
      console.log(this.card.type)
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
.option {
    border: 1px solid black;
    border-radius: .25em;
    padding: .5em;
}
</style>
