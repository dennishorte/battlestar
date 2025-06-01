<template>
  <ScarrableContent v-bind="scarrable" class="frame-card-name" />
</template>

<script setup>
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

const scarrable = useScarrableContent(props.card, props.index, 'name', emit, {
  editable: props.isEditable,
  oldVersions: [],
})
</script>
