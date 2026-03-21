import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoForm from '../components/TodoForm.vue';

describe('TodoForm', () => {
  it('emits add event with title on submit', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('input').setValue('Buy milk');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted('add')![0]).toEqual([{ title: 'Buy milk' }]);
  });

  it('clears the input after submit', async () => {
    const wrapper = mount(TodoForm);

    const input = wrapper.find('input');
    await input.setValue('Buy milk');
    await wrapper.find('form').trigger('submit');

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('does not emit when title is empty', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('add')).toBeUndefined();
  });

  it('trims whitespace from title', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('input').setValue('  Buy milk  ');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('add')![0]).toEqual([{ title: 'Buy milk' }]);
  });

  it('disables submit button when input is empty', () => {
    const wrapper = mount(TodoForm);

    const button = wrapper.find('button[type="submit"]');
    expect((button.element as HTMLButtonElement).disabled).toBe(true);
  });
});
