<template>
<div class="location-group">
  <div class="locations-heading heading">
    {{ name }}
  </div>

  <b-list-group>
    <b-list-group-item
      @click="showLocationDescription(loc)"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @drop="drop"
      @dragover.prevent
      @dragenter.prevent
      v-for="loc in locations"
      class="location-item"
      :data-location="loc.name"
      :key="loc.name">

      {{ loc.name }}

      <div class="player-holder">

        <div
          draggable
          @dragstart="dragStart($event, player)"
          v-for="player in playersAt(loc)"
          :key="player.index">

          <div :class="player.characterShort">
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

    <div v-show="!!locationModalLoc.action">
      <strong>Action:</strong> {{ locationModalLoc.action }}
    </div>

    <div v-if="!!locationModalLoc.skill">
      <span class="skill-difficulty">{{ locationModalLoc.skill.difficulty }}</span>
      <span
        v-for="skill in locationModalLoc.skill.skills"
        :key="skill"
        :class="`skill-${skill}`">
        {{ skill }}
      </span>
    </div>

  </b-modal>
</div>
</template>


<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
library.add(faUser)


export default {
  name: 'LocationGroup',

  props: {
    name: String,
    locations: Array,
    players: Array,
  },

  data() {
    return {
      locationModalLoc: {},
      locationModalShow: false,
    }
  },

  methods: {
    drop(event) {
      event.target.classList.remove('location-drop')
      const playerId = event.dataTransfer.getData('playerId')
      const locationName = event.target.getAttribute('data-location')
      this.$emit('move-player', {
        playerId,
        zone: this.name,
        location: locationName,
      })
    },

    dragEnter(event) {
      event.preventDefault()
      if (event.target.classList.contains('location-item')) {
        event.target.classList.add('location-drop')
      }
    },

    dragLeave(event) {
      event.target.classList.remove('location-drop')
    },

    dragStart(event, player) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('playerId', player._id)
    },

    playersAt(location) {
      return this.players.filter(p =>  p.location === location.name)
    },

    showLocationDescription(location) {
      this.locationModalLoc = location
      this.locationModalShow = true
    },
  },
}
</script>


<style>
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
