<template>
  <div class="frame-flavor-wrapper">
    <EditableContent v-bind="editor" class="frame-flavor-text" />
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

const flavorText = computed(() => props.face.flavor_text)

const editor = useEditableContent(flavorText.value, {
  onUpdate: (value) => emit('value-updated', { field: 'flavor_text', value }),
})

watch(flavorText, (newValue) => editor.setValue(newValue))
</script>
