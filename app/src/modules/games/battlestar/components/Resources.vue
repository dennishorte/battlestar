<template>
  <b-row class="resources">
    <b-col class="resources">
      <div class="heading">
        Resources
      </div>

      <div class="resources-counters">
        <ResourceCounter
          title="Food"
          name="food" />

        <ResourceCounter
          title="Fuel"
          name="fuel" />

        <ResourceCounter
          title="Morale"
          name="morale" />

        <ResourceCounter
          title="Population"
          name="population" />

        <ResourceCounter
          title="Raptors"
          name="raptors" />

        <ResourceCounter
          title="Nukes"
          name="nukes" />
      </div>
    </b-col>

    <b-col>
      <div class="heading">Tracks</div>

      <div class="resources jump-track">
        <ResourceCounter
          title="Distance Traveled"
          name="distance" />

        <ResourceCounter
          title="Jump Track"
          name="jumpTrack"
          notes="0 = start, 3 = -3 pop, 4 = -1 pop, 5 = auto" />
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
}
</script>


<style scoped>
</style>
