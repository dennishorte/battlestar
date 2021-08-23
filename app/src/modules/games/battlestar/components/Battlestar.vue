<template>
<div class="battlestar">
  Battlestar Galactica

  <b-container fluid>
    <b-row>
      <b-col>
        <div class="action-buttons">
          <b-button variant="warning" @click="undo">undo</b-button>
          <b-button variant="outline-primary" @click="passPriority">pass</b-button>
        </div>

        <GameLog />
      </b-col>

      <b-col>
        <div class="players">
          <div class="heading">
            Players
          </div>

          <b-list-group>
            <b-list-group-item>Dennis</b-list-group-item>
            <b-list-group-item>Micah</b-list-group-item>
          </b-list-group>
        </div>

        <div class="resources">
          <div class="heading">
            Resources
          </div>

          <div class="resources-counters">
            <ResourceCounter
              @resource-changed="resourceChanged"
              name="Food"
              :value="counters.food" />

            <ResourceCounter
              @resource-changed="resourceChanged"
              name="Fuel"
              :value="counters.fuel" />

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
              :value="counters.raptors" />

            <ResourceCounter
              @resource-changed="resourceChanged"
              name="Vipers"
              :value="counters.vipers" />

            <ResourceCounter
              @resource-changed="resourceChanged"
              name="Damaged Vipers"
              :value="counters.damaged_vipers" />
          </div>
        </div>

        <div class="resources jump-track">
          <ResourceCounter
            @resource-changed="resourceChanged"
            name="Jump Track"
            notes="0 = start, 3 = -3 pop, 4 = -1 pop, 5 = auto"
            :value="counters.jump_track" />
        </div>

        <div class="resources boarding-party">
          <ResourceCounter
            @resource-changed="resourceChanged"
            name="Boarding Party"
            notes="1 = start, 5 = death"
            :value="counters.boarding_party" />
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

    <SpaceZone />

  </b-container>

</div>
</template>


<script>
import GameLog from './GameLog'
import LocationGroup from './LocationGroup'
import ResourceCounter from './ResourceCounter'
import SpaceZone from './SpaceZone'

import { locations } from '../res.js'

export default {
  name: 'Battlestar',

  components: {
    GameLog,
    LocationGroup,
    ResourceCounter,
    SpaceZone,
  },

  data() {
    return {
      locations: locations,
      counters: {
        food: 8,
        fuel: 8,
        morale: 10,
        population: 12,

        raptors: 4,
        vipers: 8,
        damaged_vipers: 0,

        jump_track: 0,
        boarding_party: 0,
      },
    }
  },

  methods: {
    passPriority() {
      console.log('pass priority')
    },

    resourceChanged({ name, amount }) {
      name = name.trim().toLowerCase().replace(' ', '_')
      this.counters[name] += amount
      this.counters[name] = Math.max(0, this.counters[name])
      this.counters[name] = Math.min(15, this.counters[name])
    },

    undo() {
      console.log('undo')
    },

    visitLocation(name) {
      console.log(name)
    },
  },
}
</script>


<style>
.action-buttons {
    display: flex;
    justify-content: space-between;
}

.space-zone {
    background: #abd;
    margin-top: 4px;
}
</style>
