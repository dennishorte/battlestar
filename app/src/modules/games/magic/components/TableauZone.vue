<template>
  <div class="tableau-zone" @click="zoneClicked('top')">
    <div class="zone-header">
      <div>
        <span class="zone-name">{{ zone.name }}</span>&nbsp;<span class="zone-count">({{ zone.cards().length }})</span>
      </div>

      <div class="zone-menu" v-if="!noMenu">
        <TableauZoneMenu>
          <slot name="menu"/>
        </TableauZoneMenu>
      </div>
    </div>

    <template v-if="libraryView">
      <TableauZoneCard v-for="card in topCards" :card="card" @click.stop="cardClicked(card)" />
      <div class="library-separator">
        <div>top</div>
        <div>bottom</div>
      </div>
      <TableauZoneCard v-for="card in bottomCards" :card="card" @click.stop="cardClicked(card)" />
      <div class="bottom-space" @click.stop="zoneClicked('bottom')"/>
    </template>

    <template v-else>
      <TableauZoneCard
        v-for="card in zone.cards()"
        :card="card"
        :show-grave-powers="showGravePowers"
        :show-mana-cost="showManaCost"
        :show-power="showPower"
        @click.stop="cardClicked(card)"
      />

      <div class="bottom-space" @click.stop="zoneClicked('bottom')"/>
    </template>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import TableauZoneCard from './TableauZoneCard'
import TableauZoneMenu from './TableauZoneMenu'


export default {
  name: 'TableauZone',

  components: {
    TableauZoneCard,
    TableauZoneMenu,
  },

  inject: ['actor'],

  props: {
    zone: Object,  // Zone from the game.

    libraryView: {
      type: Boolean,
      default: false,
    },

    noMenu: {
      type: Boolean,
      default: false,
    },

    showGravePowers: {
      type: Boolean,
      default: false,
    },

    showManaCost: {
      type: Boolean,
      default: false,
    },

    showPower: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    bottomCards() {
      const visible = util.array.takeRightWhile(this.zone.cards(), card => {
        return Boolean(card.visibility.find(p => p.name === this.actor.name))
      })

      if (visible.length === this.zone.cards().length) {
        return []
      }
      else if (visible.length) {
        return visible
      }
      else {
        return this.zone.cards().slice(-1)
      }
    },

    topCards() {
      const visible = util.array.takeWhile(this.zone.cards(), card => {
        return Boolean(card.visibility.find(p => p.name === this.actor.name))
      })

      if (visible.length) {
        return visible
      }
      else {
        return this.zone.cards().slice(0, 1)
      }
    },
  },

  methods: {
    cardClicked(card) {
      this.$store.dispatch('magic/game/clickCard', card)
    },

    zoneClicked(position) {
      this.$store.dispatch('magic/game/clickZone', {
        zone: this.zone,
        position,
      })
    },
  },
}
</script>


<style scoped>
.bottom-space {
  min-height: 1.2em;
  width: 100%
}

.highlighted {
  background-color: lightblue;
}

.library-separator {
  color: var(--bs-secondary);
  font-size:.7em;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.library-separator > div {
  margin-left: .5em;
}

.tableau-zone {
  min-height: 3.7em;
}
</style>
