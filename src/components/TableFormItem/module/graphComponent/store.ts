import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { GraphTablePropsStore, GraphTableData } from '../../index.d'

const initState: GraphTablePropsStore & {
  dialogGraphVisible: boolean, // 是否弹出
} = {
  data: [],
  options: [],
  name: '',
  title: '',
  innerJoin: [],
  selectData: [],
  showField: [],
  getTableData: undefined,
  dialogGraphVisible: false,
}
export default defineStore('graphComponent', {
  state: () => {
    const state = reactive({...initState})
    return state
  },
  actions: {
    initState() {
      Object.keys(initState).forEach((key: any) => {
        (this as any)[key] = (initState as any)[key];
      })
    },
    upDateInnerJoin(innerJoin: GraphTablePropsStore.innerJoin) {
      this.innerJoin = innerJoin;
    },
    selectShowField(showField: any[]) {
      this.showField = showField;
      // this.showField = showField.map((item) => {
      //   let id = '';
      //   const d = Object.keys(item).find((item2) => /^journey_[\s\S]*_source$/.test(item2))
      //   if (d) {
      //     const [, n] = d.split('journey_');
      //     const [newb] = n.split('_source');
      //     id = newb
      //   }
      //   return {
      //     colData: `${id}:${item.columnName}`
      //   }
      // })
    },
    toggleDialogGraph(visble? : boolean) {
      if (typeof visble === 'boolean') {
        this.dialogGraphVisible = visble;
      } else {
        this.dialogGraphVisible = !this.dialogGraphVisible;
      }
    }
  }
})