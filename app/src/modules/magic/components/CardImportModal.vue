<template>
  <Modal :id="modalId" @ok="ok">
    <template #header>List of Cards/Changes</template>

    <slot name="top-slot"></slot>

    <textarea class="form-control" rows="15" v-model="updateText"></textarea>

    <div class="update-data">
      <div v-if="parsedUpdate.insert.length > 0">
        <span class="update-data-heading">adding:</span> {{ parsedUpdate.insert.length }}
      </div>

      <div v-if="parsedUpdate.remove.length > 0">
        <span class="update-data-heading">removing:</span> {{ parsedUpdate.remove.length }}
      </div>

      <div v-if="parsedUpdate.unknown.length > 0">
        <span class="update-data-heading">unknown cards:</span>
        <div v-for="card in parsedUpdate.unknown">
          {{ card.name }}
        </div>
      </div>
    </div>
  </Modal>
</template>


<script>
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import Modal from '@/components/Modal'


export default {
  name: 'CardImportModal',

  components: {
    Modal,
  },

  props: {
    modalId: String,
  },

  data() {
    return {
      updateText: '',
    }
  },

  computed: {
    parsedUpdate() {
      const cards = mag.util.card.parseCardlist(this.updateText)
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(cards, lookupFunc)

      const operations = {
        insert: [],
        remove: [],
        unknown: [],
      }

      for (const card of cards) {
        if (!card.data) {
          operations.unknown.push(card)
        }
        else if (card.remove) {
          operations.remove.push(card)
        }
        else {
          operations.insert.push(card)
        }
      }

      return operations
    },
  },

  methods: {
    ok() {
      this.$emit('import-card-updates', this.parsedUpdate)
      this.updateText = ''
    },
  },
}
</script>
