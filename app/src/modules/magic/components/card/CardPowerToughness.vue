<template>
  <div class="frame-power-toughness frame-foreground" v-if="isCreature">
    <div class="power-toughness-container">
      <EditableContent v-bind="powerEditor" class="frame-power" />
      <span class="power-toughness-separator">/</span>
      <EditableContent v-bind="toughnessEditor" class="frame-toughness" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  face: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['value-updated'])

const power = computed(() => props.face.power)
const toughness = computed(() => props.face.toughness)
const isCreature = computed(() => props.face.type_line.toLowerCase().includes('creature'))

const powerEditor = useEditableContent(power.value, {
  onUpdate: (value) => emit('value-updated', { field: 'power', value }),
})

const toughnessEditor = useEditableContent(toughness.value, {
  onUpdate: (value) => emit('value-updated', { field: 'toughness', value }),
})

watch(power, (newValue) => powerEditor.setValue(newValue))
watch(toughness, (newValue) => toughnessEditor.setValue(newValue))
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
