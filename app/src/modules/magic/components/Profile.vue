<template>
  <div class="magic-profile container">
    <div class="row">

      <div class="col">
        <MagicMenu />
        <SectionHeader>My Data</SectionHeader>
      </div>

      <div class="col">
        <DraftList />
      </div>

      <div class="col">
        <!-- <PublicCubes /> -->
      </div>

    </div>

  </div>
</template>


<script>
import { mapState } from 'vuex'

import DraftList from './DraftList'
import MagicMenu from './MagicMenu'
import PublicCubes from './PublicCubes'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'MagicProfile',

  components: {
    DraftList,
    MagicMenu,
    PublicCubes,
    SectionHeader,
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
