<template>
  <div class="artist-name">
    <span class="artist-icon"><i class="ms ms-artist-nib"/></span>
    <EditableContent v-bind="artistEditor" class="artist-text" />
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

const artist = computed(() => props.face.artist)

const artistEditor = useEditableContent(artist.value, {
  onUpdate: (value) => emit('value-updated', { field: 'artist', value }),
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
