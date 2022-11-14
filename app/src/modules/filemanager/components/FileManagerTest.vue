<template>
  <div class="container">

    <div class="row">
      <div class="col">
        <FileManager />
      </div>
      <div class="col">
        <FileManager :filelist="singleFile" />
      </div>
    </div>


    <div class="row">
      <div class="col">
        <FileManager :filelist="emptyFileList" />
      </div>
      <div class="col">
        <FileManager :filelist="complexFiles" />
      </div>
    </div>

  </div>
</template>


<script>
import FileManager from './FileManager'


export default {
  name: 'FileManagerTest',

  data() {
    return {
      emptyFileList: [],
      singleFile: [{
        name: 'single file',
        path: '/',
        kind: 'text'
      }],
      complexFiles: [
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'world',
          path: '/',
          kind: 'text',
        },
      ],
    }
  },

  components: {
    FileManager,
  },
}
</script>


<style>
.file-manager {
  min-height: 10em;
  background-color: lightgray;
  border: 1px solid gray;
  margin: .25em;
  padding: .25em;
}
</style>
