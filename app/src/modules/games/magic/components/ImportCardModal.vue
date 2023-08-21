<template>
  <Modal @ok="importCardEmit">
    <template #header>Insert Card</template>

    <div class="type-ahead">
      <input class="form-control" v-model="name" placeholder="card name" @input="checkVersions" />
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
  name: 'ImportCardModal',

  components: {
    Card,
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

  watch: {
    zoneSuggestion(newValue) {
      this.zoneId = newValue
    },
  },

  methods: {
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

    importCardEmit(card) {
      this.$emit('import-card', {
        card: this.selected,
        annotation: this.annotation,
        count: this.count,
        zoneId: this.zoneId,
        isToken: this.isToken,
      })
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
