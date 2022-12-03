<template>
  <Modal id="import-card-modal" @ok="importCardDo">
    <template #header>Insert Card</template>

    <div class="type-ahead">
      <input class="form-control" v-model="name" placeholder="card name" />
    </div>

    <select class="form-select mt-2" v-model="zoneId">
      <option v-for="zoneId in importZoneIds">{{ zoneId }}</option>
    </select>
    <input class="form-control mt-2" v-model.number="count" placeholder="count" />
  </Modal>
</template>


<script>
import { mapGetters } from 'vuex'

import Modal from '@/components/Modal'


export default {
  name: 'ImportCardModal',

  components: {
    Modal,
  },

  props: {
    zoneSuggestion: String,
  },

  data() {
    return {
      count: 1,
      name: '',
      zoneId: this.zoneSuggestion,
    }
  },

  computed: {
    ...mapGetters('magic/game', {
      importZoneIds: 'importZoneIds',
    }),

  },

  watch: {
    zoneSuggestion(newValue) {
      this.zoneId = newValue
    },
  },

  methods: {
    importCardDo() {
      const card = this.$store.getters['magic/cards/getLookupFunc']({ name: this.name })

      if (card) {
        this.$emit('import-card', {
          card,
          count: this.count,
          zoneId: this.zoneId,
        })
      }
      else {
        alert(`Card not found with name ${name}`)
      }
    },
  },
}
</script>


<style scoped>
</style>
