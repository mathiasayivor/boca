<script setup>
import TheDialogNotificationStack from './components/TheDialogNotificationStack.vue';
import TheDialogMessageStack from './components/TheDialogMessageStack.vue';
</script>

<template>
    <router-view></router-view>
    <TheDialogNotificationStack />
    <TheDialogMessageStack />
</template>
