<template>
  <form class="flex gap-2" @submit.prevent="handleSubmit">
    <div class="flex-1">
      <label for="todo-title" class="sr-only">Todo title</label>
      <input
        id="todo-title"
        v-model="title"
        type="text"
        placeholder="What needs to be done?"
        required
        maxlength="200"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <button
      type="submit"
      :disabled="!title.trim()"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <PlusIcon class="h-5 w-5" />
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { PlusIcon } from '@heroicons/vue/20/solid';

import type { CreateTodoInput } from '@todo-app/shared';

export default defineComponent({
  name: 'TodoForm',
  components: { PlusIcon },
  emits: {
    add: (payload: CreateTodoInput) => typeof payload.title === 'string',
  },
  data() {
    return {
      title: '',
    };
  },
  methods: {
    handleSubmit() {
      const trimmed = this.title.trim();
      if (!trimmed) return;
      this.$emit('add', { title: trimmed });
      this.title = '';
    },
  },
});
</script>
