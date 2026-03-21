import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../components/TodoList.vue';
import type { Todo } from '@todo-app/shared';

const sampleTodos: Todo[] = [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Buy milk',
    description: null,
    completed: false,
    created_at: '2026-03-21T12:00:00.000Z',
    updated_at: '2026-03-21T12:00:00.000Z',
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Walk the dog',
    description: 'Around the park',
    completed: true,
    created_at: '2026-03-21T13:00:00.000Z',
    updated_at: '2026-03-21T13:00:00.000Z',
  },
];

describe('TodoList', () => {
  it('renders the correct number of items', () => {
    const wrapper = mount(TodoList, { props: { todos: sampleTodos } });

    const items = wrapper.findAll('li');
    expect(items).toHaveLength(2);
  });

  it('shows empty state when no todos', () => {
    const wrapper = mount(TodoList, { props: { todos: [] } });

    expect(wrapper.text()).toContain('No todos yet');
  });

  it('shows loading state', () => {
    const wrapper = mount(TodoList, { props: { todos: [], loading: true } });

    expect(wrapper.text()).toContain('Loading todos');
  });

  it('emits toggle when TodoItem emits toggle', async () => {
    const wrapper = mount(TodoList, { props: { todos: sampleTodos } });

    await wrapper.find('input[type="checkbox"]').trigger('change');

    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('toggle')![0]).toEqual([sampleTodos[0].uuid]);
  });

  it('emits delete when TodoItem emits delete', async () => {
    const wrapper = mount(TodoList, { props: { todos: sampleTodos } });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted('delete')![0]).toEqual([sampleTodos[0].uuid]);
  });
});
