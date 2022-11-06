<template>
  <div class="deck-selector">
    <SectionHeader>
      <div class="header-content">
        <div>Deck Selector</div>
        <div class="icons">
          <i class="bi-files"></i>&nbsp;
          <i class="bi-plus-square"></i>&nbsp;
          <i class="bi-pencil-square"></i>
        </div>
      </div>
    </SectionHeader>

    <DeckFolder v-if="root" :content="root" />

  </div>
</template>


<script>
import { mapState } from 'vuex'

import DeckFolder from './DeckFolder'
import SectionHeader from '@/components/SectionHeader'


export default {
  name: 'DeckSelector',

  components: {
    DeckFolder,
    SectionHeader,
  },

  computed: {
    ...mapState('magic/dm', {
      root: state => state.decks[0]
    }),
  },
}
</script>


<style scoped>
.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.icons {
  display: flex;
  flex-direction: row;
}
</style>
