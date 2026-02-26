<template>
  <span
    class="ti-card-token"
    :class="tokenClass"
    @click.stop="showDetails"
  >{{ name }}</span>
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

const tokenClass = computed(() => {
  if (strategyCard.value) {
    return 'ti-strategy-card'
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
.ti-strategy-card:hover {
  filter: brightness(1.2);
}

.ti-action-card {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}
</style>
