<template>
  <div v-if="loading" class="alert alert-warning">Loading file data...</div>

  <FileManager
    v-else
    :filelist="filelist"
    :file-types="['Card', 'Deck', 'Set']"
    @file-creating="createFile"
    @file-deleting="deleteFile"
    @file-duplicating="duplicateFile"
    @file-opening="openFile"
    @file-updating="updateFile"
  />
</template>


<script>
import FileManager from '@/components/filemanager/FileManager'
import Header from '@/components/Header'


export default {
  name: 'MagicFileManager',

  components: {
    FileManager,
    Header,
  },

  data() {
    return {
      filelist: null,
      loading: true,
    }
  },

  methods: {
    createFile(data) {
      console.log('create', data)
    },

    deleteFile(data) {
      console.log('delete', data)
    },

    duplicateFile(data) {
      console.log('duplicate', data)
    },

    openFile(data) {
      console.log('open', data)
    },

    updateFile(data) {
      console.log('update', data)
    },
  },

  mounted() {
    this.filelist = [
      {
        name: 'Red Wins',
        path: '/decks',
        kind: 'Deck',
      },
      {
        name: 'CLO',
        path: '/cubes',
        kind: 'Set',
      },
    ]
    this.loading = false
  },
}
</script>
