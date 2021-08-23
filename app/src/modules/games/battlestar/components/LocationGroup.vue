<template>
<div class="location-group">
  <div class="locations-heading heading">
    {{ name }}
  </div>

  <b-list-group>
    <b-list-group-item
      @click="visitLocation(loc.name)"
      v-for="loc in locations"
      class="location-item"
      :key="loc.name">

      {{ loc.name }}

      <div class="player-holder">

        <div
          v-for="player in playersAt(loc)"
          :key="player.index">

          <div :class="player.characterShort">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
        </div>
      </div>

    </b-list-group-item>
  </b-list-group>
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
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true
      },
    }
  },

  methods: {
    drop(event) {
      console.log(event)
    },

    playersAt(location) {
      return this.players.filter(p =>  p.location === location.name)
    },

    visitLocation(name) {
      this.$emit('visit-location', {
        zone: this.name,
        location: name,
      })
    },
  },
}
</script>


<style>
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
