import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItem from '../components/TodoItem.vue';
import type { Todo } from '@todo-app/shared';

const baseTodo: Todo = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Buy milk',
  description: null,
  completed: false,
  created_at: '2026-03-21T12:00:00.000Z',
  updated_at: '2026-03-21T12:00:00.000Z',
};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    const wrapper = mount(TodoItem, { props: { todo: baseTodo } });

    expect(wrapper.text()).toContain('Buy milk');
  });

  it('renders description when present', () => {
    const todo = { ...baseTodo, description: 'Full cream' };
    const wrapper = mount(TodoItem, { props: { todo } });

    expect(wrapper.text()).toContain('Full cream');
  });

  it('does not render description when null', () => {
    const wrapper = mount(TodoItem, { props: { todo: baseTodo } });

    const paragraphs = wrapper.findAll('p');
    expect(paragraphs).toHaveLength(1);
  });

  it('shows strikethrough when completed', () => {
    const todo = { ...baseTodo, completed: true };
    const wrapper = mount(TodoItem, { props: { todo } });

    const title = wrapper.find('p');
    expect(title.classes()).toContain('line-through');
  });

  it('emits toggle with uuid on checkbox change', async () => {
    const wrapper = mount(TodoItem, { props: { todo: baseTodo } });

    await wrapper.find('input[type="checkbox"]').trigger('change');

    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('toggle')![0]).toEqual([baseTodo.uuid]);
  });

  it('emits delete with uuid on button click', async () => {
    const wrapper = mount(TodoItem, { props: { todo: baseTodo } });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted('delete')![0]).toEqual([baseTodo.uuid]);
  });

  it('checkbox is checked when todo is completed', () => {
    const todo = { ...baseTodo, completed: true };
    const wrapper = mount(TodoItem, { props: { todo } });

    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
