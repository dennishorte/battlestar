<template>
  <span
    class="ti-relic-token"
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

const relic = computed(() => {
  return res.getAllRelics().find(r => r.name === props.name)
})

function showDetails() {
  if (relic.value) {
    ui.modals.cardDetail.type = 'relic'
    ui.modals.cardDetail.id = relic.value.id
    ui.modals.cardDetail.context = null
    modal.getModal('twilight-card-detail')?.show()
  }
}
</script>

<style scoped>
.ti-relic-token {
  display: inline;
  font-weight: 600;
  padding: .1em .35em;
  border-radius: .2em;
  background: #fff3e0;
  color: #e65100;
  border-left: 2px solid #e65100;
  cursor: pointer;
}
.ti-relic-token:hover {
  background: #ffe0b2;
}
</style>
