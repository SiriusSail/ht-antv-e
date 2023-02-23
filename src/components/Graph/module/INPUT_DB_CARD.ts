import { Node } from '@antv/x6';
import apis from '@/views/FlowChart/apis';
import TabelForm, { FormatType } from './tabelForm';

// 资源
export default class Index extends TabelForm {
  compute = ''

  getList = apis.数据卡片列表({
    needInit: false,
    initValue: []
  })

  loadingPromise: Promise<any>

  constructor(node: Node) {
    super(node);
    this.compute = (node.attrs.moduleData.name || node.attrs.moduleData.description) as string;
    this.initFrom();
  }

  async initFrom() {
    this.loadingPromise = this.getList.request();
    this.createNameInput();

    const data = this.getList;
    await this.loadingPromise;

    this.createSelect({
      name: 'cardId',
      label: '数据卡片',
      placeholder: '请选择数据卡片',
      value: this.getValue('cardId'),
      options: data.data.map((item) => ({
        value: item.rowId,
        label: item.cardName
      })),
      useChange: async (value) =>{
        // 查询数据资产并且把它 放置到表格上
        const tableData = await apis.查询数据卡片.request(value).then((res) => res.result.columnList);
        console.log('tableData', tableData)
        this.setValue({
          name: 'tableDataName',
          value: tableData,
        })

        return value
      }

    });

    this.createTable({
      value: undefined,
      data: this.getValue('tableDataName'),
      dataName: 'tableDataName',
      columns: this.defaultColumns
    });
  }

  necessary() {
    const selectData = this.getValue('cardId');
    if(!selectData) {
      return this.error('数据卡片缺少选择项')
    }
    return this.success({
      MODEL_PARAMS_CARD_ID: selectData
    })
  }

  // 序列化值
  format () {
    const data = this.getValues();
    const formatData = data.tableDataName?.value
      ?.map((item: any) => this.addJourney(
        item,
        {
          prop: 'source',
          label: '来源',
          value: this.node.attrs.label.text as string
        }
      )) || [];
    return [{
      title: this.node.attrs.label.text as string,
      data: formatData
    }];
  }
}