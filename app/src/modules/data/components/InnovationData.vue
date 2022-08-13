<template>
  <div class="innovation-data">
    <b-tabs lazy>

      <b-tab title="cards" active>
        <div class="cards-data">
          <div class="card-column" v-for="exp in expansions" :key="exp">
            <InnovationCardSet :expansion="exp" />
          </div>
        </div>
      </b-tab>

      <b-tab title="wins">
        <InnovationWinData />
      </b-tab>

    </b-tabs>
  </div>
</template>


<script>
import InnovationCardSet from './InnovationCardSet'
import InnovationWinData from './InnovationWinData'

export default {
  name: 'InnovationData',

  components: {
    InnovationCardSet,
    InnovationWinData,
  },

  data() {
    return {
      expansions: ['base', 'echo', 'figs', 'city', 'arti'],
    }
  },
}
</script>


<style scoped>
.cards-data {
  display: flex;
  flex-direction: row;
}

.card-column:not(:first-of-type) {
  margin-left: .25em;
}
</style>
