<template>
  <div class="battlestar">

    <b-container fluid>
      <b-row>
        <b-col class="title-bar">
          <div>
            Battlestar Galactica
          </div>

          <div>
            <router-link to="/">home</router-link>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="action-buttons">
            <b-button variant="success" v-b-modal.game-log-modal>log</b-button>
            <b-button variant="outline-danger" @click="passPriority">pass</b-button>
            <b-button variant="outline-warning" @click="undo">undo</b-button>

            <b-dropdown variant="primary" text="info" right>
              <b-dropdown-item @click="$bvModal.show('characters-modal')">
                Characters
              </b-dropdown-item>
              <b-dropdown-item @click="$bvModal.show('skill-cards-modal')">
                Skill Cards
              </b-dropdown-item>
            </b-dropdown>

          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <CrisisCard :card="crisisCards[44]" />
        </b-col>
      </b-row>

      <b-row>

        <b-col cols="6" md="3">
          <Players />
        </b-col>

        <b-col cols="6" md="3">
          <Resources />
        </b-col>

        <b-col cols="6" md="3">
          <LocationGroup
            name="Galactica"
            :locations="locationsGalactica"
            @player-move="playerMove">
          </LocationGroup>
        </b-col>

        <b-col cols="6" md="3">
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

    <b-modal
      id="skill-cards-modal"
      title="Skill Cards"
      ok-only>
      <SkillCards />
    </b-modal>

    <b-modal
      id="game-log-modal"
      title="game-log"
      ok-only>

      <GameLog />
    </b-modal>

    <HoldingMessage />

  </div>
</template>


<script>
import CharactersModal from './CharactersModal'
import CrisisCard from './CrisisCard'
import GameLog from './GameLog'
import HoldingMessage from './HoldingMessage'
import LocationGroup from './LocationGroup'
import Players from './Players'
import Resources from './Resources'
import SkillCards from './SkillCards'
import SpaceZone from './SpaceZone'

import characters from '../res/character.js'
import crisisCards from '../res/crisis.js'
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
    CrisisCard,
    GameLog,
    HoldingMessage,
    LocationGroup,
    Players,
    Resources,
    SkillCards,
    SpaceZone,
  },

  data() {
    return {
      // Constant Data
      characters,
      crisisCards,
      locations,
    }
  },

  computed: {
    charactersAvailable() {
      const expansions = this.$store.state.bsg.game.options.expansions
      return this.characters
                 .filter(c => expansions.includes(c.expansion))
                 .sort((l, r) => l.name.localeCompare(r.name))
    },
    locationsColonialOne() {
      const expansions = this.$store.state.bsg.game.options.expansions
      return locationFilter(this.locations, expansions, 'Colonial One')
    },
    locationsCylonLocations() {
      const expansions = this.$store.state.bsg.game.options.expansions
      return locationFilter(this.locations, expansions, 'Cylon Locations')
    },
    locationsGalactica() {
      const expansions = this.$store.state.bsg.game.options.expansions
      return locationFilter(this.locations, expansions, 'Galactica')
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

.row {
  margin-bottom: .25em;
}

.heading {
  font-weight: bold;
}

.title-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
