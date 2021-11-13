<template>
  <div class="crisis-card">
    <div class="heading" style="border-bottom: 1px solid darkgray;">
      {{ card.name }} {{ superCrisisMemo }}
    </div>

    <div v-if="!cylonAttack">
      <div v-if="choice">
        {{ card.actor }} chooses
      </div>

      <b-list-group>
        <b-list-group-item v-if="card.type === 'Choice'">
          {{ card.option1 }}
        </b-list-group-item>

        <b-list-group-item v-else-if="!!card.passEffect">
          <SkillCheck :data="card" :showTitle="false" />
        </b-list-group-item>

        <b-list-group-item v-if="optionTwo" class="option">
          {{ card.option2 }}
        </b-list-group-item>
      </b-list-group>


      <div v-if="!!card.consequence" class="consequence">
        {{ card.consequence }}
      </div>
    </div>

    <div v-if="!isSuperCrisis">
      <span class="heading">Cylon Activation:</span> {{ card.cylonActivation }}
    </div>

    <div v-if="!cylonAttack && !isSuperCrisis">
      <span class="heading">Advance Jump:</span> {{ card.jumpTrack }}
    </div>

    <div v-if="cylonAttack" class="cylon-attack">

      <b-row>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[1]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[2]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[0]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[3]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[5]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
        <b-col>
          <div class="deploy">
            <div v-for="(ship, index) in card.deploy[5]" :key="index">{{ ship }}</div>
          </div>
        </b-col>
      </b-row>

      <div>
        {{ card.effect }}
      </div>
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
    isSuperCrisis() {
      return this.card.cylonActivation === ''
    },
    optionOne() {
      return this.choice || this.card.type === "Skill Check"
    },
    optionTwo() {
      return this.choice
    },
    superCrisisMemo() {
      if (this.isSuperCrisis) {
        return '(super crisis)'
      }
      else {
        return ''
      }
    },
  },

  methods: {
    sectorName(index) {
      if (index === 0) return 'Front'
      if (index === 1) return 'Upper Left'
      if (index === 2) return 'Upper Right'
      if (index === 3) return 'Back'
      if (index === 4) return 'Lower Right'
      if (index === 5) return 'Lower Left'
      return 'error'
    },
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

.deploy {
  border: 1px solid darkgray;
  border-radius: .25em;
  background-color: #eee;
  padding-left: .5em;
  height: 100%;
}

.list-group-item {
  background-color: #eee;
}
</style>
