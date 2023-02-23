import { Cell } from "@antv/x6";
import { GraphTablePropsStore } from "@/components/TableFormItem/index.d";
import TabelForm from "./tabelForm";

// 交
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.compute = cell.attrs.moduleData.name as string;
    this.initFrom();
  }

  async initFrom() {
    this.createNameInput();
    this.createFromItem({
      tag: 'graphTable',
      name: 'graphTable',
      title: '查看交集',
      data: this.initValue,
      innerJoin: this.getValue('innerJoin'),
      showField: this.getValue('showField'),
      onLink: (value) => {
        this.setValue({
          name: 'innerJoin',
          value
        })
      },
      getTableData: (rootData, data) => {
        const innerJoin = this.getValue('innerJoin') as GraphTablePropsStore.innerJoin;
        const innerJoinArr = innerJoin?.map((item2) => {
          const { colMap } = item2;
          const [source, target] = colMap.split(',')
          const [sourceId, sourceName] = source.split(':')
          const [targetId, targetName] = target.split(':')
          return {
            sourceId,
            sourceName,
            targetId,
            targetName
          }
        }) || [];
        const newData = data.map((root) => {
          const rootBaseData = root.data.map((item) => {
            const sourceTable = innerJoinArr.find((item2) => {
              const { sourceId, sourceName } = item2;
              if(sourceId === root.id && sourceName === item.columnName) {
                return true
              }
              return false
            })

            let newItem = item;

            if (sourceTable) {
              const targetData = data.find((item2) => item2.id === sourceTable.targetId)

              newItem = this.addJourney(
                item,
                {
                  prop: 'un_all',
                  label: '相交操作',
                  value: `${root.title}-${sourceTable.sourceName} => ${targetData.title}-${sourceTable.targetName}`
                }
              ) || [];

              // eslint-disable-next-line no-underscore-dangle
              newItem.__operation = `${root.title}-${sourceTable.sourceName} => ${targetData.title}-${sourceTable.targetName}`
            }

            return newItem
          })

          return {
            title: root.title,
            id: root.id,
            data: rootBaseData
          }
        })

        return newData
      },
      onSelectTable: (value) => {
        this.setValue({
          name: 'showField',
          value
        })
      },
      onClose: () => {
        this.formItemList = []
        this.initFrom();
      }
    });
  }

  necessary() {
    const innerJoin = this.getValue('innerJoin');
    const showFieldData = this.getValue('showField') || [];
    const showField = showFieldData.map((item: any) => {
      let id = '';
      const d = Object.keys(item).find((item2) => /^journey_[\s\S]*_source$/.test(item2))
      if (d) {
        const [, n] = d.split('journey_');
        const [newb] = n.split('_source');
        id = newb
      }
      return {
        colData: `${id}:${item.columnName}`,
        // eslint-disable-next-line no-underscore-dangle
        colAlias: item.__alins
      }
    })
    return this.success({
      MODEL_PARAMS_MERGE: {
        joinType: "union_all",
        unionCol: {
          innerJoin,
          showField,
        }
      },
    });
  }

  // 序列化值
  format() {
    return [{
      title: this.node.attrs.label.text as string,
      data: this.getValue('showField')
    }];
  }
}
