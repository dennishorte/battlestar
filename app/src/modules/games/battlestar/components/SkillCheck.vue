<template>
<div class="skill-check">

  <b-row>
    <b-col class="title-col">

      <div v-show="showTitle" class="heading">
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

import { skillList } from '../lib/util.js'

export default {
  name: 'SkillCheck',

  components: {
    SkillLink,
  },

  props: {
    card: Object,
    showTitle: Boolean,
  },

  data() {
    return {
      skillList,
    }
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
</style>
