<template>
  <ModalBase :id="modalId" @ok="handleOk">
    <template #header>
      <slot name="header">Import Cards</slot>
    </template>

    <slot name="top-content"/>

    <textarea class="form-control" rows="15" v-model="updateText"/>

    <div class="update-data">
      <div v-if="parsedUpdate.insert.length > 0">
        <span class="update-data-heading">adding:</span> {{ parsedUpdate.insert.length }}
      </div>

      <div v-if="parsedUpdate.remove.length > 0">
        <span class="update-data-heading">removing:</span> {{ parsedUpdate.remove.length }}
      </div>

      <div v-if="parsedUpdate.unknown.length > 0">
        <span class="update-data-heading">unknown cards:</span>
        <div v-for="(card, index) in parsedUpdate.unknown" :key="index">
          {{ card.name }}
        </div>
      </div>
    </div>

    <slot name="bottom-content"/>
  </ModalBase>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { mag, util } from 'battlestar-common'

import ModalBase from '@/components/ModalBase.vue'

const props = defineProps({
  modalId: {
    type: String,
    required: true
  },
  // Optional prop to provide existing collection (like cube)
  collection: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const store = useStore()
const cardData = computed(() => store.state.magic.cards.cards)

const updateText = ref('')

const parsedUpdate = computed(() => {
  const items = mag.util.card.parseCardlist(updateText.value)

  for (const item of items) {
    if (item.remove && props.collection) {
      // Try to find the item in the existing collection
      const target = props.collection.cardlist().find(c => c.name().toLowerCase() === item.name)
      if (target) {
        item.card = target
      }
    }
    else {
      // Try to find the item in the list of all cards
      const versions = cardData.value.byName[item.name]
      if (versions && versions.length > 0) {
        item.card = util.array.last(versions)
      }
    }
  }

  const operations = {
    insert: [],
    remove: [],
    unknown: []
  }

  for (const item of items) {
    if (!item.card) {
      operations.unknown.push(item)
    }
    else if (item.remove) {
      operations.remove.push(item)
    }
    else {
      operations.insert.push(item)
    }
  }

  return operations
})

const handleOk = () => {
  emit('update', parsedUpdate.value)
  updateText.value = ''
}
</script>
