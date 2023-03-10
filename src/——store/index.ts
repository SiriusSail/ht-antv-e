import { InjectionKey } from '@vue/runtime-core';
import { createStore, Store, useStore as baseUseStore } from 'vuex';

import demandModule from './modules/demand/index'
import RootStateTypes, { AllStateTypes } from './types';

const defaultState = {
  count: 0,
};
// 新建store 实例
export const store = createStore({
  state () {
    return defaultState;
  },
  mutations: {
    increment (state: typeof defaultState) {
      // eslint-disable-next-line no-plusplus
      state.count++;
    },
  },
  actions: {
    increment (context) {
      context.commit('increment');
    },
  },
  getters: {
    count (state: typeof defaultState) {
      return state.count;
    },
  },
  modules: {
    demandModule,
  },
});

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue3-store');

export function useStore<T = AllStateTypes> () {
  return baseUseStore<T>(key);
}
