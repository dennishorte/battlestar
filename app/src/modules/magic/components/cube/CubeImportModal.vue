<template>
  <Modal id="cube-update-modal" @ok="ok">
    <template #header>Update Cube</template>

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
import { mag, util } from 'battlestar-common'
import { mapState } from 'vuex'

import Modal from '@/components/Modal'


export default {
  name: 'CubeImportModal',

  components: {
    Modal,
  },

  data() {
    return {
      updateText: '',
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardData: 'cards',
    }),

    ...mapState('magic/cube', {
      cube: 'cube',
    }),

    parsedUpdate() {
      const items = mag.util.card.parseCardlist(this.updateText)
      for (const item of items) {
        if (item.remove) {
          // Try to find the item in the existing cube list.
          const target = this.cube.cards().find(c => c.name().toLowerCase() === item.name)
          if (target) {
            item.card = target
          }
        }
        else {
          // Try to find the item in the list of all cards.
          const versions = this.cardData.byName[item.name]
          if (versions && versions.length > 0) {
            item.card = util.array.last(versions)
          }
        }
      }

      const operations = {
        insert: [],
        remove: [],
        unknown: [],
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
    },
  },

  methods: {
    ok() {
      this.$emit('cube-updates', this.parsedUpdate)
      this.updateText = ''
    },
  },
}
</script>
