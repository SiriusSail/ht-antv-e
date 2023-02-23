import { Cell } from '@antv/x6';
import TabelForm from './tabelForm';

// 控制台
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
        data: item.data,
        title: item.title,
        name,
        value: this.getValue(name),
        columns: this.defaultColumns,
      });
    })
  }
}