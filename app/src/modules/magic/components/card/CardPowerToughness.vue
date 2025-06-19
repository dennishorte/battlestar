<template>
  <div class="frame-power-toughness frame-foreground" v-if="isCreature || isVehicle">
    <div class="power-toughness-container">
      <ScarrableContent v-bind="powerScarrable" class="frame-power" />
      <span class="power-toughness-separator">/</span>
      <ScarrableContent v-bind="toughnessScarrable" class="frame-toughness" />
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
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

const isCreature = computed(() => props.card.isCreature(props.index))
const isVehicle = computed(() => props.card.isVehicle(props.index))

const powerScarrable = useScarrableContent(toRef(props, 'card'), props.index, 'power', emit, {
  editable: props.isEditable,
})

const toughnessScarrable = useScarrableContent(toRef(props, 'card'), props.index, 'toughness', emit, {
  editable: props.isEditable,
})
</script>

<style scoped>
.power-toughness-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.power-toughness-separator {
  margin: -1px;
}

.frame-power,
.frame-toughness {
  min-width: 1em;
  text-align: center;
}
</style>
