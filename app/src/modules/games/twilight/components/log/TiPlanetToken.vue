<template>
  <span
    class="ti-planet-token"
    :style="borderStyle"
    @click.stop="showDetails"
  >{{ displayName }}</span>
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

const planet = computed(() => {
  return res.getPlanet(props.name)
})

const displayName = computed(() => {
  return planet.value?.name || props.name
})

const traitColors = {
  cultural: '#1565c0',
  hazardous: '#c62828',
  industrial: '#2e7d32',
}

const borderStyle = computed(() => {
  const color = traitColors[planet.value?.trait] || '#888'
  return { 'border-left-color': color }
})

function showDetails() {
  if (planet.value) {
    ui.modals.cardDetail.type = 'planet'
    ui.modals.cardDetail.id = props.name
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
}
</script>

<style scoped>
.ti-planet-token {
  display: inline;
  font-weight: 600;
  padding: .1em .35em;
  border-radius: .2em;
  border-left: 3px solid;
  background: #f8f9fa;
  color: #333;
  cursor: pointer;
}
.ti-planet-token:hover {
  filter: brightness(0.93);
}
</style>
