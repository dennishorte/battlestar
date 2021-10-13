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

      <div class="sticky-header">
        <b-row class="action-buttons-wrapper">
          <b-col>
            <div class="action-buttons">
              <b-button variant="success" v-b-modal.game-log-modal>log</b-button>
              <b-button variant="danger" @click="undo" :disabled="!canUndo">undo</b-button>
              <b-button variant="info" @click="redo" :disabled="!canRedo">redo</b-button>

              <b-dropdown variant="warning" text="pass to" left>
                <b-dropdown-item @click="pass('next')">
                  next
                </b-dropdown-item>

                <b-dropdown-divider />

                <b-dropdown-item @click="pass('admiral')">
                  admiral
                </b-dropdown-item>
                <b-dropdown-item @click="pass('president')">
                  president
                </b-dropdown-item>

                <b-dropdown-divider />

                <b-dropdown-item
                  v-for="player in players"
                  :key="player.name"
                  @click="pass(player.name)"
                >
                  {{ player.name }}
                </b-dropdown-item>
              </b-dropdown>

              <b-dropdown variant="primary" text="info" right>
                <b-dropdown-item @click="$bvModal.show('characters-modal')">
                  Characters
                </b-dropdown-item>
                <b-dropdown-item @click="$bvModal.show('locations-modal')">
                  Locations
                </b-dropdown-item>
                <b-dropdown-item @click="$bvModal.show('skill-cards-modal')">
                  Skill Cards
                </b-dropdown-item>

                <b-dropdown-divider />

                <b-dropdown-item @click="$bvModal.show('hacks-modal')">
                  Hacks
                </b-dropdown-item>
              </b-dropdown>

            </div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div class="turn-info">
              <div>
                Waiting for: <span class="heading">{{ waitingFor }}</span>
              </div>

              <div>
                Current turn: <span class="heading">{{ playerCurrentTurn }}</span>
              </div>
            </div>
          </b-col>
        </b-row>

        <b-row class="phase-panel">
          <b-col>
            <WaitingPanel />
          </b-col>
        </b-row>

      </div> <!-- Sticky header -->

      <b-row>
        <b-col>
          <Resources />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <Zones />
        </b-col>
      </b-row>

    </b-container>

    <CardInfoModal />
    <ErrorModal />
    <HacksModal />
    <ZoneViewerModal />

    <b-modal
      id="characters-modal"
      title="Characters"
      ok-only>
      <Characters />
    </b-modal>

    <b-modal
      id="game-log-modal"
      title="game-log"
      ok-only>

      <GameLog />
    </b-modal>

    <b-modal
      id="locations-modal"
      title="Locations"
      ok-only>

      <Locations />
    </b-modal>

    <b-modal
      id="skill-cards-modal"
      title="Skill Cards"
      ok-only>
      <SkillCards />
    </b-modal>

    <GrabMessage />

  </div>
</template>


<script>
import CardInfoModal from './CardInfoModal'
import Characters from './Characters'
import ErrorModal from './ErrorModal'
import GameLog from './GameLog'
import GrabMessage from './GrabMessage'
import HacksModal from './HacksModal'
import Locations from './Locations'
import Resources from './Resources'
import SkillCards from './SkillCards'
import WaitingPanel from './WaitingPanel'
import Zones from './Zones'
import ZoneViewerModal from './ZoneViewerModal'

import { bsg } from 'battlestar-common'


export default {
  name: 'Battlestar',

  components: {
    CardInfoModal,
    Characters,
    ErrorModal,
    GameLog,
    GrabMessage,
    HacksModal,
    Locations,
    Resources,
    SkillCards,
    WaitingPanel,
    Zones,
    ZoneViewerModal,
  },

  data() {
    return {
      state: [],  // Serves as a place to put the state to make it reactive
    }
  },

  computed: {
    canRedo() {
      return false
    },
    canUndo() {
      return false
    },
    players() {
      return this.$game.getPlayerAll()
    },
    playerCurrentTurn() {
      console.log('hello', this.$game.getPlayerCurrentTurn().name)
      return this.$game.getPlayerCurrentTurn().name
    },
    waitingFor() {
      return this.$game.getPlayerWaitingFor().name
    },
  },

  methods: {
    async pass(name) {
      console.log('pass to', name)
    },

    redo() {
      console.log('redo not implemented')
    },

    undo() {
      console.log('undo not implemented')
    },
  },

  created() {
    this.$game.setToaster(function(msg) {
      this.$bvToast.toast(msg, {
        autoHideDelay: 300,
        noCloseButton: true,
        solid: true,
      })
    }.bind(this))

    this.$game.setTransitions(bsg.transitions)
    this.$game.ready()

    // Make the game data and ui state reactive
    this.state.push(this.$game.state)
    this.state.push(this.$game.ui)
  },
}
</script>


<style>
.d-none {
  display: none;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.action-buttons-wrapper {
  padding-top: 15px;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #ddd;
  margin-left: -15px;
  margin-right: -15px;
  padding-left: 15px;
  padding-right: 15px;
  border: 1px solid #bbb;
  border-bottom-left-radius: .5em;
  border-bottom-right-radius: .5em;
}

.turn-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.row {
  margin-bottom: .25em;
}

.heading {
  font-weight: bold;
}

.description {
  color: #444;
  font-size: .7em;
}

.phase-panel {
  margin-bottom: .1em!important;
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
