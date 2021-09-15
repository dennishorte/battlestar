<template>
  <b-row class="locations">

    <b-col cols="5">
      <div v-for="area in areas" :key="area">
        <div class="heading">{{ area }}</div>
        <div
          v-for="loc in filtered(area)"
          :key="loc.name"
          @click="selectLocation(loc.name)"
          class="loc-name">
          {{ loc.name }}
        </div>
      </div>
    </b-col>


    <b-col>
      <template v-if="!!selected.name">
        <div class="heading">Name </div>{{ selected.name }}
        <div class="heading">Text</div>
        <div>{{ selected.text }}</div>
        <div v-if="selected.hazardous" class="heading">
          Hazardous!
        </div>
      </template>
    </b-col>

  </b-row>
</template>


<script>
export default {
  name: 'Locations',

  data() {
    return {
      selected: {},
    }
  },

  computed: {
    areas() {
      const accumulator = {}
      for (const loc of this.locations) {
        accumulator[loc.area] = 1
      }
      return Object.keys(accumulator)
    },
    locations() {
      return this.$store.getters['bsg/dataLocations']
    },
  },

  methods: {
    filtered(area) {
      return this.locations
                 .filter(l => l.area === area)
                 .sort((l, r) => l.name.localeCompare(r.name))
    },

    selectLocation(name) {
      this.selected = this.locations.find(l => l.name === name)
    },
  },
}
</script>


<style scoped>
.loc-name {
  margin-left: .5em;
  font-size: .7em;
  line-height: 1.4rem;
}
</style>
