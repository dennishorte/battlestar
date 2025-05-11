<template>
  <div class="offcanvas offcanvas-start">
    <div class="offcanvas-header">
      <h5>
        <slot name="header"/>
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"/>
    </div>

    <div class="offcanvas-body">
      <slot/>
    </div>
  </div>
</template>


<script>
export default {
  name: 'OffCanvas',
}
</script>
