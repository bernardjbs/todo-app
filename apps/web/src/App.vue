<template>
  <TodoPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoPage from './components/TodoPage.vue';

export default defineComponent({
  name: 'App',
  components: { TodoPage },
});
</script>
