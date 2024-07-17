<template>
  <div class="slidev-layout">
    <h1 v-if="$attrs.slideTitle">{{ $attrs.slideTitle }}</h1>
    <div class="grid grid-cols-2 gap-16">
      <div class="prose">
        <slot name="default" />
      </div>
      <div class="prose">
        <slot name="right" />
      </div>
    </div>
    <div v-if="$attrs.footer" v-html="$attrs.footer"></div>
  </div>
</template>
