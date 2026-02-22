<template>
  <div class="trade-offer-action">
    <div class="action-header">Trade Offer</div>

    <div class="trade-columns">
      <div class="trade-col">
        <div class="col-label">You Offer</div>
        <div class="trade-resource">
          <span>Trade Goods</span>
          <div class="trade-controls">
            <button class="btn btn-sm btn-outline-secondary" @click="offerTg--" :disabled="offerTg <= 0">-</button>
            <span class="trade-count">{{ offerTg }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="offerTg++" :disabled="offerTg >= maxOfferTg">+</button>
          </div>
        </div>
        <div class="trade-resource">
          <span>Commodities</span>
          <div class="trade-controls">
            <button class="btn btn-sm btn-outline-secondary" @click="offerComm--" :disabled="offerComm <= 0">-</button>
            <span class="trade-count">{{ offerComm }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="offerComm++" :disabled="offerComm >= maxOfferComm">+</button>
          </div>
        </div>
      </div>

      <div class="trade-divider"/>

      <div class="trade-col">
        <div class="col-label">You Request</div>
        <div class="trade-resource">
          <span>Trade Goods</span>
          <div class="trade-controls">
            <button class="btn btn-sm btn-outline-secondary" @click="requestTg--" :disabled="requestTg <= 0">-</button>
            <span class="trade-count">{{ requestTg }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="requestTg++">+</button>
          </div>
        </div>
        <div class="trade-resource">
          <span>Commodities</span>
          <div class="trade-controls">
            <button class="btn btn-sm btn-outline-secondary" @click="requestComm--" :disabled="requestComm <= 0">-</button>
            <span class="trade-count">{{ requestComm }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="requestComm++">+</button>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn btn-sm btn-primary" @click="submit" :disabled="!hasOffer">Submit Offer</button>
      <button class="btn btn-sm btn-secondary" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TradeOffer',

  inject: ['actor', 'game', 'bus'],

  data() {
    return {
      offerTg: 0,
      offerComm: 0,
      requestTg: 0,
      requestComm: 0,
    }
  },

  computed: {
    currentPlayer() {
      return this.game.players.byName(this.actor.name)
    },

    maxOfferTg() {
      return this.currentPlayer?.tradeGoods || 0
    },

    maxOfferComm() {
      return this.currentPlayer?.commodities || 0
    },

    hasOffer() {
      return (this.offerTg + this.offerComm + this.requestTg + this.requestComm) > 0
    },
  },

  methods: {
    submit() {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: [{
          action: 'trade-offer',
          offering: { tradeGoods: this.offerTg, commodities: this.offerComm },
          requesting: { tradeGoods: this.requestTg, commodities: this.requestComm },
        }],
      })
    },

    cancel() {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: ['Cancel'],
      })
    },
  },
}
</script>

<style scoped>
.trade-offer-action {
  padding: .5em;
  background: #f3e5f5;
  border-left: 3px solid #9c27b0;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .35em;
}

.trade-columns {
  display: flex;
  gap: .5em;
}

.trade-col {
  flex: 1;
}

.col-label {
  font-weight: 600;
  font-size: .8em;
  color: #555;
  margin-bottom: .25em;
}

.trade-divider {
  width: 1px;
  background: #ddd;
  margin: 0 .25em;
}

.trade-resource {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: .8em;
  padding: .15em 0;
}

.trade-controls {
  display: flex;
  align-items: center;
  gap: .1em;
}

.trade-count {
  font-weight: 600;
  min-width: 1.2em;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: .35em;
  margin-top: .35em;
}
</style>
