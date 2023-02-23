import { Module } from 'vuex';
import userStateTypes from './types';
import RootStateTypes from '../../types';
// create a new Store Modules.
const demandModule: Module<userStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    searchWord: '',
  },
  mutations: {
    setSearchWord: (state: userStateTypes,val:string)=>{
			state.searchWord = val
		}
  },
  //处理异步
  actions: {
    
  },
  getters: {
    setSearchWord(state:userStateTypes) {
			return state.searchWord
		},
  },
};
export default demandModule;
