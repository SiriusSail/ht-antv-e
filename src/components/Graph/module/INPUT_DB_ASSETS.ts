import { Node } from '@antv/x6';
import apis from '@/views/FlowChart/apis';
import TabelForm, { FormatType } from './tabelForm';

// 资源
export default class Index extends TabelForm {
  compute = ''

  apis = {
    ['资产' as string]: apis.数据资产列表({
      needInit: false,
      initValue: []
    }),
    ['卡片' as string]: apis.数据资产列表({
      needInit: false,
      initValue: []
    }),
    ['原子' as string]: apis.数据资产列表({
      needInit: false,
      initValue: []
    }),
    ['衍生' as string]: apis.数据资产列表({
      needInit: false,
      initValue: []
    }),
    ['业务' as string]: apis.数据资产列表({
      needInit: false,
      initValue: []
    }),
  }

  loadingPromise: Promise<any>

  constructor(node: Node) {
    super(node);
    this.compute = (node.attrs.moduleData.name || node.attrs.moduleData.description) as string;
    this.initFrom();
  }

  async initFrom() {
    this.loadingPromise = this.apis[this.compute].request();
    this.createNameInput();

    const data = this.apis[this.compute];
    await this.loadingPromise;

    this.createSelect({
      name: 'MODEL_PARAMS_ASSETS_ID',
      label: '数据资产',
      placeholder: '请选择数据资产',
      value: this.getValue('MODEL_PARAMS_ASSETS_ID'),
      options: data.data.map((item) => ({
        value: item.rowId,
        label: item.assetName
      })),
      useChange: async (value) => {
        // 查询数据资产并且把它 放置到表格上
        const tableData = await apis.查询数据资产.request(value).then((res) => res.result.columnList);
        console.log('tableData', tableData)
        this.setValue({
          name: 'tableDataName',
          value: tableData,
        })

        return value;
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
    const selectData = this.getValue('MODEL_PARAMS_ASSETS_ID');
    if(!selectData) {
      return this.error('资产缺少选择项')
    }
    return this.success({
      MODEL_PARAMS_ASSETS_ID: selectData
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
    console.log(formatData);
    return [{
      title: this.node.attrs.label.text as string,
      data: formatData
    }];
  }
}