<template>
  <div class="loyalty-container">
    <i class="ms ms-loyalty-start loyalty-background"/>
    <EditableContent v-bind="loyaltyEditor" class="loyalty-number" />
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'

const props = defineProps({
  face: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['value-updated'])

const loyalty = computed(() => props.face.loyalty)

const loyaltyEditor = useEditableContent(loyalty.value, {
  onUpdate: (value) => emit('value-updated', { field: 'loyalty', value }),
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
