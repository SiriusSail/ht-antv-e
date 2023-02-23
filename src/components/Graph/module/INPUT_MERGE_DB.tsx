/* eslint-disable no-underscore-dangle */
import { Cell } from '@antv/x6';
import * as Element from 'element-plus'
import TabelForm, { FormatType } from './tabelForm';

const {
  ElOptionGroup,
  ElOption,
} = Element;
// 选择
export default class Index extends TabelForm {

  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.initFrom();
    this.compute = cell.attrs.moduleData.name as string;
  }

  getOptions = (index: number) => {
    const values = this.initValue[index]
      ?.data
      .map((item) => this.getValue(`value__${item.columnName}__${index}`))
      .filter((item) => item)

    const options = this.initValue
      .map(({data, title}, i) => ({
        title,
        data: data.map((dataItem) => ({
          ...dataItem,
          _value: `value__${dataItem.columnName}__${i}`,
          _isDisabled: values?.includes(`value__${dataItem.columnName}__${i}`)
        }))
      }))
      .filter((item, i) => i !== index)
    return options
  }

  getAllOptions = () => {
    const options = this.initValue
      .map(({data, title}, i) => ({
        title,
        data: data.map((dataItem) => ({
          ...dataItem,
          _value: `${dataItem.columnName}__${i}`,
        }))
      }))
    return options
  }

  callbacks = {
    ['交' as string]: () => {
      const allOptions = this.getAllOptions()
      this.createSelect({
        name: 'select_column',
        label: '相交字段',
        multiple: true,
        value: this.getValue('select_column'),
        useChange: (newValue) => {
          const oldValue = this.getValue('select_column');
          const clareValue = oldValue?.filter((item: string) => !newValue.includes(item))
          clareValue?.forEach((item: string) => this.setValue({
            name: `value__${item}`,
            value: undefined
          }))
          this.setValue({
            name: 'select_column',
            value: newValue
          })
          this.initFrom();
          return newValue
        },
        defaultSlots: () => allOptions.map(({title, data}) => (
          <ElOptionGroup
            label={title}
            v-slots={{
              default: () => data
                .map((item) => <ElOption
                  disabled={item._isDisabled}
                  key={item.columnName}
                  value={item._value}
                  label={item.columnName}
                />)
            }}
          />))
      })

      this.getValue('select_column')?.forEach((item: string) => {

        const [propsName, index] = item.split('__');

        this.createFromItem({
          tag: 'hr'
        })

        this.createFromItem({
          tag: 'text',
          text: `原字段: ${propsName}`
        })

        this.createInput({
          name: `${propsName}__aliasname`,
          label: '字段名称',
          placeholder: '请输入字段名称',
          value: this.getValue(`${propsName}__aliasname`)
        })

        this.createInput({
          name: `${propsName}__name`,
          label: '字段',
          placeholder: '请输入字段',
          value: this.getValue(`${propsName}__name`) || propsName
        })

        this.createSelect({
          name: `value__${propsName}__${index}`,
          label: '绑定字段',
          value: this.getValue(`value__${propsName}__${index}`),
          defaultSlots: () => this.getOptions(parseFloat(index)).map(({title, data}) => (
            <ElOptionGroup
              label={title}
              v-slots={{
                default: () => data
                  .map((item2) => <ElOption
                    disabled={item2._isDisabled}
                    key={item2.columnName}
                    value={item2._value}
                    label={item2.columnName}
                  />)
              }}
            />))
        })

        this.createSelect({
          name: `match__${propsName}__${index}`,
          label: '参与筛选',
          value: this.getValue(`match__${propsName}__${index}`),
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        })
      })
    },
    '并': () => {
      const allOptions = this.getAllOptions()
      this.createSelect({
        name: 'select_column',
        label: '合并字段',
        multiple: true,
        value: this.getValue('select_column'),
        useChange: (newValue) => {
          const oldValue = this.getValue('select_column');
          const clareValue = oldValue?.filter((item: string) => !newValue.includes(item))
          clareValue?.forEach((item: string) => this.setValue({
            name: `value__${item}`,
            value: undefined
          }))
          this.setValue({
            name: 'select_column',
            value: newValue
          })
          this.initFrom();
          return newValue
        },
        defaultSlots: () => allOptions.map(({title, data}) => (
          <ElOptionGroup
            label={title}
            v-slots={{
              default: () => data
                .map((item) => <ElOption
                  disabled={item._isDisabled}
                  key={item.columnName}
                  value={item._value}
                  label={item.columnName}
                />)
            }}
          />))
      })

      this.getValue('select_column')?.forEach((item: string) => {

        const [propsName, index] = item.split('__');

        this.createFromItem({
          tag: 'hr'
        })

        this.createFromItem({
          tag: 'text',
          text: `原字段: ${propsName}`
        })

        this.createInput({
          name: `${propsName}__aliasname`,
          label: '字段名称',
          placeholder: '请输入字段名称',
          value: this.getValue(`${propsName}__aliasname`)
        })

        this.createInput({
          name: `${propsName}__name`,
          label: '字段',
          placeholder: '请输入字段',
          value: this.getValue(`${propsName}__name`) || propsName
        })

        this.createSelect({
          name: `value__${propsName}__${index}`,
          label: '绑定字段',
          value: this.getValue(`value__${propsName}__${index}`),
          defaultSlots: () => this.getOptions(parseFloat(index)).map(({title, data}) => (
            <ElOptionGroup
              label={title}
              v-slots={{
                default: () => data
                  .map((item2) => <ElOption
                    disabled={item2._isDisabled}
                    key={item2.columnName}
                    value={item2._value}
                    label={item2.columnName}
                  />)
              }}
            />))
        })
      })
    },
    '差': () => {
      const allOptions = this.getAllOptions()
      this.createSelect({
        name: 'select_column',
        label: '相差字段',
        multiple: true,
        value: this.getValue('select_column'),
        useChange: (newValue) => {
          const oldValue = this.getValue('select_column');
          const clareValue = oldValue?.filter((item: string) => !newValue.includes(item))
          clareValue?.forEach((item: string) => this.setValue({
            name: `value__${item}`,
            value: undefined
          }))
          this.setValue({
            name: 'select_column',
            value: newValue
          })
          this.initFrom();
          return newValue
        },
        defaultSlots: () => allOptions.map(({title, data}) => (
          <ElOptionGroup
            label={title}
            v-slots={{
              default: () => data
                .map((item) => <ElOption
                  disabled={item._isDisabled}
                  key={item.columnName}
                  value={item._value}
                  label={item.columnName}
                />)
            }}
          />))
      })

      this.getValue('select_column')?.forEach((item: string) => {

        const [propsName, index] = item.split('__');

        this.createFromItem({
          tag: 'hr'
        })

        this.createFromItem({
          tag: 'text',
          text: `原字段: ${propsName}`
        })

        this.createInput({
          name: `${propsName}__aliasname`,
          label: '字段名称',
          placeholder: '请输入字段名称',
          value: this.getValue(`${propsName}__aliasname`)
        })

        this.createInput({
          name: `${propsName}__name`,
          label: '字段',
          placeholder: '请输入字段',
          value: this.getValue(`${propsName}__name`) || propsName
        })

        this.createSelect({
          name: `value__${propsName}__${index}`,
          label: '绑定字段',
          value: this.getValue(`value__${propsName}__${index}`),
          defaultSlots: () => this.getOptions(parseFloat(index)).map(({title, data}) => (
            <ElOptionGroup
              label={title}
              v-slots={{
                default: () => data
                  .map((item2) => <ElOption
                    disabled={item2._isDisabled}
                    key={item2.columnName}
                    value={item2._value}
                    label={item2.columnName}
                  />)
              }}
            />))
        })

        this.createSelect({
          name: `match__${propsName}__${index}`,
          label: '参与筛选',
          value: this.getValue(`match__${propsName}__${index}`),
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        })
      })
    },
  }

  async initFrom() {
    this.formItemList = [];
    this.createNameInput();
    this.callbacks[this.compute]?.();

    this.createFromItem({
      tag: 'hr'
    })

    this.initValue.forEach((item) => {
      this.createTable({
        ...item,
        columns: this.defaultColumns,
      });
    })
  }


  necessary() {

    const columnList = this.getValue('select_column') || [];
    const selectIndex: number[] = []; // 选择的 数据源头
    const selectValues: any[] =  columnList.map((item: string) => {
      const [propsName, index] = item.split('__');

      const selectColumnStr = this.getValue(`value__${propsName}__${index}`);
      if (!selectColumnStr) return undefined;
      const [, columnName2, indexB] = selectColumnStr.split('__');
      selectIndex.push(parseFloat(index), parseFloat(indexB));
      const selectColumnA = this.initValue[parseFloat(index)].data.find((item2) => item2.columnName === propsName)
      const selectColumnB = this.initValue[indexB].data.find((item2) => item2.columnName === columnName2)
      const keyA = Object.keys(selectColumnA).find((item2) => item2.indexOf('journey_') > -1 && selectColumnA[item2].prop === 'source');
      const keyB = Object.keys(selectColumnB).find((item2) => item2.indexOf('journey_') > -1 && selectColumnB[item2].prop === 'source');
      const idA = keyA.slice(8, keyA.length - 7);
      const idB = keyB.slice(8, keyB.length - 7);

      return {
        colType: selectColumnA.columnType,
        colAliasName: this.getValue(`${propsName}__aliasname`),
        colName: this.getValue(`${propsName}__name`),
        matchCol: this.getValue(`match__${propsName}__${index}`),
        colMap: `${idA}:${selectColumnA.columnName},${idB}:${selectColumnB.columnName}`,
      }
    })

    const error = selectValues.find((item) => !item)

    if (error || !(columnList?.length > 0)) {
      return this.error(`${this.node.attrs.label.text as string} 缺少步骤`)
    }

    return this.success({
      MODEL_PARAMS_MERGE: {
        joinColName: selectValues,
        joinType: (this.node.attrs.moduleData.attributes as any).MODEL_PARAMS_MERGE.joinType,
      }
    })
  }


  formats = {
    ['交' as string]: () => {
      const columnList = this.getValue('select_column') || [];

      const selectIndex: number[] = []; // 选择的 数据源头
      const selectValues: {
        columnName: string;
        index: number;
        title: string;
        aliasname: string;
        name: string;
        value: any;
      }[] = []; // 选择的 从表数据

      const notOperated: FormatType[] = [] // 没有选择过的表
      const formatsItems: FormatType[] = [] // 选择过的表

      columnList.forEach((item: string) => {
        const [propsName, index] = item.split('__');

        const selectColumnStr = this.getValue(`value__${propsName}__${index}`);
        if (!selectColumnStr) return;
        const [, columnName2, indexB] = selectColumnStr.split('__');
        selectIndex.push(parseFloat(index), parseFloat(indexB));
        const selectColumn = this.initValue[indexB].data.find((item2) => item2.columnName === columnName2)

        selectValues.push({
          columnName: propsName,
          title: this.initValue[indexB].title,
          index: parseFloat(indexB),
          aliasname: this.getValue(`${propsName}__aliasname`),
          name: this.getValue(`${propsName}__name`),
          value: selectColumn
        })
      })

      this.initValue.forEach((item, index) => {
        if (selectIndex.indexOf(index) === -1) {
          notOperated.push(item)
        } else {
          formatsItems.push(item)
        }
      })

      const data = formatsItems
        .map((item, i) => item.data
          .filter((dataItem) => !selectValues
            .find((selectItem) => selectItem.index === i && selectItem.value.columnName === dataItem.columnName))
          .map((dataItem) => {
            const find = selectValues.find((selectItem) => selectItem.columnName === dataItem.columnName)
            if (find) {
              return this.addJourney(dataItem, {
                prop: '_union',
                label: '关系操作',
                value: `相交于 ${find.title} / ${find.value.columnChName}(${find.value.columnName})`
              },
              {
                prop: 'new_aliasname',
                label: '新名称',
                value: find.aliasname
              },
              {
                prop: 'new_name',
                label: '新字段名称',
                value: find.name
              }
              )
            }
            return dataItem
          }))
        .flat()
      return [
        {
          title: formatsItems.map((item: any) => item.title).join(" & "),
          data
        },
        ...notOperated,
      ]
    },
    ['并' as string]: () => {
      const columnList = this.getValue('select_column') || [];

      const selectIndex: number[] = []; // 选择的 数据源头
      const selectValues: {
        columnName: string;
        index: number;
        title: string;
        aliasname: string;
        name: string;
        value: any;
      }[] = []; // 选择的 从表数据

      const formatsItems: FormatType[] = [] // 选择过的表

      columnList.forEach((item: string) => {
        const [propsName, index] = item.split('__');

        const selectColumnStr = this.getValue(`value__${propsName}__${index}`);
        if (!selectColumnStr) return;
        const [, columnName2, indexB] = selectColumnStr.split('__');
        selectIndex.push(parseFloat(index), parseFloat(indexB));
        const selectColumn = this.initValue[indexB].data.find((item2) => item2.columnName === columnName2)

        selectValues.push({
          columnName: propsName,
          title: this.initValue[indexB].title,
          index: parseFloat(indexB),
          aliasname: this.getValue(`${propsName}__aliasname`),
          name: this.getValue(`${propsName}__name`),
          value: selectColumn
        })
      })

      this.initValue.forEach((item, index) => {
        if (selectIndex.indexOf(index) !== -1) {
          formatsItems.push(item)
        }
      })

      const data: any[] = []
      formatsItems
        .map((item, i) => item.data
          .filter((dataItem) => !selectValues
            .find((selectItem) => selectItem.index === i && selectItem.value.columnName === dataItem.columnName))
          .forEach((dataItem) => {
            const find = selectValues.find((selectItem) => selectItem.columnName === dataItem.columnName)
            if (find) {
              data.push(this.addJourney(dataItem, {
                prop: '_union',
                label: '关系操作',
                value: `合并 ${find.title} / ${find.value.columnChName}(${find.value.columnName})`
              },
              {
                prop: 'new_aliasname',
                label: '新名称',
                value: find.aliasname
              },
              {
                prop: 'new_name',
                label: '新字段名称',
                value: find.name
              }
              ))
            }
          }))
      return [
        {
          title: formatsItems.map((item: any) => item.title).join(" & "),
          data
        },
      ]
    },
    ['差' as string]: () => {
      const columnList = this.getValue('select_column') || [];

      const selectIndex: number[] = []; // 选择的 数据源头
      const selectValues: {
        columnName: string;
        index: number;
        title: string;
        aliasname: string;
        name: string;
        value: any;
      }[] = []; // 选择的 从表数据

      const notOperated: FormatType[] = [] // 没有选择过的表
      const formatsItems: FormatType[] = [] // 选择过的表

      columnList.forEach((item: string) => {
        const [propsName, index] = item.split('__');

        const selectColumnStr = this.getValue(`value__${propsName}__${index}`);
        if (!selectColumnStr) return;
        const [, columnName2, indexB] = selectColumnStr.split('__');
        selectIndex.push(parseFloat(index), parseFloat(indexB));
        const selectColumn = this.initValue[indexB].data.find((item2) => item2.columnName === columnName2)

        selectValues.push({
          columnName: propsName,
          title: this.initValue[indexB].title,
          index: parseFloat(indexB),
          aliasname: this.getValue(`${propsName}__aliasname`),
          name: this.getValue(`${propsName}__name`),
          value: selectColumn
        })
      })

      this.initValue.forEach((item, index) => {
        if (selectIndex.indexOf(index) === -1) {
          notOperated.push(item)
        } else {
          formatsItems.push(item)
        }
      })

      const data = formatsItems
        .map((item, i) => item.data
          .filter((dataItem) => !selectValues
            .find((selectItem) => selectItem.index === i && selectItem.value.columnName === dataItem.columnName))
          .map((dataItem) => {
            const find = selectValues.find((selectItem) => selectItem.columnName === dataItem.columnName)
            if (find) {
              return this.addJourney(dataItem, {
                prop: '_union',
                label: '关系操作',
                value: `相差于 ${find.title} / ${find.value.columnChName}(${find.value.columnName})`
              },
              {
                prop: 'new_aliasname',
                label: '新名称',
                value: find.aliasname
              },
              {
                prop: 'new_name',
                label: '新字段名称',
                value: find.name
              }
              )
            }
            return dataItem
          }))
        .flat()
      return [
        {
          title: formatsItems.map((item: any) => item.title).join(" & "),
          data
        },
        ...notOperated,
      ]
    },
  }

  // 序列化值
  format () {
    const formatValue = this.formats[this.compute]?.()

    return formatValue;
  }
}