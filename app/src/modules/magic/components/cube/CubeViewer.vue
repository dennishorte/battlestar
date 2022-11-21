<template>
  <MagicWrapper :alsoLoading="loadingCube">
    <div class="cube-viewer">
      <MagicMenu />
      <h1>{{ cube.name }}</h1>
      <button class="btn btn-success" @click="$modal('cube-update-modal').show()">Add/Remove Cards</button>
      <CardListItem v-for="card in cards" :card="card" />
    </div>


    <Modal id="cube-update-modal" @ok="updateCube">
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

  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import cardUtil from '../../util/cardUtil.js'
import cubeUtil from '../../util/cubeUtil.js'
import { mapState } from 'vuex'

import CardListItem from '../CardListItem'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'
import Modal from '@/components/Modal'


export default {
  name: 'CubeViewer',

  components: {
    CardListItem,
    MagicMenu,
    MagicWrapper,
    Modal,
  },

  data() {
    return {
      cube: null,
      id: this.$route.params.id,
      loadingCube: true,

      updateText: '',
    }
  },

  computed: {
    ...mapState('magic/cards', {
      lookup: 'lookup',
    }),

    cards() {
      cardUtil.lookup.insertCardData(this.cube.cardlist, this.lookup)
      return this.cube.cardlist
    },

    parsedUpdate() {
      const cards = cardUtil.parseCardlist(this.updateText)
      cardUtil.lookup.insertCardData(cards, this.lookup)

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
    async loadCube() {
      this.loading = true

      const requestResult = await axios.post('/api/magic/cube/fetch', {
        cubeId: this.id
      })

      if (requestResult.data.status === 'success') {
        this.cube = cubeUtil.deserialize(requestResult.data.cube)
        this.loadingCube = false
      }
      else {
        alert('Error loading cube: ' + this.id)
      }
    },

    updateCube() {
      for (const card of this.parsedUpdate.remove) {
        this.cube.removeCard(card)
      }

      for (const card of this.parsedUpdate.insert) {
        this.cube.addCard(card)
      }

      if (this.parsedUpdate.unknown.length) {
        const lines = ['Unable to add unknown cards:']
        for (const card of this.parsedUpdate.unknown) {
          lines.push(card.name)
        }
        alert(lines.join('\n'))
      }
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.loadCube()
    },
  },

  async mounted() {
    await this.loadCube()
  },
}
</script>


<style scoped>
.update-data {
  margin-top: .25em;
  font-size: .8em;
  font-color: var(--bs-gray-700);
}

.update-data-heading {
  font-weight: bold;
}
</style>
