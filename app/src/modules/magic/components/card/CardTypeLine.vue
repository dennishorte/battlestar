<template>
  <EditableContent v-bind="typeLineEditor" class="frame-card-type" />
</template>

<script setup>
import { computed } from 'vue'
import { magic } from 'battlestar-common'
import { useEditableContent } from '@/composables/useEditableContent.js'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  face: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['value-updated'])

const typeLine = computed(() => props.face.type_line)

const DASH = magic.util.wrapper.card.TYPELINE_DASH
const DASH_REGEX = magic.util.wrapper.card.TYPELINE_SPLITTER_REGEX

const typeLineEditor = useEditableContent(typeLine.value, {
  onUpdate: (value) => {
    const correctedDash = value.replace(DASH_REGEX, DASH)
    emit('value-updated', { field: 'type_line', value: correctedDash })
  },
})
</script>
