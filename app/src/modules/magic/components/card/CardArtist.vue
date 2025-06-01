<template>
  <div class="artist-name">
    <span class="artist-icon"><i class="ms ms-artist-nib"/></span>
    <ScarrableContent v-bind="scarrable" class="artist-text" />
  </div>
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

const scarrable = useScarrableContent(props.card, props.index, 'artist', emit, {
  editable: props.isEditable,
  oldVersions: [],
})
</script>

<style scoped>
.artist-name {
  display: flex;
  align-items: center;
}

.artist-icon {
  display: inline-flex;
  margin-right: 4px;
}

.artist-text {
  flex: 1;
}
</style>
