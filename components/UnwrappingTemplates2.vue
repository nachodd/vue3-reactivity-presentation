<script setup>
import {ref} from "vue"
const object = { id: ref(1) }
</script>

<template>
  <div>
  <div>TEST: <span>{{ object.id }}</span></div>
  </div>
</template>
