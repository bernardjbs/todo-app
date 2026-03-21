<template>
  <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
    <input
      type="checkbox"
      :checked="todo.completed"
      class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      :aria-label="`Mark '${todo.title}' as ${todo.completed ? 'incomplete' : 'complete'}`"
      @change="$emit('toggle', todo.uuid)"
    />
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-medium"
        :class="todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'"
      >
        {{ todo.title }}
      </p>
      <p
        v-if="todo.description"
        class="mt-0.5 text-xs"
        :class="todo.completed ? 'text-gray-300' : 'text-gray-500'"
      >
        {{ todo.description }}
      </p>
    </div>
    <button
      class="text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500"
      :aria-label="`Delete '${todo.title}'`"
      @click="$emit('delete', todo.uuid)"
    >
      <TrashIcon class="h-5 w-5" />
    </button>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import { TrashIcon } from '@heroicons/vue/20/solid';

import type { Todo } from '@todo-app/shared';

export default defineComponent({
  name: 'TodoItem',
  components: { TrashIcon },
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  emits: {
    toggle: (uuid: string) => typeof uuid === 'string',
    delete: (uuid: string) => typeof uuid === 'string',
  },
});
</script>
