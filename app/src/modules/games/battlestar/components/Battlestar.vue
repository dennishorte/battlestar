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
            <b-button variant="danger" @click="undo">undo</b-button>
            <b-button variant="info" @click="redo">redo</b-button>

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

              <b-dropdown-divider />

              <b-dropdown-item @click="save">
                save
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

      <b-row v-if="unsaved" class="save-message">
        <b-col class="save-message-col">
          <div>
            You have unsaved actions
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <PhasePanel />
        </b-col>
      </b-row>

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
import GameLog from './GameLog'
import GrabMessage from './GrabMessage'
import HacksModal from './HacksModal'
import Locations from './Locations'
import PhasePanel from './PhasePanel'
import Resources from './Resources'
import SkillCards from './SkillCards'
import Zones from './Zones'
import ZoneViewerModal from './ZoneViewerModal'


export default {
  name: 'Battlestar',

  components: {
    CardInfoModal,
    Characters,
    GameLog,
    GrabMessage,
    HacksModal,
    Locations,
    PhasePanel,
    Resources,
    SkillCards,
    Zones,
    ZoneViewerModal,
  },

  data() {
    return {
      unsubscribe: null,
    }
  },

  computed: {
    unsaved() {
      return this.$store.getters['bsg/uiUnsaved']
    },
    players() {
      return this.$store.state.bsg.game.players
    },
  },

  methods: {
    pass(name) {
      this.$store.dispatch('bsg/pass', name)
    },

    resourceChanged({ name, amount }) {
      name = name.trim().toLowerCase().replace(' ', '_')
      this.counters[name] += amount
      this.counters[name] = Math.max(0, this.counters[name])
      this.counters[name] = Math.min(15, this.counters[name])
    },

    async save() {
      await this.$store.dispatch('bsg/save')
      this.$bvToast.toast('saved', {
        autoHideDelay: 300,
        noCloseButton: true,
        solid: true,
      })
    },

    redo() {
      this.$store.dispatch('bsg/redo')
    },

    undo() {
      this.$store.dispatch('bsg/undo')
    },
  },

  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },

  mounted() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      const state = this.$store.state.bsg

      if (!mutation.type.startsWith('bsg/'))
        return

      state.ui.unsavedActions = true

      if (state.ui.undoing)
        return

      // Strip the 'bsg/' from the front, since we'll be replaying them from local context.
      mutation.type = mutation.type.slice(4)

      // A new action is performed. Clear the redo, since it probably doesn't make sense anymore.
      if (!state.ui.redoing) {
        state.ui.undone = []
      }

      state.game.history.push(mutation)
    })
  },
}

// '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
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
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 3;
  height: 2.5em;
}

.save-message {
  position: sticky;
  border-radius: .5em;
  top: 2.2em;
  height: 2em;
  background-color: black;
  color: red;
  font-weight: bold;
  z-index: 2;
  text-align: center;
}

.save-message-col {
  display: flex;
  justify-content: center;
  flex-direction: column;
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
