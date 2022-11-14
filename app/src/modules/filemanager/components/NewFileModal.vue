<template>
  <Modal id="new-file-modal" @ok="createFile">
    <template #header>New File</template>
    <input class="form-control" v-model="newFileName" placeholder="name" />
    <input class="form-control" :value="newFilePath" placeholder="path" disabled />

    <FileFolder v-if="root" :content="root" />
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'


export default {
  name: 'NewFileModal',
}
</script>
