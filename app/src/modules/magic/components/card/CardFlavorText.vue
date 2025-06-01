<template>
  <div class="frame-flavor-wrapper">
    <ScarrableContent
      v-bind="scarrable"
      class="frame-flavor-text"
      style="white-space: pre-line;"
    />
  </div>
</template>

<script setup>
import { toRef } from 'vue'
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

const scarrable = useScarrableContent(toRef(props, 'card'), props.index, 'flavor_text', emit, {
  editable: props.isEditable,
  multiline: true,
  oldVersions: [],
})
</script>
