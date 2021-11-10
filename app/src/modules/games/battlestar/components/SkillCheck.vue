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

          <span v-for="skill in card.skills" :key="skill">
            <SkillLink :skillName="skill" />
          </span>
        </div>
      </div>

      <div class="outcomes">
        <div class="outcome-group">
          <div class="heading">{{ card.passValue }}+</div>
          <div class="outcome">
            {{ card.passEffect }}
          </div>
        </div>

        <template v-if="card.partialValue">
          <div class="outcome-group">
            <div class="heading">{{ card.partialValue }}+</div>
            <div class="outcome">
              {{ card.partialEffect }}
            </div>
          </div>
        </template>

        <div class="outcome-group">
          <div class="heading">fail</div>
          <div class="outcome">
            {{ card.failEffect }}
          </div>
        </div>
      </div>

    </b-col>
  </b-row>

</div>
</template>


<script>
import SkillLink from './SkillLink'

import { bsg } from 'battlestar-common'

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
      skillList: bsg.util.skillList,
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
