<template>
  <ScarrableContent v-bind="scarrable" class="frame-card-type" style="width: 100%;" />
</template>

<script setup>
import { magic } from 'battlestar-common'
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

const DASH = magic.util.wrapper.card.TYPELINE_DASH
const DASH_REGEX = magic.util.wrapper.card.TYPELINE_SPLITTER_REGEX

const scarrable = useScarrableContent(props.card, props.index, 'type_line', emit, {
  editable: props.isEditable,
  oldVersions: [],
  onUpdate: (value) => {
    const correctedDash = value.replace(DASH_REGEX, DASH)
    emit('value-updated', { field: 'type_line', value: correctedDash })
  },
})
</script>
