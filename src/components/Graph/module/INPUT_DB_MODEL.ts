import { Node } from '@antv/x6';
import apis from '@/views/FlowChart/apis';
import TabelForm from './tabelForm';

// 资源
export default class Index extends TabelForm {
  compute = ''

  apis = {
    ['原子' as string]: apis.原子指标列表({
      needInit: false,
      initValue: []
    }),
    ['衍生' as string]: apis.衍生指标列表({
      needInit: false,
      initValue: []
    }),
    ['业务' as string]: apis.业务指标列表({
      needInit: false,
      initValue: []
    }),
  }

  columns = [
    {
      label: '字段名称',
      prop: 'fieldAliasName'
    },
    {
      label: '字段',
      prop: 'fieldName'
    },
    {
      label: '字段类型',
      prop: 'fieldType'
    }
  ]

  loadingPromise: Promise<any>

  constructor(node: Node) {
    super(node);
    this.compute = (node.attrs.moduleData.name || node.attrs.moduleData.description) as string;
    this.loadingPromise = this.apis[this.compute].request();
    this.initFrom();
  }

  async initFrom() {
    this.createNameInput();

    const data = this.apis[this.compute];
    await this.loadingPromise;

    this.createSelect({
      name: 'MODEL_PARAMS_NOSQL_DB_ID',
      label: `${this.compute}指标`,
      placeholder: `请选择${this.compute}指标`,
      value: this.getValue('MODEL_PARAMS_NOSQL_DB_ID'),
      options: data.data.map((item) => ({
        value: item.row_id,
        label: item.name
      })),
      useChange: async (value) => {
        // 查询数据资产并且把它 放置到表格上
        const findData = data.data.find((item) => item.row_id === value);
        this.setValue({
          name: 'tableDataName',
          value: findData.fields,
        })

        return value;
      }
    });

    this.createTable({
      value: undefined,
      data: this.getValue('tableDataName'),
      dataName: 'tableDataName',
      columns: this.columns
    });
  }

  necessary() {
    const selectData = this.getValue('MODEL_PARAMS_NOSQL_DB_ID');
    if(!selectData) {
      return this.error('资产缺少选择项')
    }
    return this.success({
      MODEL_PARAMS_NOSQL_DB_ID: selectData
    })
  }

  // 序列化值
  format () {
    const data = this.getValues();
    const formatData = data.tableDataName?.value
      ?.map((item: any) => this.addJourney(
        {
          ...item,
          columnChName: item.fieldAliasName,
          columnName: item.fieldName,
          columnType: item.fieldType,
        },
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