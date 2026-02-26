<template>
  <span
    class="ti-tech-token"
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

const tech = computed(() => {
  // Try lookup by ID first, then by name
  return res.getTechnology(props.name)
    || res.getAllTechnologies().find(t => t.name === props.name)
})

const displayName = computed(() => {
  return tech.value?.name || props.name
})

const techColors = {
  blue: '#0d6efd',
  red: '#dc3545',
  yellow: '#ffc107',
  green: '#198754',
  'unit-upgrade': '#6c757d',
}

const borderStyle = computed(() => {
  const color = techColors[tech.value?.color] || '#999'
  return { 'border-left-color': color }
})

function showDetails() {
  if (tech.value) {
    ui.modals.cardDetail.type = 'technology'
    ui.modals.cardDetail.id = tech.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
}
</script>

<style scoped>
.ti-tech-token {
  display: inline;
  font-weight: 600;
  padding: .1em .35em;
  border-radius: .2em;
  border-left: 3px solid;
  background: #f8f9fa;
  color: #333;
  cursor: pointer;
}
.ti-tech-token:hover {
  filter: brightness(0.93);
}
</style>
