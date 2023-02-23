import { Cell } from "@antv/x6";
import dayjs from 'dayjs';
import * as Element from 'element-plus'
import { FormOption, OptionsType } from "@/components/TableFormItem/index.d";
import TabelForm from "./tabelForm";

const {
  ElOptionGroup,
  ElOption,
} = Element;

// 参数，= 》常量，变量
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.compute = cell.attrs.moduleData.name as string;
    this.initFrom();
  }

  options: OptionsType[] = [
    {
      value: 'not-in',
      label: '不包括'
    },
    {
      value: 'in',
      label: '包括'
    },
    {
      value: 'eq',
      label: '等于'
    },
    {
      value: 'not-eq',
      label: '不等于'
    },
    {
      value: 'like',
      label: '模糊'
    },
    {
      value: 'range',
      label: '范围筛选'
    },
    {
      value: 'big',
      label: '大于等于'
    },
    {
      value: 'sm',
      label: '小于等于'
    },
    {
      value: 'is-null',
      label: '为空'
    },
    {
      value: 'is-not-null',
      label: '不为空'
    },
  ]

  getTableOptions = () => {
    const options = this.initValue
      .map(({data, title}, i) => ({
        title,
        data: data.map((dataItem) => ({
          ...dataItem,
          _value: `value__${dataItem.columnName}__${i}`,
        }))
      })).filter((item) => item.title !== '参数')
    return options
  }


  valueTab: {
    [key: string]: (name: string, label: string) => FormOption,
  } = {
      输入框: (name, label) => ({
        tag: 'input',
        value: this.getValue(name),
        label: `${label}值`,
        placeholder: `请输入${label}值`,
        name,
        onChange: (value) => {
          this.setValue({
            name,
            value,
          })
        }
      }),
      日期选择器: (name, label) => ({
        tag: 'dateTimePicker',
        type: 'date',
        value: this.getValue(name) ? dayjs(this.getValue(name)) as any : undefined,
        label: `${label}值`,
        placeholder: `请选择${label}时间`,
        name,
        onChange: (value: any) => {
          this.setValue({
            name,
            value: dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          })
        }
      }),
      时间日期选择器: (name, label) => ({
        tag: 'dateTimePicker',
        type: 'datetime',
        value: this.getValue(name) ? dayjs(this.getValue(name)) as any : undefined,
        label: `${label}值`,
        placeholder: `请选择${label}时间`,
        name,
        onChange: (value: any) => {
          this.setValue({
            name,
            value: dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          })
        }
      })
    }

  async initFrom() {
    this.createNameInput();

    this.createSelect({
      tag: 'select',
      value: this.getValue('tableColumn') as any,
      label: `字段`,
      placeholder: `请选择字段`,
      name: 'tableColumn',
      defaultSlots: () => this.getTableOptions().map(({title, data}) => (
        <ElOptionGroup
          label={title}
          v-slots={{
            default: () => data
              .map((item2) => <ElOption
                key={item2.columnName}
                value={item2.columnName}
                label={item2.columnChName}
              />)
          }}
        />)),
    });

    this.createSelect({
      value: this.getValue('colSymbol'),
      label: '符号',
      name: 'colSymbol',
      placeholder: '请选择符号',
      options: this.options,
      useChange: (value) => {
        this.setValue({
          name: 'colSymbol',
          value,
        })
        this.setValue({
          name: 'value',
          value: this.getValue('value'),
        })
        this.setValue({
          name: 'value2',
          value: undefined,
        })
        return value
      }
    });

    const radioOptions = Object.keys(this.valueTab).map((item) => ({ label: item, value: item}))
    if (!this.getValue('radioType')) {
      this.setValue({
        name: 'radioType',
        value: radioOptions[0].value
      })
    }

    this.createFromItem((index) => {
      let label = this.compute;
      const name = 'value';
      this.setValue({
        name,
        value: this.getValue(name),
        bindChangeCallback: () => {
          if(this.getValue('colSymbol') === 'is-null' || this.getValue('colSymbol') === 'is-not-null') {
            this.formItemList.splice(index, 1, undefined);
            return;
          }
          if (this.getValue('colSymbol') !== 'range') {
            label = this.compute;
          } else {
            label = '开始';
          }
          this.formItemList.splice(index, 1, this.valueTab[this.getValue('radioType')]?.(name, label))
        },
      });
      if (this.getValue('colSymbol') === 'is-null' || this.getValue('colSymbol') === 'is-not-null') {
        return undefined;
      }
      return this.valueTab[this.getValue('radioType')]?.(name, label)
    });

    this.createFromItem((index) => {
      const label = '结束';
      const name = 'value2';
      this.setValue({
        name,
        value: this.getValue(name),
        bindChangeCallback: () => {
          if (this.getValue('colSymbol') !== 'range') {
            this.formItemList.splice(index, 1, undefined);
          } else {
            this.formItemList.splice(index, 1, this.valueTab[this.getValue('radioType')]?.(name, label));
          }
        },
      });
      if (this.getValue('colSymbol') !== 'range') {
        return undefined;
      }
      return this.valueTab[this.getValue('radioType')]?.(name, label)

    });

  }

  necessary() {
    const varType = (this.node.attrs.moduleData.attributes as any)
      .MODEL_PARAMS_VARIABLE?.[0].varType;
    const colVal1 = this.getValue('value')
    const colVal2 = this.getValue('value2')
    const colSymbol = this.getValue('colSymbol')
    const colName = this.getValue('tableColumn')
    const find = this.initValue
      .map((item) => item.data)
      .flat()
      .find((item) => item.columnName === colName);
    return this.success({
      MODEL_PARAMS_VARIABLE: [{
        colName,
        colSymbol,
        colType: find?.columnType,
        colVal: colVal1 + (colVal2 ? `,${colVal2}` : ''),
        colValDefault: colVal1 + (colVal2 ? `,${colVal2}` : ''),
        varType,
      }],
    });
  }

  // 序列化值
  format() {
    const formatData = this.initValue;
    const colVal1 = this.getValue('value')
    const colVal2 = this.getValue('value2')
    const id = `${this.node.id}_var`;
    const newColumn = this.addJourney(
      {
        columnChName: this.node.attrs.label.text as string,
        columnName: this.node.attrs.label.text as string,
        gmtCreate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        gmtModified: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        id,
        rowId: `${this.node.id}_var`,
        columnType: `符号: ${this.options.find((item) => item.value === this.getValue('type'))?.label || ''}`,
      },
      {
        prop: "source",
        label: "来源",
        value: this.node.attrs.label.text as string,
      },
      {
        prop: "var",
        label: "值",
        value: colVal1 + (colVal2 ? `,${colVal2}` : ''),
      }
    );
    const find = formatData.find((item) => item.title === `参数`);
    if (!find) {
      formatData.push({
        title: `参数`,
        data: [newColumn],
      });
      return formatData;
    }
    return formatData.map((item) => {
      if (item.title === `参数`) {
        const varArr = item.data.filter((item2) => item2.id !== id)
        varArr.push(newColumn);
        return {
          title: item.title,
          data: varArr,
        };
      }
      return item;
    });
  }
}
