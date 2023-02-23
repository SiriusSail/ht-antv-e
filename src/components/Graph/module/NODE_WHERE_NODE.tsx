import { Cell } from "@antv/x6";
import dayjs from 'dayjs';
import * as Element from 'element-plus'
import { FormOption, OptionsType } from "@/components/TableFormItem/index.d";
import TabelForm from "./tabelForm";

const {
  ElOptionGroup,
  ElOption,
} = Element;

// 筛选
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.compute = cell.attrs.moduleData.name as string;
    this.relationshipOptions = JSON.parse(
      (cell
        .attrs
        .moduleData
        .attributes as any)
        .MODEL_PARAMS_WHERE_FIELD[0]
        .fieldSymbol)
      .map(({name, value}: {name: string, value: string}) => ({label: name, value}))
    this.initFrom();
  }

  relationshipOptions: OptionsType[] = []

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

  getVarOptions = () => {
    const options = this.initValue
      .map(({data, title}, i) => ({
        title,
        data: data.map((dataItem) => ({
          ...dataItem,
          _value: `value__${dataItem.columnName}__${i}`,
        }))
      })).find((item) => item.title === '参数')
    return options
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
    const varOptions = this.getVarOptions();
    console.log()
    this.createSelect({
      value: this.getValue('type'),
      label: '类型',
      name: 'type',
      placeholder: '请选择符号',
      options: [
        {
          label: '参数',
          value: '参数'
        }, {
          label: '修饰词',
          value: '修饰词'
        }
      ],
      useChange: (value) => {
        this.setValue({
          name: 'type',
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


  }

  necessary() {
    const varType = (this.node.attrs.moduleData.attributes as any)
      .MODEL_PARAMS_FUNC_FIELD?.[0].varType;
    const colVal1 = this.getValue('value')
    const colVal2 = this.getValue('value2')
    const colType = this.getValue('type')
    if (!colType || !colVal1 || (colType === 'range' && !colVal2)) {
      return this.error(`${this.node.attrs.label.text as string} 缺少选择项`);
    }
    return this.success({
      MODEL_PARAMS_VARIABLE: [{
        colName: this.node.attrs.label.text,
        colType,
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
        columnType: `符号: ${this.relationshipOptions.find((item) => item.value === this.getValue('type'))?.label || ''}`,
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
