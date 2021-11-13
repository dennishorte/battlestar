<template>
<div class="skill-check">

  <b-row>
    <b-col class="title-col">

      <div v-show="showTitle" class="heading">
        {{ data.name }}
      </div>

      <div class="skill">
        <div>
          <span class="heading">Skills:</span>

          <span v-for="skill in data.skills" :key="skill">
            <SkillLink :skillName="skill" />
          </span>
        </div>
      </div>

      <div class="outcomes">
        <div class="outcome-group">
          <div class="heading">{{ data.passValue }}+</div>
          <div class="outcome">
            {{ data.passEffect }}
          </div>
        </div>

        <template v-if="data.partialValue">
          <div class="outcome-group">
            <div class="heading">{{ data.partialValue }}+</div>
            <div class="outcome">
              {{ data.partialEffect }}
            </div>
          </div>
        </template>

        <div class="outcome-group">
          <div class="heading">fail</div>
          <div class="outcome">
            {{ data.failEffect }}
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
    data: Object,
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
