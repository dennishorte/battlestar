<template>
<div class="location-group">
  <div class="locations-heading heading">
    {{ name }}
  </div>

  <b-list-group>
    <b-list-group-item
      @click="visitLocation(loc.name)"
      v-for="loc in locations"
      :key="loc.name">
      {{ loc.name }}
    </b-list-group-item>
  </b-list-group>
</div>
</template>


<script>
export default {
  name: 'LocationGroup',

  props: {
    name: String,
    locations: Array,
  },

  methods: {
    visitLocation(name) {
      this.$emit('visit-location', {
        zone: this.name,
        location: name,
      })
    },
  },
}
</script>
