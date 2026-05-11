<template>
  <ModalBase id="dune-vp-breakdown-modal">
    <template #header>{{ title }}</template>

    <CounterHistoryTable
      v-if="player"
      :playerName="player.name"
      counterName="vp"
      :currentValue="player.vp"
    />
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import CounterHistoryTable from '@/modules/games/common/components/CounterHistoryTable.vue'

export default {
  name: 'DuneVpBreakdownModal',

  components: { ModalBase, CounterHistoryTable },

  inject: ['ui'],

  computed: {
    player() {
      return this.ui.modals.vpBreakdown?.player || null
    },

    title() {
      return this.player ? `${this.player.name} — VP Breakdown` : 'VP Breakdown'
    },
  },
}
</script>
