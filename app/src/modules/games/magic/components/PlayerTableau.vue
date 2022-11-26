<template>
  <div class="tableau" :class="extraClasses">

    <div class="tableau-col" :class="extraColumnClasses">
      <div class="tableau-zone">
        <div class="zone-header">
          <div class="zone-name">{{ player.name }}</div>

          <div class="zone-menu">
            <TableauZoneMenu>
            </TableauZoneMenu>
          </div>
        </div>
        <PlayerCounters :player="player" />
      </div>

      <TableauZone :zone="getZone('library')">
        <DropdownButton @click="drawSeven">draw 7</DropdownButton>
      </TableauZone>

      <TableauZone :zone="getZone('exile')" />
    </div>

    <div class="tableau-col" :class="extraColumnClasses">
      <TableauZone :zone="getZone('hand')" />
      <TableauZone :zone="getZone('command')" />
      <TableauZone :zone="getZone('graveyard')" />
    </div>

    <div class="tableau-col" :class="extraColumnClasses">
      <TableauZone :zone="getZone('creatures')" />
      <TableauZone :zone="getZone('battlefield')" />
      <TableauZone :zone="getZone('land')" />
      <TableauZone :zone="getZone('stack')" />
    </div>

  </div>
</template>


<script>
import { computed } from 'vue'

import DropdownButton from '@/components/DropdownButton'
import PlayerCounters from './PlayerCounters'
import TableauZone from './TableauZone'
import TableauZoneMenu from './TableauZoneMenu'


export default {
  name: 'PlayerTableau',

  components: {
    DropdownButton,
    PlayerCounters,
    TableauZone,
    TableauZoneMenu,
  },

  inject: ['actor', 'do', 'game'],

  props: {
    player: Object,
  },

  provide() {
    return {
      player: computed(() => this.player),
    }
  },

  computed: {
    extraClasses() {
      if (this.player.name !== this.actor.name) {
        return 'tableau-reverse'
      }
    },

    extraColumnClasses() {
      if (this.player.name !== this.actor.name) {
        return 'tableau-col-reverse'
      }
    },
  },

  methods: {
    drawSeven() {
      this.do(this.player, { name: 'draw 7' })
    },

    getZone(name) {
      return this.game.getZoneByPlayer(this.player, name)
    },
  },
}
</script>


<style>
.tableau-zone {
  border: 1px solid var(--bs-secondary);
  border-radius: .25em;
  padding: .25em;
}

.tableau-zone:not(:first-of-type) {
  margin-top: .25em;
}

.zone-count {

}

.zone-header {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.zone-menu {
  position: absolute;
  top: -.25em;
  right: -.25em;
}

.zone-name {
  font-weight: bold;
}
</style>

<style scoped>
.tableau {
  display: flex;
  flex-direction: row;

  border: 1px solid var(--bs-secondary);
  background-color: var(--bs-light);
  border-radius: .25em;

  font-size: .8em;
  padding: .25em;

  min-width: 37.5em;
  max-width: 37.5em;
}

.tableau-reverse {
  flex-direction: row-reverse;
}

.tableau-col {
  width: 33%;
}

.tableau-col:not(:first-of-type) {
  margin-left: .25em;
}

.tableau-col-reverse:not(:first-of-type) {
  margin-left: 0;
  margin-right: .25em;
}
</style>
