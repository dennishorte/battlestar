<template>
  <div class="frame-flavor-wrapper">
    <EditableContent v-bind="flavorTextEditor" class="frame-flavor-text" />
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

const flavorText = computed(() => props.face.flavor_text)

const flavorTextEditor = useEditableContent(flavorText.value, {
  onUpdate: (value) => emit('value-updated', { field: 'flavor_text', value }),
})
</script>
