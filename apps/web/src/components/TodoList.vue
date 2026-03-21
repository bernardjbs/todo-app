<template>
  <div>
    <p v-if="loading" class="py-8 text-center text-sm text-gray-500">Loading todos...</p>
    <p v-else-if="todos.length === 0" class="py-8 text-center text-sm text-gray-500">
      No todos yet. Add one above.
    </p>
    <ul v-else class="space-y-2">
      <TodoItem
        v-for="todo in todos"
        :key="todo.uuid"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { Todo } from '@todo-app/shared';

import TodoItem from './TodoItem.vue';

export default defineComponent({
  name: 'TodoList',
  components: { TodoItem },
  props: {
    todos: {
      type: Array as PropType<Todo[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    toggle: (uuid: string) => typeof uuid === 'string',
    delete: (uuid: string) => typeof uuid === 'string',
  },
});
</script>
