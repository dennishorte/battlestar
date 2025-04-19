<template>
  <Modal @ok="onOkay" ref="modalTop">
    <template #header>
      <slot name="header"></slot>
    </template>

    <div class="type-ahead">
      <input class="form-control" v-model="name" placeholder="card name" ref="searchField" />
    </div>

    <div class="versions">

      <template v-if="matched.length === 0">
        no matches
      </template>

      <template v-else>
        <div class="versions-list">
          <div
            v-for="match of matched"
            class="version-text"
            @click="selectVersion(match)"
            :class="match === selected ? 'version-selected' : ''"
          >
            {{ match.name() }}
            {{ match.power(0) }}
            / {{ match.toughness(0) }}
            {{ match.oracleText(0) }}
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
import { mag, util } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CubeAddModal',

  components: {
    Card,
    Modal,
  },

  props: {
    cards: {
      Array,
      optional: true,
    }
  },

  data() {
    return {
      name: '',
      selected: null,
    }
  },

  computed: {
    cardsByName() {
      if (this.cards) {
        return mag.util.card.lookup.generateLookup(this.cards).byName
      }
      else {
        return this.$store.getters['magic/cards/cards'].byName
      }
    },

    matched() {
      const base = this.cardsByName[this.name.toLowerCase()]
      if (!base) {
        return []
      }
      const distinct = []
      for (const a of base) {
        if (!distinct.some(b => b.same(a))) {
          distinct.push(a)
        }
      }
      this.selected = distinct[0]
      return distinct
    },
  },

  methods: {
    onOkay() {
      if (this.selected) {
        this.$emit('card-selected', this.selected)
      }
    },

    selectVersion(card) {
      this.selected = card
    },
  },

  mounted() {
    this.$refs.modalTop.$el.addEventListener('shown.bs.modal', () => {
      this.$refs.searchField.focus()
    })
  }
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
