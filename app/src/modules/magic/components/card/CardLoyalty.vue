<template>
  <!-- The loyalty > 0 check covers flip walkers who don't have loyalty on their second side. -->
  <div class="frame-loyalty" v-if="isPlaneswalker && loyalty > 0">
    <div class="loyalty-container">
      <i class="ms ms-loyalty-start loyalty-background"/>
      <ScarrableContent v-bind="scarrable" class="loyalty-number" />
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useScarrableContent } from '../../composables/card/useScarrableContent.js'

import ScarrableContent from './ScarrableContent.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['value-updated'])

const isPlaneswalker = computed(() => props.card.isPlaneswalker(props.index))
const loyalty = computed(() => props.card.loyalty(props.index))

const scarrable = useScarrableContent(props.card, props.index, 'loyalty', emit, {
  emit,
  editable: props.isEditable,
  oldVersions: ['3'],
})
</script>


<style scoped>
.loyalty-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loyalty-background {
  position: absolute;
  color: black;
  font-size: 3em;
  z-index: 1;
  -webkit-text-stroke: 2px #aaa;
  text-stroke: 2px #aaa;
}

.loyalty-number {
  position: relative;
  color: white;
  z-index: 2;
  font-size: 1em;
}
</style>
