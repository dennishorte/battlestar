<template>
<div class="battlestar">
  Battlestar Galactica

  <b-container fluid>
    <b-row>

      <b-col>
        <div class="resources">
          <div class="heading">
            Resources
          </div>

          <div class="resources-counters">
            <ResourceCounter
              @resource-changed="resourceChanged"
              :value="resources.food">
              Food
            </ResourceCounter>

            <ResourceCounter
              @resource-changed="resourceChanged"
              :value="resources.fuel">
              Fuel
            </ResourceCounter>

            <ResourceCounter
              @resource-changed="resourceChanged"
              :value="10">
              Morale
            </ResourceCounter>

            <ResourceCounter
              @resource-changed="resourceChanged"
              :value="12">
              Population
            </ResourceCounter>
          </div>
        </div>
      </b-col>

      <b-col>
        <LocationGroup
          name="Galactica"
          :locations="locations.Galactica"
          @visit-location="visitLocation">
        </LocationGroup>
      </b-col>

      <b-col>
        <LocationGroup
          name="Colonial One"
          :locations="locations.ColonialOne"
          @visit-location="visitLocation">
        </LocationGroup>

        <LocationGroup
          name="Cylon Locations"
          :locations="locations.Cylon"
          @visit-location="visitLocation">
        </LocationGroup>
      </b-col>

    </b-row>
  </b-container>

</div>
</template>


<script>
import LocationGroup from './LocationGroup'
import ResourceCounter from './ResourceCounter'
import { locations } from '../res.js'

export default {
  name: 'Battlestar',

  components: {
    LocationGroup,
    ResourceCounter,
  },

  data() {
    return {
      locations: locations,
      resources: {
        food: 8,
        fuel: 8,
        morale: 10,
        population: 12,
      },
    }
  },

  methods: {
    resourceChanged({ name, amount }) {
      name = name.trim().toLowerCase()
      this.resources[name] += amount
      this.resources[name] = Math.max(0, this.resources[name])
      this.resources[name] = Math.min(15, this.resources[name])
    },

    visitLocation(name) {
      console.log(name)
    },
  },
}
</script>
