import { Cell } from '@antv/x6';
import TabelForm from './tabelForm';
import { ColumnsItem } from '@/components/TableFormItem/index.d'

// 选择
export default class Index extends TabelForm {

  constructor(cell: Cell) {
    super(cell);
    this.initFrom();
  }

  async initFrom() {
    this.createNameInput();

    this.initValue.forEach((item, index) => {
      const name = `dataValue_${index}`;
      this.createTable({
        ...item,
        name,
        value: this.getValue(name),
        columns: this.defaultColumns,
        isSelection: true,
        useColumns: (oldColumns: ColumnsItem[], changeColumns: ColumnsItem[]) => [
          ...oldColumns,
          ...changeColumns
        ],
      });

    })
  }


  necessary() {
    const data = this.getValues();
    const selectData = Object.entries(data)
      .filter(([, value]) => value.value && /^dataValue_[0-9]*$/.test(value.name))
      .map(([, value]) => value.value)
      .flat()
      .map((item) => item.columnName)
      .join(',');
    if(!selectData) {
      return this.error(`${this.node.attrs.label.text as string} 缺少选择项`)
    }
    return this.success({
      MODEL_PARAMS_SELECT_FIELD: selectData
    })
  }

  // 序列化值
  format () {
    const data = this.getValues();
    const selectData = Object.entries(data)
      .filter(([, value]) => value.value && /^dataValue_[0-9]*$/.test(value.name))
      .map(([, value]) => TabelForm.reductionTableData(value.value)).flat();
    const formatData = this.initValue.map((item) => ({
      title: item.title,
      data: item.data.filter((item2: any) => {
        const find = selectData.find((diffItem: any) => diffItem.rowId === item2.rowId)
        return find
      })
    }));
    return formatData;
  }
}