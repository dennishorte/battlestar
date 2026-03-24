<template>
  <div class="ti-transaction-log" :class="typeClass">
    <div class="tx-header">
      <span class="tx-label">{{ label }}</span>
    </div>
    <div class="tx-body">
      <div class="tx-side">
        <span class="tx-player-name">{{ from }}</span>
        <span class="tx-arrow">gives</span>
        <div class="tx-items">
          <span v-for="(item, i) in offeringItems" :key="'o'+i" class="tx-item">{{ item }}</span>
          <span v-if="offeringItems.length === 0" class="tx-item tx-empty">nothing</span>
        </div>
      </div>
      <div class="tx-side">
        <span class="tx-player-name">{{ to }}</span>
        <span class="tx-arrow">gives</span>
        <div class="tx-items">
          <span v-for="(item, i) in requestingItems" :key="'r'+i" class="tx-item">{{ item }}</span>
          <span v-if="requestingItems.length === 0" class="tx-item tx-empty">nothing</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  line: { type: Object, required: true },
})

const tx = computed(() => props.line.args?.transaction || {})
const from = computed(() => tx.value.from || '?')
const to = computed(() => tx.value.to || '?')
const offering = computed(() => tx.value.offering || {})
const requesting = computed(() => tx.value.requesting || {})

const typeClass = computed(() => {
  if (props.line.event === 'transaction-counter') {
    return 'tx-counter'
  }
  return 'tx-offer'
})

const label = computed(() => {
  if (props.line.event === 'transaction-counter') {
    return 'Counter-offer'
  }
  return 'Offer'
})

function describeItems(offer) {
  const items = []
  if (offer.tradeGoods > 0) {
    items.push(`${offer.tradeGoods} TG`)
  }
  if (offer.commodities > 0) {
    items.push(`${offer.commodities} Comm`)
  }
  if (offer.promissoryNotes?.length > 0) {
    for (const note of offer.promissoryNotes) {
      const name = note.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      items.push(name)
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
}

const offeringItems = computed(() => describeItems(offering.value))
const requestingItems = computed(() => describeItems(requesting.value))
</script>

<style scoped>
.ti-transaction-log {
  border-radius: .25em;
  padding: .3em .5em;
  margin: .2em 0;
  font-size: .85em;
}

.tx-offer {
  background: #fff3cd;
  border-left: 3px solid #ffc107;
}

.tx-counter {
  background: #ffe0b2;
  border-left: 3px solid #ff9800;
}

.tx-header {
  display: flex;
  align-items: center;
  margin-bottom: .2em;
}

.tx-label {
  font-weight: 700;
  font-size: .85em;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.tx-body {
  display: flex;
  gap: .75em;
}

.tx-side {
  flex: 1;
  min-width: 0;
}

.tx-player-name {
  font-weight: 600;
  font-size: .9em;
}

.tx-arrow {
  font-size: .75em;
  color: #666;
  margin-left: .25em;
}

.tx-items {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
  margin-top: .15em;
}

.tx-item {
  display: inline-block;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: .2em;
  padding: .05em .3em;
  font-size: .85em;
  font-weight: 500;
}

.tx-empty {
  color: #999;
  font-style: italic;
  border-color: transparent;
  background: transparent;
}
</style>
