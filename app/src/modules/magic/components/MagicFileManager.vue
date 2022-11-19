<template>
  <div v-if="loading" class="alert alert-warning">Loading file data...</div>

  <FileManager
    v-else
    :filelist="filelist"
    :file-types="['card', 'cube', 'deck']"
    @file-creating="createFile"
    @file-deleting="deleteFile"
    @file-duplicating="duplicateFile"
    @file-opening="openFile"
    @file-updating="updateFile"
    @selection-changed="selectionChanged"
  />
</template>


<script>
import axios from 'axios'

import FileManager from '@/components/filemanager/FileManager'
import Header from '@/components/Header'


export default {
  name: 'MagicFileManager',

  components: {
    FileManager,
    Header,
  },

  props: {
    filelist: {
      type: Array,
      default: [],
    }
  },

  data() {
    return {
      loading: true,
    }
  },

  methods: {
    createFile(data) {
      this.$store.dispatch('magic/file/create', data)
    },

    deleteFile(data) {
      this.$store.dispatch('magic/file/delete', data)
    },

    duplicateFile(data) {
      this.$store.dispatch('magic/file/duplicate', data)
    },

    async openFile({ file }) {
      if (file.kind === 'deck') {
        await this.$store.dispatch('magic/dm/selectDeck', file)
        await this.$router.push('/magic/decks')
      }
      else if (file.kind === 'cube') {
        this.$router.push('/magic/cube/' + file._id)
      }
      else {
        alert('Cannot open file of kind: ' + file.kind)
      }
    },

    selectionChanged({ newValue }) {
      console.log(newValue)
    },

    updateFile(data) {
      this.$store.dispatch('magic/file/update', data)
    },
  },

  async mounted() {
    console.log(this.$store)
    await this.$store.dispatch('magic/file/fetchAll')
    this.loading = false
  },
}
</script>
