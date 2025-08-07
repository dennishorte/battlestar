<template>
  <div class="tableau-zone" @click="zoneClicked">
    <div class="zone-header">
      <div>
        <span class="zone-name">{{ zone.name() }}</span>&nbsp;<span class="zone-count">({{ zone.cardlist().length }})</span>
      </div>

      <div class="zone-menu" v-if="!noMenu">
        <TableauZoneMenu>
          <slot/>
        </TableauZoneMenu>
      </div>
    </div>

    <TableauZoneCard v-if=topCard :card="topCard" @click.stop="cardClicked(card)" />
  </div>
</template>


<script>
import TableauZoneCard from './TableauZoneCard'
import TableauZoneMenu from './TableauZoneMenu'


export default {
  name: 'TableauLibraryZone',

  components: {
    TableauZoneCard,
    TableauZoneMenu,
  },

  props: {
    zone: {
      type: Object,
      required: true
    },
    noMenu: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    topCard() {
      return this.zone.cardlist()[0]
    },
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
