<template>
  <div class="magic-profile container">
    <div class="row">

      <div class="col">
        <SectionHeader>My Data</SectionHeader>
        <MagicFileManager class="file-manager" />
      </div>

      <div class="col">
        <CardEditor />
      </div>

    </div>
  </div>
</template>


<script>
import CardEditor from './CardEditor'
import MagicFileManager from './MagicFileManager'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'MagicProfile',

  components: {
    CardEditor,
    MagicFileManager,
    SectionHeader
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
