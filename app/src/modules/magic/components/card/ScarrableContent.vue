<template>
  <EditableContent v-bind="editor" />
</template>


<script setup>
import EditableContent from '@/components/EditableContent.vue'

defineProps({
  editor: {
    type: Object,
    required: true,
  },
})
</script>
