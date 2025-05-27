<template>
  <div class="frame-defense" v-if="isSiege">
    <div class="defense-container">
      <i class="ms ms-defense defense-background"/>
      <EditableContent v-bind="defenseEditor" class="defense-number" />
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useEditableContent } from '@/composables/useEditableContent.js'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  face: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['value-updated'])

const defense = computed(() => props.face.defense)
const isSiege = computed(() => props.face.type_line.toLowerCase().includes('siege'))

const defenseEditor = useEditableContent(defense.value, {
  onUpdate: (value) => emit('value-updated', { field: 'defense', value }),
})
</script>


<style scoped>
.defense-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.defense-background {
  position: absolute;
  color: black;
  font-size: 3em;
  z-index: 1;
  -webkit-text-stroke: 2px #aaa;
  text-stroke: 2px #aaa;
}

.defense-number {
  position: relative;
  color: white;
  z-index: 2;
  font-size: 1em;
}
</style>
