<template>
  <Modal @ok="addCard" id="cube-add-modal">
    <template #header>Add Single Card</template>

    <div class="type-ahead">
      <input class="form-control" v-model="name" placeholder="card name" @input="checkVersions" />
    </div>

    <div class="versions">

      <template v-if="cards.length === 0">
        no matches
      </template>

      <template v-else>
        <div class="versions-list">
          <div
            v-for="version of versions"
            class="version-text"
            @click="selectVersion(version)"
            :class="version === selected ? 'version-selected' : ''"
          >
            {{ version.name }}
            {{ version.card_faces[0].power }}
            / {{ version.card_faces[0].toughness }}
            {{ version.card_faces[0].oracle_text }}
          </div>
        </div>

        <div class="preview">
          <Card :card="selected" :size="160" />
        </div>
      </template>
    </div>
  </Modal>
</template>


<script>
import { mapGetters } from 'vuex'
import { mag } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CubeAddModal',

  components: {
    Card,
    Modal,
  },

  data() {
    return {
      name: '',

      cards: [],
      selected: null,
    }
  },

  computed: {
    ...mapGetters('magic/game', {
      importZoneIds: 'importZoneIds',
    }),

    versions() {
      const unique = []
      for (const card of this.cards) {
        if (unique.some(other => mag.util.card.playableStatsEquals(card, other))) {
          continue
        }
        else {
          unique.push(card)
        }
      }

      return unique
    },
  },

  methods: {
    addCard() {
      this.$emit('cube-updates', {
        insert: [this.selected],
        remove: [],
        unknown: [],
      })
    },

    checkVersions() {
      this.cards = this.$store.getters['magic/cards/getLookupFunc'](
        { name: this.name },
        { allVersions: true },
      ) || []

      if (this.cards) {
        this.selected = this.cards[0]
      }
    },

    selectVersion(card) {
      this.selected = card
    },
  },
}
</script>


<style scoped>
.versions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.versions-list {
  min-width: 0;
}

.version-text {
  overflow-x: hidden;
  white-space: nowrap;
  padding: 0 .25em;
}

.version-selected {
  background-color: #7df;
}
</style>
