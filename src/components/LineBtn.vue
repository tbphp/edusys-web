<script setup lang="ts">

const props = defineProps({
  isText: {
    type: Boolean,
    default: false
  }
})

const linkUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=` +
  `code&client_id=${import.meta.env.VITE_LINE_CHANNEL_ID}&redirect_uri=` +
  `${import.meta.env.VITE_LINE_CHANNEL_REDIRECT}&state=loginedusys&` +
  `bot_prompt=aggressive&scope=profile%20openid`;

</script>

<template>
    <a :href="linkUrl" v-if="props.isText">绑定Line</a>
    <a :href="linkUrl" v-else class="line-btn block w-[151px] h-[44px] mx-auto" />
</template>

<style lang="less" scoped>
.line-btn {
  background-size: cover;
  background-image: url("@/assets/img/btn_login_base.png");

  &:hover {
    background-image: url("@/assets/img/btn_login_hover.png");
  }

  &:active {
    background-image: url("@/assets/img/btn_login_press.png");
  }
}
</style>
