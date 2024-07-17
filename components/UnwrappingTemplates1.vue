<script setup>
import {ref} from "vue"
const object = { id: ref(1) }
const { id } = object
</script>

<template>
  <div>
  <div>TEST: <span>{{ id + 1 }}</span></div>
  </div>
</template>
