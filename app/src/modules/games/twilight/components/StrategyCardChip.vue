<template>
  <div class="strategy-card-chip" @click.stop="showDetails">
    <span class="sc-number">{{ card.number }}</span>
    <span class="sc-name">{{ card.name }}</span>
    <span class="sc-tg" v-if="tradeGoods > 0">+{{ tradeGoods }} TG</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'StrategyCardChip',

  props: {
    cardId: { type: String, required: true },
  },

  inject: ['game', 'ui'],

  computed: {
    card() {
      return res.getStrategyCard(this.cardId) || { name: this.cardId, number: '?' }
    },

    tradeGoods() {
      return this.game.state.strategyCardTradeGoods?.[this.cardId] || 0
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'strategy-card'
      this.ui.modals.cardDetail.id = this.cardId
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.strategy-card-chip {
  display: inline-flex;
  align-items: center;
  gap: .4em;
  padding: .25em .5em;
  border-radius: .25em;
  cursor: pointer;
  background: #343a40;
  color: #fff;
  font-size: .9em;
}

.strategy-card-chip:hover {
  filter: brightness(1.2);
}

.sc-number {
  font-weight: 700;
  font-size: 1.1em;
  width: 1.4em;
  height: 1.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.2);
  border-radius: 50%;
}

.sc-name {
  font-weight: 600;
}

.sc-tg {
  font-size: .8em;
  padding: .1em .3em;
  background: #ffc107;
  color: #333;
  border-radius: .15em;
  font-weight: 600;
}
</style>
