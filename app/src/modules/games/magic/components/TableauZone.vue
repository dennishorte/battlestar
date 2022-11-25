<template>
  <div class="tableau-zone" @click="zoneClicked">
    <div class="zone-header">
      <div>
        <span class="zone-name">{{ zone.name }}</span>&nbsp;<span class="zone-count">({{ zone.cards().length }})</span>
      </div>

      <div class="zone-menu" v-if="!noMenu">
        <TableauZoneMenu>
          <slot></slot>
        </TableauZoneMenu>
      </div>
    </div>

    <CardListItem
      v-for="card in zone.cards()"
      :card="card"
      @click.stop="cardClicked(card)"
    />


  </div>
</template>


<script>
import CardListItem from '@/modules/magic/components/CardListItem'
import TableauZoneMenu from './TableauZoneMenu'


export default {
  name: 'TableauZone',

  components: {
    CardListItem,
    TableauZoneMenu,
  },

  props: {
    zone: Object,  // Zone from the game.

    noMenu: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    cardClicked(card) {
      this.$store.dispatch('magic/game/clickCard', card)
    },

    zoneClicked() {
      this.$store.dispatch('magic/game/clickZone', this.zone)
    },
  },
}
</script>


<style scoped>
.highlighted {
  background-color: lightblue;
}

.tableau-zone {
  min-height: 3.7em;
}
</style>
