<template>
  <div class="location-group">
    <div class="locations-heading heading">
      {{ name }}
    </div>

    <b-list-group :key="damageTrigger">
      <b-list-group-item
        @click="locationClick($event, loc)"
        v-for="loc in locations"
        class="location-item"
        :class="[damageReport.includes(loc.name) ? 'location-damaged' : '']"
        :data-location="loc.name"
        :key="loc.name">

        {{ loc.name }}

        <div class="player-holder">

          <div
            @click="pawnGrab($event, player._id)"
            v-for="player in playersAt(loc)"
            :key="player.index">

            <div :class="characterNameToCssClass(player.character)">
              <font-awesome-icon :icon="['fas', 'user']" />
            </div>
          </div>
        </div>

      </b-list-group-item>
    </b-list-group>

    <b-modal
      :title="locationModalLoc.name"
      ok-only
      ok-title="done"
      v-model="locationModalShow">

      <div v-show="!!locationModalLoc.hazard">
        {{ locationModalLoc.hazard }}
      </div>

      <div>
        {{ locationModalLoc.text }}
      </div>

      <div v-if="!!locationModalLoc['skill check value']">
        <span class="skill-difficulty">{{ locationModalLoc['skill check value'] }}</span>

        <template v-for="skill in skillList">
          <div
            v-if="!!locationModalLoc[skill]"
            :key="skill"
            :class="`skill-${skill}`">
            {{ skill }}
          </div>
        </template>
      </div>

      <template #modal-footer="{ ok }">
        <b-button v-if="locationModalDamaged" size="sm" variant="danger" @click="repair">
          repair
        </b-button>

        <b-button size="sm" variant="success" @click="ok()">
          OK
        </b-button>
      </template>

    </b-modal>
  </div>
</template>


<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
library.add(faUser)

import bsgutil from '../util.js'

export default {
  name: 'LocationGroup',

  props: {
    name: String,
    locations: Array,
  },

  data() {
    return {
      skillList: bsgutil.skillList,
      locationModalDamaged: false,
      locationModalLoc: {},
      locationModalShow: false,
    }
  },

  computed: {
    damageTrigger() {
      return this.$store.state.bsg.game.space.ships.galactica.damage.length
    },
    damageReport() {
      return this.$store.state.bsg.game.space.ships.galactica.damage
    },
    grabbingPawn() {
      return this.$store.getters['bsg/isPawnGrabbing']
    },
    players() {
      return this.$store.state.bsg.game.players
    },
  },

  methods: {
    characterNameToCssClass: bsgutil.characterNameToCssClass,

    drop(event) {
      event.target.classList.remove('location-drop')
      const playerId = event.dataTransfer.getData('playerId')
      const locationName = event.target.getAttribute('data-location')
      this.$emit('player-move', {
        playerId,
        zone: this.name,
        location: locationName,
      })
    },

    locationClick(event, loc) {
      event.stopPropagation()
      if (this.grabbingPawn) {
        this.$store.commit('bsg/pawnDrop', loc.name)
      }
      else {
        this.locationModalLoc = loc
        this.locationModalDamaged = this.damageReport.includes(loc.name)
        this.locationModalShow = true
      }
    },

    pawnGrab(event, playerId) {
      if (!this.$store.state.bsg.ui.grabbing.message) {
        this.$store.commit('bsg/pawnGrab', playerId)
        event.stopPropagation()
      }
    },

    playersAt(location) {
      return this.players.filter(p =>  p.location === location.name)
    },

    repair() {
      this.$store.commit('bsg/locationRepair', this.locationModalLoc.name)
      this.locationModalShow = false
    },
  },
}
</script>


<style scoped>
.location-damaged {
  background-color: #fbc;
  color: #d77
}

.location-drop {
  background-color: #ddf!important;
}

.location-item {
  padding: .3em .4em!important;
  display: flex!important;
  align-items: center;
  justify-content: space-between;
}

.player-holder {
  display: flex!important;
  align-items: center;
  justify-content: center;
}
</style>
