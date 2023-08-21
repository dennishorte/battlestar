<template>
  <Modal @ok="importCardDo">
    <template #header>Insert Card</template>

    <div class="type-ahead">
      <input class="form-control" v-model="name" placeholder="card name" />
    </div>

    <select class="form-select mt-2" v-model="zoneId">
      <option v-for="zoneId in importZoneIds">{{ zoneId }}</option>
    </select>
    <input class="form-control mt-2" v-model.number="count" placeholder="count" />

    <input class="form-control mt-2" v-model="annotation" placeholder="annotation" />

    <div class="form-check mt-2">
      <input class="form-check-input" type="checkbox" v-model="isToken" />
      <label class="form-check-label">token</label>
    </div>
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
      annotation: '',
      count: 1,
      isToken: true,
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
          annotation: this.annotation,
          count: this.count,
          zoneId: this.zoneId,
          isToken: this.isToken,
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
.form-check-input {
  width: 1.5em;
  height: 1.5em;
}

.form-check-label {
  font-size: 1.2em;
  margin-left: .25em;
}
</style>
