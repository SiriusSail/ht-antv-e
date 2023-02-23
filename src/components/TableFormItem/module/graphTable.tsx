
import { defineComponent, ref, PropType, onMounted, watchEffect } from 'vue'
import * as Element from 'element-plus'
import { Node } from '@antv/x6';
import GraphComponent from './graphComponent';
import graphStore from './graphComponent/store';
import styles from '../index.module.scss'
import { OptionsType, GraphTablePropsStore, ColumnsItem, GraphTableData } from '../index.d'

const { ElTable, ElTableColumn, ElButton } = Element

export default  defineComponent({
  props: {
    options: {
      type: Array as PropType<OptionsType[]>,
      required: true,
      default: [] as OptionsType[]
    },
    data: {
      type: Object  as PropType<any[]>,
      required: true,
      default: undefined
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    innerJoin: {
      type: Array as PropType<GraphTablePropsStore.innerJoin>,
      required: true,
      default: [] as GraphTablePropsStore.innerJoin
    },
    showField: {
      type: Array as PropType<GraphTablePropsStore.showField>,
      required: true,
      default: [] as GraphTablePropsStore.showField
    },
    getTableData: {
      type: Function as PropType<GraphTablePropsStore.getTableData>,
      required: false,
      default: (value: string): any[] => []
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: false,
      default: (): any[] => []
    },
    onSelectTable: {
      type: Function as PropType<(value: GraphTablePropsStore.showField) => void>,
      required: false,
      default: (): any[] => []
    },
    onLink: {
      type: Function as PropType<(value: GraphTablePropsStore.innerJoin) => void>,
      required: false,
      default: (): any[] => []
    },
  },
  emits: {
    'update:value': (val: any[]) => val
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup(props) {
    const store = graphStore();

    const columns: ColumnsItem[] = [
      {
        label: "字段名称",
        prop: "columnChName",
      },
      {
        label: "字段",
        prop: "columnName",
      },
      {
        label: "字段类型",
        prop: "columnType",
      },
      {
        label: "来源",
        prop: "__source",
      },
      {
        label: "操作",
        prop: "__operation",
      }
    ]

    store.$onAction(({ name, args }) => {
      if (name === "upDateInnerJoin") {
        props.onLink?.((args[0] as any));
      }
      // if (name === "selectShowField") {
      //   props.onSelectTable?.(args[0] as any);
      // }
      if (name === "toggleDialogGraph") {
        if (!args[0]) {
          props.onClose?.();
          props.onSelectTable(store.showField)
        }
      }
    })

    const update = () => {
      console.log('props', props)
      store.data = props.data;
      store.options = props.options;
      store.name = props.name;
      store.title = props.title;
      store.innerJoin = props.innerJoin;
      store.showField = props.showField;
    }

    onMounted(() => {
      store.initState();
      store.getTableData = props.getTableData;
      update()
    })

    return () => <div>
      <GraphComponent />
      <div style={{textAlign: 'right'}}>
        <ElButton onClick={() => store.toggleDialogGraph(true)}>编辑</ElButton>
      </div>
      <div onDblclick={() => {
        store.toggleDialogGraph(true)
      }}>
        <ElTable data={store.showField} >
          {columns.map((item) => {
          // return
            if(item.defaultSlot) {
              return <ElTableColumn
                {
                  ...item
                }
                v-slots={{
                  default: (dataItem: { row: any }) =>item.defaultSlot(dataItem)
                }}
                key={item.prop}
              />
            }
            return <ElTableColumn
              {
                ...item
              }
              key={item.prop}
            />

          })
          }
        </ElTable>
      </div>
    </div>

  }})