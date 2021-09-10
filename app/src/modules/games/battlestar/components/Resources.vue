<template>
  <b-row class="resources">
    <b-col class="resources">
      <div class="heading">
        Resources
      </div>

      <div class="resources-counters">
        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Food"
          name="food"
          :value="food" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Fuel"
          name="fuel"
          :value="fuel" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Morale"
          name="morale"
          :value="morale" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Population"
          name="population"
          :value="population" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Nukes"
          name="nukes"
          :value="nukes" />
      </div>
    </b-col>

    <b-col>
      <div class="heading">Tracks</div>

      <div class="resources jump-track">
        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Jump Track"
          name="jumpTrack"
          notes="0 = start, 3 = -3 pop, 4 = -1 pop, 5 = auto"
          :value="jumpTrack" />
      </div>

      <div class="resources boarding-party">
        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Boarding Party A"
          :value="0" />
        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Boarding Party B"
          :value="0" />
        <ResourceCounter
          @resource-changed="resourceChanged"
          title="Boarding Party C"
          notes="1 = start, 5 = death"
          :value="0" />
      </div>
    </b-col>
  </b-row>
</template>


<script>
import ResourceCounter from './ResourceCounter'

export default {
  name: 'Resources',

  components: {
    ResourceCounter,
  },

  computed: {
    food() { return this.$store.getters['bsg/countersFood'] },
    fuel() { return this.$store.getters['bsg/countersFuel'] },
    morale() { return this.$store.getters['bsg/countersMorale'] },
    population() { return this.$store.getters['bsg/countersPopulation'] },
    nukes() { return this.$store.getters['bsg/countersNukes'] },
    jumpTrack() { return this.$store.getters['bsg/countersJumpTrack'] },
  },

  methods: {
    resourceChanged(data) {
      this.$store.commit('bsg/resourceChange', data)
    },
  },
}
</script>


<style scoped>
</style>
