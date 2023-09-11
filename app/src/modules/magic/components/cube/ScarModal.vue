<template>
  <Modal id="scar-modal">
    <template #header>Scar Creator</template>

    <template v-if="!!scar">
      <label class="form-label">Scar Text</label>
      <textarea class="form-control" v-model="scar.text" />
    </template>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-danger" @click="save" data-bs-dismiss="modal">save</button>
    </template>
  </Modal>
</template>


<script>
import { mapState } from 'vuex'

import Modal from '@/components/Modal'


export default {
  name: 'ScarModal',

  components: {
    Modal,
  },

  computed: {
    ...mapState('magic/cube', {
      scar: 'managedScar'
    }),
  },

  methods: {
    async save() {
      await this.$post('/api/magic/scar/save', {
        scar: this.managedScar,
      })
      await this.$store.dispatch('magic/cube/loadScars')
    },
  },
}
</script>
