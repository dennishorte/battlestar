<template>
  <b-row class="panel">
    <b-col>
      <div class="heading">Admiral</div>
      <div
        v-for="name in admirals"
        :key="name"
      >
        {{ name }}
      </div>
    </b-col>
    <b-col>
      <div class="heading">President</div>
      <div
        v-for="name in presidents"
        :key="name"
      >
        {{ name }}
      </div>
    </b-col>
  </b-row>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'SetupDistributeTitleCards',

  computed: {
    admirals() {
      const los = (character) => character['admiral line of succession order']
      const characters = util.deepcopy(this.data.filtered.characterCards)
      return characters
        .sort((l, r) => los(l) - los(r))
        .map(c => c.name)
    },
    presidents() {
      const los = (character) => character['president line of succession order']
      const characters = util.deepcopy(this.data.filtered.characterCards)
      return characters
        .sort((l, r) => los(l) - los(r))
        .map(c => c.name)
    },
  },
}
</script>


<style scoped>
.panel {
  border: 1px solid darkgray;
  border-radius: .5em;
  background-color: lightgray;
  font-size: .7em;
}
</style>
