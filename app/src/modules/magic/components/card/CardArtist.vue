<template>
  <div class="artist-name">
    <span class="artist-icon"><i class="ms ms-artist-nib"/></span>
    <EditableContent v-bind="editor" class="artist-text" />
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
  isEditable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['value-updated'])

const artist = computed(() => props.face.artist)

const editor = useEditableContent(artist.value, {
  editable: props.isEditable,
  onUpdate: (value) => emit('value-updated', { field: 'artist', value }),
})

watch(artist, (newValue) => editor.setValue(newValue))
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
