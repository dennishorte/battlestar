<template>
  <span
    class="ti-card-token"
    :class="tokenClass"
    @click.stop="showDetails"
  ><span v-if="strategyCard" class="sc-number">{{ strategyCard.number }}</span>{{ name }}</span>
</template>

<script setup>
import { computed, inject } from 'vue'
import { twilight } from 'battlestar-common'
import modal from '@/util/modal'

const res = twilight.res

const props = defineProps({
  name: { type: String, default: '' },
})

const ui = inject('ui')

const strategyCard = computed(() => {
  return res.getAllStrategyCards().find(c => c.name === props.name)
})

const actionCard = computed(() => {
  return res.getAllActionCards().find(c => c.name === props.name)
})

const explorationCard = computed(() => {
  return res.getAllExplorationCards().find(c => c.name === props.name)
})

const tokenClass = computed(() => {
  if (strategyCard.value) {
    return 'ti-strategy-card'
  }
  if (explorationCard.value) {
    return 'ti-exploration-card'
  }
  return 'ti-action-card'
})

function showDetails() {
  if (strategyCard.value) {
    ui.modals.cardDetail.type = 'strategy-card'
    ui.modals.cardDetail.id = strategyCard.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
  else if (actionCard.value) {
    ui.modals.cardDetail.type = 'action-card'
    ui.modals.cardDetail.id = actionCard.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
  else if (explorationCard.value) {
    ui.modals.cardDetail.type = 'exploration-card'
    ui.modals.cardDetail.id = explorationCard.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
}
</script>

<style scoped>
.ti-card-token {
  display: inline;
  font-weight: 600;
  padding: .1em .35em;
  border-radius: .2em;
  cursor: default;
}

.ti-strategy-card {
  background: #343a40;
  color: #fff;
  cursor: pointer;
}
.ti-strategy-card .sc-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  width: 1.3em;
  height: 1.3em;
  background: rgba(255,255,255,.2);
  border-radius: 50%;
  margin-right: .25em;
  font-size: .9em;
}
.ti-strategy-card:hover {
  filter: brightness(1.2);
}

.ti-action-card {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  cursor: pointer;
}
.ti-action-card:hover {
  background: #e0e0e0;
}

.ti-exploration-card {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffcc80;
  cursor: pointer;
}
.ti-exploration-card:hover {
  background: #ffe0b2;
}
</style>
