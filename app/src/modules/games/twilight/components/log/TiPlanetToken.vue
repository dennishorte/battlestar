<template>
  <span
    class="ti-planet-token"
    :style="borderStyle"
    @click.stop="showDetails"
  >
    <span v-if="ownerColor" class="owner-dot" :style="{ backgroundColor: ownerColor }" />
    {{ displayName }}
    <span class="planet-values">{{ planet?.resources || 0 }}R/{{ planet?.influence || 0 }}I</span>
  </span>
</template>

<script setup>
import { computed, inject } from 'vue'
import { twilight } from 'battlestar-common'
import modal from '@/util/modal'

const res = twilight.res

const props = defineProps({
  name: { type: String, default: '' },
})

const game = inject('game')
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

const ownerColor = computed(() => {
  const planetState = game.value?.state?.planets?.[props.name]
  if (!planetState?.controller) {
    return null
  }
  const player = game.value?.players?.byName(planetState.controller)
  return player?.color || null
})

function showDetails() {
  const systemId = planet.value?.systemId
  if (systemId != null) {
    ui.modals.systemDetail.systemId = systemId
    modal.getModal('twilight-system-detail')?.show()
  }
}
</script>

<style scoped>
.ti-planet-token {
  display: inline-flex;
  align-items: center;
  gap: .2em;
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

.planet-values {
  font-size: .85em;
  font-weight: 400;
  opacity: .7;
}

.owner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
