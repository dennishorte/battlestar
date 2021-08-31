<template>
  <div class="resources">
    <div class="resources">
      <div class="heading">
        Resources
      </div>

      <div class="resources-counters">
        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Food"
          :value="6" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Fuel"
          :value="8" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Morale"
          :value="10" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Population"
          :value="12" />
      </div>
    </div>

    <div class="resources fighter-bay">
      <div class="heading">
        Hangar
      </div>

      <div class="resources-counters">
        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Raptors"
          :value="4" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Vipers"
          :value="6" />

        <ResourceCounter
          @resource-changed="resourceChanged"
          name="Dmgd Vipers"
          :value="0" />
      </div>
    </div>

    <div class="resources jump-track">
      <ResourceCounter
        @resource-changed="resourceChanged"
        name="Jump Track"
        notes="0 = start, 3 = -3 pop, 4 = -1 pop, 5 = auto"
        :value="0" />
    </div>

    <div class="resources boarding-party">
      <ResourceCounter
        @resource-changed="resourceChanged"
        name="Boarding Party"
        notes="1 = start, 5 = death"
        :value="0" />
    </div>
  </div>
</template>


<script>
import ResourceCounter from './ResourceCounter'

export default {
  name: 'Resources',

  components: {
    ResourceCounter,
  },

  methods: {
    resourceChanged() {
      //
    },
  },
}
</script>


<style scoped>
</style>
