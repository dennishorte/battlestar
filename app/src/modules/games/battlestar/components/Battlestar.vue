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

              <b-dropdown-divider />

              <b-dropdown-item @click="save">
                save
              </b-dropdown-item>

            </b-dropdown>

            <b-dropdown variant="primary" text="info" right>
              <b-dropdown-item @click="$bvModal.show('characters-modal')">
                Characters
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
      id="skill-cards-modal"
      title="Skill Cards"
      ok-only>
      <SkillCards />
    </b-modal>

  </div>
</template>


<script>
import Characters from './Characters'
import GameLog from './GameLog'
import PhasePanel from './PhasePanel'
import Resources from './Resources'
import SkillCards from './SkillCards'
import Zones from './Zones'
import ZoneViewerModal from './ZoneViewerModal'


export default {
  name: 'Battlestar',

  components: {
    Characters,
    GameLog,
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

      if (!mutation.type.startsWith('bsg/') || state.ui.undoing) {
        return
      }

      // Strip the 'bsg/' from the front, since we'll be replaying them from local context.
      mutation.type = mutation.type.slice(4)

      // A new action is performed. Clear the redo, since it probably doesn't make sense anymore.
      if (!state.ui.redoing) {
        state.ui.undone = []
      }

      console.log(mutation)
      state.game.history.push(mutation)
    })
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
