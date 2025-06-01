<template>
  <div class="frame-defense" v-if="isSiege">
    <div class="defense-container">
      <i class="ms ms-defense defense-background"/>
      <ScarrableContent v-bind="scarrable" class="defense-number" />
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

const isSiege = computed(() => props.card.face(props.index).type_line.toLowerCase().includes('siege'))

const scarrable = useScarrableContent(toRef(props, 'card'), props.index, 'defense', emit, {
  editable: props.isEditable,
  oldVersions: [],
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
