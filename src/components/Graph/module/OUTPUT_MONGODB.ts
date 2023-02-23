import { Cell } from '@antv/x6';
import TabelForm from './tabelForm';

// mongdb
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
      });

    })
  }

  // 序列化值
  format () {
    return this.initValue;
  }
}