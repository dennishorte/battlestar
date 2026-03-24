<template>
  <div class="trade-offer-action">
    <div class="action-header">{{ title }}</div>

    <!-- Incoming offer display (review mode) -->
    <div v-if="incomingOffer" class="incoming-offer">
      <div class="incoming-label">Proposed Deal</div>
      <div class="incoming-columns">
        <div class="incoming-col">
          <div class="col-label">{{ partnerName }} offers</div>
          <div class="incoming-items">
            <span v-for="item in incomingOfferItems" :key="item" class="incoming-item">{{ item }}</span>
            <span v-if="incomingOfferItems.length === 0" class="incoming-item empty">Nothing</span>
          </div>
        </div>
        <div class="trade-divider" />
        <div class="incoming-col">
          <div class="col-label">{{ partnerName }} requests</div>
          <div class="incoming-items">
            <span v-for="item in incomingRequestItems" :key="item" class="incoming-item">{{ item }}</span>
            <span v-if="incomingRequestItems.length === 0" class="incoming-item empty">Nothing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Review-only buttons (Accept/Reject/Counter) -->
    <div v-if="isReviewMode" class="action-buttons">
      <button class="btn btn-sm btn-success" @click="respond('Accept')">Accept</button>
      <button class="btn btn-sm btn-warning" @click="respond('Counter')" v-if="allowCounter">Counter</button>
      <button class="btn btn-sm btn-danger" @click="respond('Reject')">Reject</button>
    </div>

    <!-- Offer builder (propose or counter mode) -->
    <template v-if="isEditMode">
      <div class="partner-resources" v-if="targetPlayer">
        <span class="partner-label">{{ partnerName }}:</span>
        <span>{{ targetPlayer.tradeGoods }} TG</span>
        <span>{{ targetPlayer.commodities }} Comm</span>
      </div>

      <div class="trade-columns">
        <div class="trade-col">
          <div class="col-label">You Offer</div>

          <!-- Trade Goods -->
          <div class="trade-resource">
            <span>Trade Goods</span>
            <div class="trade-controls">
              <button class="btn btn-sm btn-outline-secondary" @click="offerTg--" :disabled="offerTg <= 0">-</button>
              <span class="trade-count">{{ offerTg }}</span>
              <button class="btn btn-sm btn-outline-secondary" @click="offerTg++" :disabled="offerTg >= maxOfferTg">+</button>
            </div>
          </div>

          <!-- Commodities -->
          <div class="trade-resource">
            <span>Commodities</span>
            <div class="trade-controls">
              <button class="btn btn-sm btn-outline-secondary" @click="offerComm--" :disabled="offerComm <= 0">-</button>
              <span class="trade-count">{{ offerComm }}</span>
              <button class="btn btn-sm btn-outline-secondary" @click="offerComm++" :disabled="offerComm >= maxOfferComm">+</button>
            </div>
          </div>

          <!-- Promissory Notes -->
          <div v-if="myNotes.length > 0" class="trade-resource-list">
            <span class="list-label">Promissory Notes</span>
            <div v-for="note in myNotes"
                 :key="'o-' + note.id + note.owner"
                 class="trade-chip"
                 :class="{ selected: isNoteOffered(note) }"
                 @click="toggleOfferNote(note)">
              {{ formatNote(note) }}
            </div>
          </div>

          <!-- Action Cards (Hacan only) -->
          <div v-if="canTradeActions && myActionCards.length > 0" class="trade-resource-list">
            <span class="list-label">Action Cards</span>
            <div v-for="card in myActionCards"
                 :key="'o-' + card.id"
                 class="trade-chip"
                 :class="{ selected: offeredActionCards.includes(card.id) }"
                 @click="toggleOfferActionCard(card.id)">
              {{ card.name || card.id }}
            </div>
          </div>
        </div>

        <div class="trade-divider" />

        <div class="trade-col">
          <div class="col-label">You Request</div>

          <!-- Trade Goods -->
          <div class="trade-resource">
            <span>Trade Goods</span>
            <div class="trade-controls">
              <button class="btn btn-sm btn-outline-secondary" @click="requestTg--" :disabled="requestTg <= 0">-</button>
              <span class="trade-count">{{ requestTg }}</span>
              <button class="btn btn-sm btn-outline-secondary" @click="requestTg++" :disabled="targetPlayer && requestTg >= targetPlayer.tradeGoods">+</button>
            </div>
          </div>

          <!-- Commodities -->
          <div class="trade-resource">
            <span>Commodities</span>
            <div class="trade-controls">
              <button class="btn btn-sm btn-outline-secondary" @click="requestComm--" :disabled="requestComm <= 0">-</button>
              <span class="trade-count">{{ requestComm }}</span>
              <button class="btn btn-sm btn-outline-secondary" @click="requestComm++" :disabled="targetPlayer && requestComm >= targetPlayer.commodities">+</button>
            </div>
          </div>

          <!-- Promissory Notes -->
          <div v-if="targetNotes.length > 0" class="trade-resource-list">
            <span class="list-label">Promissory Notes</span>
            <div v-for="note in targetNotes"
                 :key="'r-' + note.id + note.owner"
                 class="trade-chip"
                 :class="{ selected: isNoteRequested(note) }"
                 @click="toggleRequestNote(note)">
              {{ formatNote(note) }}
            </div>
          </div>

          <!-- Action Cards (Hacan only) -->
          <div v-if="canTradeActions && targetActionCards.length > 0" class="trade-resource-list">
            <span class="list-label">Action Cards</span>
            <div v-for="card in targetActionCards"
                 :key="'r-' + card.id"
                 class="trade-chip"
                 :class="{ selected: requestedActionCards.includes(card.id) }"
                 @click="toggleRequestActionCard(card.id)">
              {{ card.name || card.id }}
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-sm btn-primary" @click="submit" :disabled="!hasOffer">Submit Offer</button>
        <button class="btn btn-sm btn-secondary" @click="cancel">Cancel</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TradeOffer',

  props: {
    request: { type: Object, default: null },
    playerName: { type: String, default: null },
  },

  inject: ['actor', 'game', 'bus'],

  data() {
    return {
      offerTg: 0,
      offerComm: 0,
      requestTg: 0,
      requestComm: 0,
      offeredNotes: [],      // [{ id, owner }]
      requestedNotes: [],    // [{ id, owner }]
      offeredActionCards: [], // [cardId]
      requestedActionCards: [], // [cardId]
    }
  },

  computed: {
    title() {
      return this.request?.title || 'Trade Offer'
    },

    isReviewMode() {
      // Review mode: incoming offer to accept/reject/counter, no allowsAction
      return !this.request?.allowsAction && this.request?.context?.offering
    },

    isEditMode() {
      return !this.isReviewMode
    },

    allowCounter() {
      return this.request?.choices?.includes('Counter') ?? false
    },

    currentPlayer() {
      return this.game.players.byName(this.playerName || this.actor.name)
    },

    partnerName() {
      if (this.request?.context?.targetName) {
        return this.request.context.targetName
      }
      // Parse from title: "Offer to X", "Counter-offer to X", "Transaction from X", "Counter-offer from X"
      const title = this.request?.title || ''
      const toMatch = title.match(/(?:offer|Offer) to (.+)/)
      if (toMatch) {
        return toMatch[1]
      }
      const fromMatch = title.match(/(?:from) (.+)/)
      if (fromMatch) {
        return fromMatch[1]
      }
      return null
    },

    targetPlayer() {
      return this.partnerName ? this.game.players.byName(this.partnerName) : null
    },

    // Incoming offer data (for review and counter modes)
    incomingOffer() {
      return this.request?.context?.offering || this.request?.context?.incomingOffer?.offering || null
    },

    incomingRequest() {
      return this.request?.context?.requesting || this.request?.context?.incomingOffer?.requesting || null
    },

    incomingOfferItems() {
      return this.incomingOffer ? this._describeOffer(this.incomingOffer) : []
    },

    incomingRequestItems() {
      return this.incomingRequest ? this._describeOffer(this.incomingRequest) : []
    },

    maxOfferTg() {
      return this.currentPlayer?.tradeGoods || 0
    },

    maxOfferComm() {
      return this.currentPlayer?.commodities || 0
    },

    // Promissory notes
    myNotes() {
      return this.currentPlayer?.getPromissoryNotes?.() || this.currentPlayer?.promissoryNotes || []
    },

    targetNotes() {
      return this.targetPlayer?.getPromissoryNotes?.() || this.targetPlayer?.promissoryNotes || []
    },

    // Action cards (Hacan Arbiters)
    canTradeActions() {
      if (!this.currentPlayer || !this.targetPlayer) {
        return false
      }
      return this.game.factionAbilities?.canTradeActionCards?.(this.currentPlayer, this.targetPlayer) ?? false
    },

    myActionCards() {
      return this.currentPlayer?.actionCards || []
    },

    targetActionCards() {
      return this.targetPlayer?.actionCards || []
    },

    hasOffer() {
      return (this.offerTg + this.offerComm + this.requestTg + this.requestComm) > 0
        || this.offeredNotes.length > 0
        || this.requestedNotes.length > 0
        || this.offeredActionCards.length > 0
        || this.requestedActionCards.length > 0
    },
  },

  methods: {
    // Review mode
    respond(choice) {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: [choice],
      })
    },

    // Edit mode
    submit() {
      const offering = { tradeGoods: this.offerTg, commodities: this.offerComm }
      const requesting = { tradeGoods: this.requestTg, commodities: this.requestComm }

      if (this.offeredNotes.length > 0) {
        offering.promissoryNotes = [...this.offeredNotes]
      }
      if (this.requestedNotes.length > 0) {
        requesting.promissoryNotes = [...this.requestedNotes]
      }
      if (this.offeredActionCards.length > 0) {
        offering.actionCards = [...this.offeredActionCards]
      }
      if (this.requestedActionCards.length > 0) {
        requesting.actionCards = [...this.requestedActionCards]
      }

      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: {
          action: 'trade-offer',
          offering,
          requesting,
        },
      })
    },

    cancel() {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: ['Cancel'],
      })
    },

    // Promissory note toggling (max 1 per side per Rule 69.2)
    isNoteOffered(note) {
      return this.offeredNotes.some(n => n.id === note.id && n.owner === note.owner)
    },

    isNoteRequested(note) {
      return this.requestedNotes.some(n => n.id === note.id && n.owner === note.owner)
    },

    toggleOfferNote(note) {
      const idx = this.offeredNotes.findIndex(n => n.id === note.id && n.owner === note.owner)
      if (idx !== -1) {
        this.offeredNotes.splice(idx, 1)
      }
      else {
        // Rule 69.2: max 1 promissory note per side
        this.offeredNotes = [{ id: note.id, owner: note.owner }]
      }
    },

    toggleRequestNote(note) {
      const idx = this.requestedNotes.findIndex(n => n.id === note.id && n.owner === note.owner)
      if (idx !== -1) {
        this.requestedNotes.splice(idx, 1)
      }
      else {
        this.requestedNotes = [{ id: note.id, owner: note.owner }]
      }
    },

    // Action card toggling
    toggleOfferActionCard(cardId) {
      const idx = this.offeredActionCards.indexOf(cardId)
      if (idx !== -1) {
        this.offeredActionCards.splice(idx, 1)
      }
      else {
        this.offeredActionCards.push(cardId)
      }
    },

    toggleRequestActionCard(cardId) {
      const idx = this.requestedActionCards.indexOf(cardId)
      if (idx !== -1) {
        this.requestedActionCards.splice(idx, 1)
      }
      else {
        this.requestedActionCards.push(cardId)
      }
    },

    formatNote(note) {
      const name = note.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      if (note.owner !== this.currentPlayer?.name && note.owner !== this.partnerName) {
        return `${name} (${note.owner})`
      }
      return name
    },

    _describeOffer(offer) {
      const items = []
      if (offer.tradeGoods > 0) {
        items.push(`${offer.tradeGoods} Trade Good${offer.tradeGoods > 1 ? 's' : ''}`)
      }
      if (offer.commodities > 0) {
        items.push(`${offer.commodities} Commodit${offer.commodities > 1 ? 'ies' : 'y'}`)
      }
      if (offer.promissoryNotes?.length > 0) {
        for (const note of offer.promissoryNotes) {
          items.push(this.formatNote(note))
        }
      }
      if (offer.actionCards?.length > 0) {
        items.push(`${offer.actionCards.length} Action Card${offer.actionCards.length > 1 ? 's' : ''}`)
      }
      if (offer.planet) {
        items.push(`Planet: ${offer.planet}`)
      }
      if (offer.capturedUnits?.length > 0) {
        items.push(`${offer.capturedUnits.length} Captured Unit${offer.capturedUnits.length > 1 ? 's' : ''}`)
      }
      return items
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

/* Incoming offer display */
.incoming-offer {
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  border-radius: 4px;
  padding: .4em;
  margin-bottom: .5em;
}

.incoming-label {
  font-weight: 600;
  font-size: .75em;
  color: #e65100;
  margin-bottom: .25em;
}

.incoming-columns {
  display: flex;
  gap: .5em;
}

.incoming-col {
  flex: 1;
}

.incoming-items {
  display: flex;
  flex-direction: column;
  gap: .1em;
}

.incoming-item {
  font-size: .75em;
  padding: .1em .3em;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.incoming-item.empty {
  color: #999;
  font-style: italic;
  border: none;
  background: none;
}

/* Partner resources */
.partner-resources {
  font-size: .75em;
  color: #666;
  margin-bottom: .35em;
  display: flex;
  gap: .5em;
}

.partner-label {
  font-weight: 600;
}

/* Trade columns */
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

/* Chip selection for notes/cards */
.trade-resource-list {
  margin-top: .25em;
}

.list-label {
  font-size: .75em;
  color: #777;
  display: block;
  margin-bottom: .15em;
}

.trade-chip {
  display: inline-block;
  font-size: .75em;
  padding: .15em .4em;
  margin: .1em .15em .1em 0;
  border: 1px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  background: #fff;
}

.trade-chip.selected {
  background: #9c27b0;
  color: #fff;
  border-color: #9c27b0;
}

.trade-chip:hover {
  border-color: #9c27b0;
}

.action-buttons {
  display: flex;
  gap: .35em;
  margin-top: .35em;
}
</style>
