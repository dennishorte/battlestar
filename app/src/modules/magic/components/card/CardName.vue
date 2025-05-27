<template>
  <EditableContent v-bind="nameEditor" class="frame-card-name" />
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

const name = computed(() => props.face.name)

const nameEditor = useEditableContent(name.value, {
  onUpdate: (value) => emit('value-updated', { field: 'name', value }),
})
</script>
