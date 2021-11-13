<template>
  <div class="battlestar">

    <b-container fluid>
      <div class="sticky-header">
        <b-row>
          <b-col class="title-bar">
            <div>
              Battlestar Galactica | {{ $game.state.name }}
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
                <b-dropdown-item @click="$bvModal.show('crisis-cards-modal')">
                  Crisis Cards
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
            Current turn: <span class="heading">{{ playerCurrentTurn }}</span>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="view-buttons">
            <b-button @click="selectedView = 'actions'">Actions</b-button>
            <b-button @click="selectedView = 'board'">Board</b-button>
            <b-button @click="selectedView = 'crisis'">Crisis</b-button>
            <b-button @click="selectedView = 'skill-check'">Skill Check</b-button>
          </b-col>
        </b-row>
      </div> <!-- Sticky header -->


      <b-row>
        <b-col class="mt-2">
          <div v-if="selectedView === 'actions'">
            <WaitingPanel />
          </div>

          <div v-if="selectedView === 'board'">
            <Resources />
            <Zones />
          </div>

          <div v-if="selectedView === 'crisis'">
            <CrisisPanel />
          </div>

          <div v-if="selectedView === 'skill-check'">
            <SkillCheckPanel />
          </div>

        </b-col>
      </b-row>

    </b-container>

    <CardInfoModal />
    <ErrorModal />
    <GameLog />
    <HacksModal />
    <ZoneViewerModal />

    <b-modal
      id="characters-modal"
      title="Characters"
      ok-only>
      <Characters />
    </b-modal>

    <b-modal
      id="crisis-cards-modal"
      title="Crisis Cards"
      ok-only>
      <CrisisCards />
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
import CrisisCards from './CrisisCards'
import CrisisPanel from './CrisisPanel'
import ErrorModal from './ErrorModal'
import GameLog from './GameLog'
import GrabMessage from './GrabMessage'
import HacksModal from './HacksModal'
import Locations from './Locations'
import Resources from './Resources'
import SkillCards from './SkillCards'
import SkillCheckPanel from './SkillCheckPanel'
import WaitingPanel from './WaitingPanel'
import Zones from './Zones'
import ZoneViewerModal from './ZoneViewerModal'

import { bsg } from 'battlestar-common'


export default {
  name: 'Battlestar',

  components: {
    CardInfoModal,
    Characters,
    CrisisCards,
    CrisisPanel,
    ErrorModal,
    GameLog,
    GrabMessage,
    HacksModal,
    Locations,
    Resources,
    SkillCards,
    SkillCheckPanel,
    WaitingPanel,
    Zones,
    ZoneViewerModal,
  },

  data() {
    return {
      selectedView: 'actions',
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
      return this.$game.getPlayerCurrentTurn().name
    },
  },

  methods: {
    async pass(name) {
      console.log('pass to', name)
    },

    toggleStickyView() {
      this.$game.toggleStickyView()
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

.battlestar {
  background-color: white;
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

.reminder-text {
  color: #444;
  font-size: .7em;
}

.title-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.view-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
