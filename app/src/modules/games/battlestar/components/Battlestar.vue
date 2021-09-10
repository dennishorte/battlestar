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

      <b-row class="action-buttons-wrapper">
        <b-col>
          <div class="action-buttons">
            <b-button variant="success" v-b-modal.game-log-modal>log</b-button>
            <b-dropdown variant="warning" text="pass to" left>
              <b-dropdown-item>
                next
              </b-dropdown-item>

              <b-dropdown-divider />

              <b-dropdown-item>
                current player
              </b-dropdown-item>
              <b-dropdown-item>
                admiral
              </b-dropdown-item>
              <b-dropdown-item>
                president
              </b-dropdown-item>

              <b-dropdown-divider />

              <b-dropdown-item
                v-for="player in players"
                :key="player.name"
              >
                {{ player.name }}
              </b-dropdown-item>
            </b-dropdown>

            <b-dropdown variant="primary" text="info" right>
              <b-dropdown-item @click="$bvModal.show('characters-modal')">
                Characters
              </b-dropdown-item>
              <b-dropdown-item @click="$bvModal.show('destination-modal')">
                Destinations
              </b-dropdown-item>
              <b-dropdown-item @click="$bvModal.show('skill-cards-modal')">
                Skill Cards
              </b-dropdown-item>
              <b-dropdown-item @click="$bvModal.show('zones-modal')">
                Zones
              </b-dropdown-item>
            </b-dropdown>

          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <ZonesModal />

          <PhasePanel
            :loyaltyCards="loyaltyCardsAvailable"
          />

          <CrisisCard style="display:none;" :card="crisisCards[44]" />
        </b-col>
      </b-row>

      <b-row>

        <b-col>
          <Players />
        </b-col>

        <b-col>
          <Resources />
        </b-col>

      </b-row>

      <SpaceZone
        @space-component-move="spaceComponentMove"
        @space-component-remove="spaceComponentRemove"
        @space-components-clear="spaceComponentsClear"
      />

    </b-container>

    <ZoneViewerModal />

    <b-modal
      id="characters-modal"
      title="Characters"
      ok-only>
      <Characters />
    </b-modal>

    <b-modal
      id="destination-modal"
      title="Destination"
      ok-only>
      <Destination />
    </b-modal>

    <b-modal
      id="game-log-modal"
      title="game-log"
      ok-only>

      <GameLog />
    </b-modal>

    <b-modal
      id="player-modal"
      title="Player Info"
      ok-only>
      <PlayerInfo />
    </b-modal>

    <b-modal
      id="skill-cards-modal"
      title="Skill Cards"
      ok-only>
      <SkillCards />
    </b-modal>

    <HoldingMessage />

  </div>
</template>


<script>
import Characters from './Characters'
import CrisisCard from './CrisisCard'
import Destination from './Destination'
import GameLog from './GameLog'
import HoldingMessage from './HoldingMessage'
import PhasePanel from './PhasePanel'
import PlayerInfo from './PlayerInfo'
import Players from './Players'
import Resources from './Resources'
import SkillCards from './SkillCards'
import SpaceZone from './SpaceZone'
import ZonesModal from './ZonesModal'
import ZoneViewerModal from './ZoneViewerModal'

import crisisCards from '../res/crisis.js'
import loyaltyCards from '../res/loyalty.js'
import locations from '../res/location.js'

import bsgutil from '../lib/util.js'


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
  return bsgutil
    .expansionFilter(locations, expansions)
    .filter(x => x.area === area)
    .sort(locationCompare)
}


export default {
  name: 'Battlestar',

  components: {
    Characters,
    CrisisCard,
    Destination,
    GameLog,
    HoldingMessage,
    PhasePanel,
    PlayerInfo,
    Players,
    Resources,
    SkillCards,
    SpaceZone,
    ZonesModal,
    ZoneViewerModal,
  },

  data() {
    return {
      // Constant Data
      crisisCards,
      locations,
    }
  },

  computed: {
    loyaltyCardsAvailable() {
      const expansions = this.$store.state.bsg.game.options.expansions
      return bsgutil.expansionFilter(loyaltyCards, expansions)
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
    },
    players() {
      return this.$store.state.bsg.game.players
    },
    politicsCards() {
      return this.$store.getters['bsg/deck']('politics').cards
    },
  },

  methods: {
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

.skill-politics {
  color: #555;
  background-color: yellow;
}

.skill-leadership {
  color: lightgray;
  background-color: green;
}

.skill-tactics {
  color: lightgray;
  background-color: purple;
}

.skill-piloting {
  color: lightgray;
  background-color: red;
}

.skill-engineering {
  color: lightgray;
  background-color: blue;
}

.skill-treachery {
  color: #555;
  background-color: beige;
}

.d-none {
  display: none;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.action-buttons-wrapper {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 2;
}

.row {
  margin-bottom: .25em;
}

.heading {
  font-weight: bold;
}

.reminder-text {
  color: #444;
  font-size: .7em;
}

.title-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
