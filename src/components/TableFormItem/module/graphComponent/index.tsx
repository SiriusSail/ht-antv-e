/* eslint-disable no-underscore-dangle */

import { defineComponent, ref, PropType, watchEffect, onMounted } from 'vue'
import * as Element from 'element-plus'
import styles from '../index.module.scss'
import graphStore from './store';
import TableGraph from './tableGraph';

const { ElTable, ElTableColumn, ElDialog, ElInput } = Element

const textcenter = {textAlign: 'center'}
export default  defineComponent({
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup() {
    const store = graphStore();
    const containerId = `graph-component-${store.name}`
    let graph: TableGraph; // containerId
    const tableRef = ref();
    const data = ref<any[]>([]);
    const title = ref<string>('');

    // 更新 表内容
    const updataTable = () => {
      const rootNodes: any = graph.graph?.getRootNodes()?.map((item: any) => ({
        ...item.attrs.initData,
        id: item.id
      }));
      const nodes: any = graph.graph?.getNodes()?.map((item: any) => ({
        ...item.attrs.initData,
        id: item.id
      }));
      const rootData = store.getTableData?.(rootNodes, nodes)
      data.value = rootData?.map((item) => item.data.map((item2) => {
        const newItem = {
          ...item2,
          __source: item.title,
          __sourceId: item.id
        }
        return newItem
      })).flat() || [];
      title.value = `${rootData?.map((item) => item.title).join(' , ')} 相交`;
    }

    // 更新线路 更新后端值
    const updataEdges = () => {

      const innerJoin = graph.graph.getEdges().map((item) => {
        const sourcePort = (item.source as any).port as string;
        const targetPort = (item.target as any).port as string;
        return {
          colMap: `${sourcePort},${targetPort}`
        }
      })
      store.upDateInnerJoin(innerJoin);
      updataTable();
    }

    // 更改别名
    const onChangeAlins = (value: string, row: any) => {
      data.value = data.value.map((item) => {
        if(item.__sourceId === row.__sourceId && item.columnName === row.columnName) {
          return {
            ...item,
            __alins: value
          }
        }
        return item
      })
    }

    const columns = [
      {
        label: "字段名称",
        prop: "columnChName",
      },
      {
        label: "字段",
        prop: "columnName",
      },
      {
        label: "重命名字段",
        prop: "columnType",
        width: 150,
        defaultSlot: ({ row }: any) => {
          const disabled = store.showField
            .find((item) => row.columnName === item.columnName && row.__sourceId === item.__sourceId);
          return <ElInput
            placeholder={disabled ? '请输入新字段名称' : '尚未选择'}
            disabled={!disabled}
            modelValue={row.__alins}
            onInput={(e) => onChangeAlins(e, row)}
          />}
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
        width: 150,
        defaultSlot: ({ row }: any) => {
          if(!row.__operation) {
            return ''
          }
          const [source, target] = (row.__operation as string).split('=>')
          return <div style={textcenter}>
            <div>{source}</div>
            <div>{'v'}</div>
            <div>{target}</div>
          </div>}
      },
    ]

    const initGraph = () => {
      // 创建 画布
      graph = new TableGraph({containerId})
      // 创建 表格
      graph.addGraphTableDataNode(store.data);
      // 创建连线
      graph.addTableEdge(store.innerJoin);
      // 添加连线事件
      graph.graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          updataEdges();
        }
      })
      // 连线删除
      graph.graph.on('edge:removed', (e) => {
        if (store.dialogGraphVisible) {
          updataEdges();
        }
      })

      graph.graph.on('edge:removed', (e) => {
        if (store.dialogGraphVisible) {
          updataEdges();
        }
      })
      updataTable();
    }

    watchEffect(() => {
      // 数据回显
      tableRef.value?.clearSelection();
      data.value.filter((item) => item).forEach((row) => {
        const find = store.showField.find((item) => (row.columnName === item.columnName && row.__sourceId === item.__sourceId));
        if (find) {
          tableRef.value?.toggleRowSelection(row, true);
        }
      });
    })

    return () => <ElDialog
      modelValue={store.dialogGraphVisible}
      onClose={() => {
        store.toggleDialogGraph(false)
        graph?.graph?.dispose();
      }}
      onOpened={initGraph}
      title={store.title}
      width='80%'
    >
      <div>
        <div id={containerId}
          style={{
            width: '100%',
            height: '300px'
          }} />
        <div>
          <ElTable
            ref={(e: any) => {
              tableRef.value = e;
            }}
            data={data.value}
            onSelect={store.selectShowField}
          >
            <ElTableColumn label={title.value}>
              <ElTableColumn type='selection' fixed='right' width='35' key='selection' />
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
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
    </ElDialog>
  }})