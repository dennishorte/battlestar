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
        <Players :players="players" />

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
          :players="players"
          :locations="locations.Galactica"
          @move-player="movePlayer">
        </LocationGroup>
      </b-col>

      <b-col>
        <LocationGroup
          name="Colonial One"
          :players="players"
          :locations="locations.ColonialOne"
          @move-player="movePlayer">
        </LocationGroup>

        <LocationGroup
          name="Cylon Locations"
          :players="players"
          :locations="locations.Cylon"
          @move-player="movePlayer">
        </LocationGroup>
      </b-col>

    </b-row>

    <SpaceZone
      @move-space-component="moveSpaceComponent"
      :deployedComponents="deployedComponents"
      />

  </b-container>

</div>
</template>


<script>
import GameLog from './GameLog'
import LocationGroup from './LocationGroup'
import Players from './Players'
import ResourceCounter from './ResourceCounter'
import SpaceZone from './SpaceZone'

import { locations } from '../res.js'

export default {
  name: 'Battlestar',

  components: {
    GameLog,
    LocationGroup,
    Players,
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
        vipers: 6,
        damaged_vipers: 0,

        jump_track: 0,
        boarding_party: 0,
      },

      players: [
        {
          _id: 'asdf',
          index: 0,
          name: 'Dennis',
          character: 'Adama',
          characterShort: 'adama',
          location: "Admiral's Quarters",
          admiral: true,
          president: false,
          active: false,
        },
        {
          _id: 'jkl',
          index: 1,
          name: 'Micah',
          character: 'Starbuck',
          characterShort: 'starbuck',
          location: "Hangar Deck",
          admiral: false,
          president: true,
          active: true,
        },
      ],

      deployedComponents: [
        [],
        [],
        [ 'civilian', 'civilian' ],
        [ 'viper' ],
        [ 'viper' ],
        [ 'basestar', 'raider', 'raider', 'raider' ],
      ],
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

    movePlayer(data) {
      console.log(data)
    },

    moveSpaceComponent(data) {
      console.log(data)
    },
  },
}
</script>


<style>
.adama {
    color: blue;
}

.starbuck {
    color: red;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
}
</style>
