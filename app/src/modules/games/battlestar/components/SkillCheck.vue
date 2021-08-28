<template>
<div class="skill-check">

  <b-row>
    <b-col class="title-col">

      <div class="heading">
        {{ card.name }}
      </div>

      <div class="skill">
        <div>
          <span class="heading">Skills:</span>

          <template v-for="skill in skillList">
            <span :key="skill" v-if="card[skill]" style="margin-left: .25em;">
              <SkillLink :skillName="skill" />
            </span>
          </template>
        </div>
      </div>

      <div class="outcomes">
        <div class="outcome-group">
          <div class="heading">{{ card['skill check value'] }}+</div>
          <div class="outcome">
            {{ card['pass effect'] }}
          </div>
        </div>

        <template v-if="card['partial pass value']">
          <div class="outcome-group">
            <div class="heading">{{ card['partial pass value'] }}+</div>
            <div class="outcome">
              {{ card['partial pass effect'] }}
            </div>
          </div>
        </template>

        <div class="outcome-group">
          <div class="heading">fail</div>
          <div class="outcome">
            {{ card['fail effect / choose option 1 / cac effect'] }}
          </div>
        </div>
      </div>

    </b-col>
  </b-row>

</div>
</template>


<script>
import SkillLink from './SkillLink'

import crisisCards from '../res/crisis.js'
import { skillList } from '../util.js'

export default {
  mounted() {
    this.$store.commit('bsg/beginSkillCheck', crisisCards[50])
  },

  name: 'SkillCheck',

  components: {
    SkillLink,
  },

  data() {
    return {
      skillList,
    }
  },

  computed: {
    card() {
      return this.$store.state.bsg.game.skillCheck.active.card
    },
  },
}
</script>


<style scoped>
.heading {
    min-width: 3em;
}

.outcome-group {
    display: flex;
    flex-direction: row;
}

.skill-check {
    border: 1px solid #aaa;
    border-radius: .5em;
    padding: .25em;
    background: #ddd;
}

ul {
    margin-left: .5em;
    margin-bottom: 0;
}
</style>
