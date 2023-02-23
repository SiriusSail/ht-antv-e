import { Cell } from "@antv/x6";
import dayjs from "dayjs";
import * as Element from 'element-plus'
import TabelForm from "./tabelForm";

const {
  ElOptionGroup,
  ElOption,
} = Element;
// 加
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.compute = cell.attrs.moduleData.name as string;
    this.initFrom();
  }

  getTableOptions = () => {
    const values = [
      this.getValue('value1'),
      this.getValue('value2')
    ]

    const options = this.initValue
      .map(({data, title}, i) => ({
        title,
        data: data.map((dataItem) => {
          const value = `value__${dataItem.columnName}__${i}`;
          return {
            ...dataItem,
            _value: value,
            _isDisabled: values?.includes(`value__${dataItem.columnName}__${i}`)
          }
        })
      })).filter((item) => item.title !== '运算')
    return options
  }

  initFrom() {
    this.createNameInput();

    this.createInput({
      name: "newfieldname",
      label: "字段",
      value: this.getValue("newfieldname"),
    });

    this.createInput({
      name: "compute",
      label: "字段别名",
      value: this.getValue("compute"),
    });

    this.createFromItem({
      tag: 'select',
      value: this.getValue('value1') as any,
      label: `被${this.compute}数`,
      placeholder: `请选择数据`,
      name: 'value1',
      defaultSlots: () => this.getTableOptions().map(({title, data}) => (
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
        />)),
      onChange: (value: any) => {
        this.setValue({
          name: 'value1',
          value,
        })
      }
    });
    this.createFromItem({
      tag: 'select',
      value: this.getValue('value2') as any,
      label: `${this.compute}数`,
      placeholder: `请选择数据`,
      name: 'value1',
      defaultSlots: () => this.getTableOptions().map(({title, data}) => (
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
        />)),
      onChange: (value: any) => {
        this.setValue({
          name: 'value2',
          value,
        })
      }
    });

    this.initValue.forEach((item, index) => {
      const name = `addition_${index}`;
      this.createTable({
        ...item,
        name,
        value: this.getValue(name),
        columns: this.defaultColumns,
      });
    });
  }

  necessary() {
    const [, value1] =  this.getValue('value1')?.split('__') || [];
    const [, value2] =  this.getValue('value2')?.split('__') || [];
    if (!value1 || !value2) {
      return this.error(`${this.node.attrs.label.text as string}缺少选项`);
    }
    return this.success({
      MODEL_PARAMS_COMPUTE_FIELD: [
        {
          ...(this.node.attrs.moduleData.attributes as any)
            .MODEL_PARAMS_COMPUTE_FIELD[0],
          newFieldName: this.getValue("newfieldname"),
          newFieldAliasName: this.getValue("compute"),
          sourceFieldName: value1,
          targetFieldName: value2,
        },
      ],
    });
  }

  // 序列化值
  format() {
    const formatData = this.initValue;

    const [, value1, index1] =  this.getValue('value1')?.split('__') || [];
    const [, value2, index2] =  this.getValue('value2')?.split('__') || [];

    if (!this.getValue('value1') || !this.getValue('value2')) {
      return formatData;
    }

    const id = `${this.node.id}_compute`;

    const newColumn = this.addJourney(
      {
        columnChName: this.getValue("compute"),
        columnName: "",
        gmtCreate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        gmtModified: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        id,
        rowId: `${this.node.id}_compute`,
        columnType: `${this.compute}法运算`,
      },
      {
        prop: "source",
        label: "来源",
        // eslint-disable-next-line no-underscore-dangle
        value: ([`${this.initValue[parseFloat(index1)]?.title}/${value1}`, `${this.initValue[parseFloat(index2)]?.title}/${value2}`].join(',')),
      }
    );
    const find = formatData.find((item) => item.title === `运算`);
    if (!find) {
      formatData.push({
        title: `运算`,
        data: [newColumn],
      });
      return formatData;
    }
    return formatData.map((item) => {
      if (item.title === `运算`) {
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
