<template>
  <div class="magic-profile container">
    <div class="row">

      <div class="col">
        <MagicMenu />
        <SectionHeader>My Data</SectionHeader>
        <MagicFileManager class="file-manager" :filelist="filelist" />
      </div>

      <div class="col">
        <DraftList />
      </div>

      <div class="col">
      </div>

    </div>

  </div>
</template>


<script>
import { mapState } from 'vuex'

import DraftList from './DraftList'
import MagicFileManager from './MagicFileManager'
import MagicMenu from './MagicMenu'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'MagicProfile',

  components: {
    DraftList,
    MagicFileManager,
    MagicMenu,
    SectionHeader,
  },

  computed: {
    ...mapState('magic/file', {
      filelist: 'filelist',
    })
  },
}
</script>


<style scoped>
.file-manager {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  min-height: 17rem;
  border-radius: .25em;
}
</style>
