<template>
  <span
    class="ti-obj-token"
    :class="chipClass"
    @click.stop="showDetails"
  >{{ displayName }}<span class="obj-stage" :class="badgeClass" v-if="objective">{{ badgeText }}</span></span>
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

const objective = computed(() => {
  return res.getObjective(props.name)
    || [...res.getPublicObjectivesI(), ...res.getPublicObjectivesII(), ...res.getSecretObjectives()]
      .find(o => o.name === props.name)
})

const displayName = computed(() => {
  return objective.value?.name || props.name
})

const chipClass = computed(() => {
  if (!objective.value) {
    return ''
  }
  if (objective.value.type === 'secret') {
    return 'obj-secret'
  }
  return `obj-stage-${objective.value.stage}`
})

const badgeClass = computed(() => {
  if (!objective.value) {
    return ''
  }
  if (objective.value.type === 'secret') {
    return 'badge-secret'
  }
  return `badge-stage-${objective.value.stage}`
})

const badgeText = computed(() => {
  if (!objective.value) {
    return ''
  }
  if (objective.value.type === 'secret') {
    return 'Secret'
  }
  return `Stage ${objective.value.stage}`
})

function showDetails() {
  if (objective.value) {
    ui.modals.cardDetail.type = 'objective'
    ui.modals.cardDetail.id = objective.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
}
</script>

<style scoped>
.ti-obj-token {
  display: inline;
  font-weight: 600;
  padding: .1em .35em;
  border-radius: .2em;
  border-left: 3px solid transparent;
  cursor: pointer;
}
.ti-obj-token:hover {
  filter: brightness(0.93);
}

.obj-stage-1 { background: #fffde7; border-color: #f57f17; color: #333; }
.obj-stage-2 { background: #e3f2fd; border-color: #0d6efd; color: #333; }
.obj-secret { background: #f3e5f5; border-color: #7b1fa2; color: #333; }

.obj-stage {
  font-size: .75em;
  padding: .05em .3em;
  border-radius: .15em;
  margin-left: .3em;
  font-weight: 600;
}

.badge-stage-1 { background: #fff9c4; color: #f57f17; }
.badge-stage-2 { background: #bbdefb; color: #0d6efd; }
.badge-secret { background: #e1bee7; color: #7b1fa2; }
</style>
