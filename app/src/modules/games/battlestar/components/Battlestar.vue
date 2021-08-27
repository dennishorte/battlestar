<template>
<div class="battlestar">
  Battlestar Galactica

  <b-container fluid>
    <b-row>
      <b-col>
        <div class="action-buttons">
          <b-button variant="outline-danger" @click="passPriority">pass</b-button>
          <b-button variant="outline-warning" @click="undo">undo</b-button>
          <b-dropdown variant="primary" text="menu">
            <b-dropdown-item @click="$bvModal.show('characters-modal')">
              Characters
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <GameLog />
      </b-col>

      <b-col>
        <Players />

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
          :locations="locationsGalactica"
          @player-move="playerMove">
        </LocationGroup>
      </b-col>

      <b-col>
        <LocationGroup
          name="Colonial One"
          :locations="locationsColonialOne"
          @player-move="playerMove">
        </LocationGroup>

        <LocationGroup
          name="Cylon Locations"
          :locations="locationsCylonLocations"
          @player-move="playerMove">
        </LocationGroup>
      </b-col>

    </b-row>

    <SpaceZone
      @space-component-move="spaceComponentMove"
      @space-component-remove="spaceComponentRemove"
      @space-components-clear="spaceComponentsClear"
      />

  </b-container>

  <CharactersModal
    :characters="charactersAvailable"
    @character-assign="characterAssign"
    />

  <HoldingMessage />

</div>
</template>


<script>
import CharactersModal from './CharactersModal'
import GameLog from './GameLog'
import HoldingMessage from './HoldingMessage'
import LocationGroup from './LocationGroup'
import Players from './Players'
import ResourceCounter from './ResourceCounter'
import SpaceZone from './SpaceZone'

import characters from '../res/character.js'
import locations from '../res/location.js'


function locationCompare(l, r) {
  if (l.hazardous && !r.hazardous) {
    return 1
  }
  else if (!l.hazardous && r.hazardous) {
    return -1
  }
  else {
    return l.name.localeCompare(r.name)
  }
}

/*
  TODO (dennis): Locations are often replaced with updated versions in expansions.
  It is important that this handles the case of duplicate locations correctly when
  expansions become supported.
 */
function locationFilter(locations, expansions, area) {
  const passOne = locations
    .filter(x => x.area === area)
    .filter(x => expansions.includes(x.expansion))
    .sort(locationCompare)

  return passOne
}


export default {
  name: 'Battlestar',

  components: {
    CharactersModal,
    GameLog,
    HoldingMessage,
    LocationGroup,
    Players,
    ResourceCounter,
    SpaceZone,
  },

  data() {
    return {
      // Constant Data
      characters,
      locations,

      // Game state that should be serialized
      settings: {
        expansions: ['base game'],
      },

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

    }
  },

  computed: {
    charactersAvailable() {
      return this.characters
        .filter(c => this.settings.expansions.includes(c.expansion))
        .sort((l, r) => l.name.localeCompare(r.name))
    },
    locationsColonialOne() {
      return locationFilter(this.locations, this.settings.expansions, 'Colonial One')
    },
    locationsCylonLocations() {
      return locationFilter(this.locations, this.settings.expansions, 'Cylon Locations')
    },
    locationsGalactica() {
      return locationFilter(this.locations, this.settings.expansions, 'Galactica')
    }
  },

  methods: {
    characterAssign(data) {
      console.log('characterAssign', data)
    },

    passPriority() {
      console.log('pass priority')
    },

    playerMove(data) {
      console.log('playerMove', data)
    },

    resourceChanged({ name, amount }) {
      name = name.trim().toLowerCase().replace(' ', '_')
      this.counters[name] += amount
      this.counters[name] = Math.max(0, this.counters[name])
      this.counters[name] = Math.min(15, this.counters[name])
    },

    spaceComponentsClear() {
      console.log('spaceComponentsClear')
    },

    spaceComponentMove(data) {
      console.log('spaceComponentMove', data)
    },

    spaceComponentRemove(data) {
      console.log('spaceComponentRemove', data)
    },

    undo() {
      console.log('undo')
    },
  },
}

// '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
</script>


<style>
.chief-galen-tyrol {
    color: #e6194b;
}

.gaius-baltar {
    color: #3cb44b;
}

.kara-starbuck-thrace {
    color: #ffe119;
}

.karl-helo-agathon {
    color: #4363d8;
}

.laura-roslin {
    color: #f58231;
}

.lee-apollo-adama {
    color: #911eb4;
}

.saul-tigh {
    color: #46f0f0;
}

.sharon-boomer-valerii {
    color: #f032e6;
}

.tom-zarek {
    color: #bcf60c;
}

.william-adama {
    color: #fabebe;
}

.d-none {
    display: none;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
}

.heading {
    font-weight: bold;
}
</style>
