<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-2xl px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900">Todo App</h1>

      <div class="mt-6">
        <TodoForm @add="handleAdd" />
      </div>

      <div v-if="error" class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>

      <div class="mt-6 flex items-center gap-2">
        <button
          v-for="mode in filterModes"
          :key="mode.value"
          class="rounded-md px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="
            filterMode === mode.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          "
          @click="filterMode = mode.value"
        >
          {{ mode.label }}
        </button>
        <span class="ml-auto text-xs text-gray-500"> {{ activeCount }} remaining </span>
      </div>

      <div class="mt-4">
        <label for="search" class="sr-only">Search todos</label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Search todos..."
          maxlength="200"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div class="mt-4">
        <TodoList :todos="todos" :loading="loading" @toggle="handleToggle" @delete="handleDelete" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { Todo, CreateTodoInput, TodoFilters } from '@todo-app/shared';

import * as api from '../api/client';
import TodoForm from './TodoForm.vue';
import TodoList from './TodoList.vue';

type FilterMode = 'all' | 'active' | 'completed';

export default defineComponent({
  name: 'TodoPage',
  components: { TodoForm, TodoList },
  data() {
    return {
      todos: [] as Todo[],
      loading: false,
      error: null as string | null,
      filterMode: 'all' as FilterMode,
      searchQuery: '',
      searchTimeout: null as ReturnType<typeof setTimeout> | null,
      filterModes: [
        { value: 'all' as FilterMode, label: 'All' },
        { value: 'active' as FilterMode, label: 'Active' },
        { value: 'completed' as FilterMode, label: 'Completed' },
      ],
    };
  },
  computed: {
    activeCount(): number {
      return this.todos.filter((t) => !t.completed).length;
    },
  },
  watch: {
    filterMode() {
      this.loadTodos();
    },
    searchQuery() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.loadTodos(), 300);
    },
  },
  mounted() {
    this.loadTodos();
  },
  beforeUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  },
  methods: {
    async loadTodos(): Promise<void> {
      this.loading = true;
      this.error = null;

      const filters: TodoFilters = {};
      if (this.filterMode === 'active') filters.completed = false;
      if (this.filterMode === 'completed') filters.completed = true;
      if (this.searchQuery) filters.search = this.searchQuery;

      const res = await api.fetchTodos(filters);

      if (res.error) {
        this.error = res.error;
      } else {
        this.todos = res.data ?? [];
      }

      this.loading = false;
    },
    async handleAdd(input: CreateTodoInput): Promise<void> {
      this.error = null;
      const res = await api.createTodo(input);

      if (res.error) {
        this.error = res.error;
      } else {
        await this.loadTodos();
      }
    },
    async handleToggle(uuid: string): Promise<void> {
      this.error = null;
      const todo = this.todos.find((t) => t.uuid === uuid);
      if (!todo) return;

      const res = await api.updateTodo(uuid, { completed: !todo.completed });

      if (res.error) {
        this.error = res.error;
      } else {
        await this.loadTodos();
      }
    },
    async handleDelete(uuid: string): Promise<void> {
      this.error = null;
      const res = await api.deleteTodo(uuid);

      if (res.error) {
        this.error = res.error;
      } else {
        await this.loadTodos();
      }
    },
  },
});
</script>
