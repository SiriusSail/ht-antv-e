import { Node } from '@antv/x6';
import apis from '@/views/FlowChart/apis';
import * as Element from 'element-plus';
import TabelForm, { FormatType } from './tabelForm';

const { ElSelect, ElOption } = Element;

// 资源
export default class Index extends TabelForm {
  compute = ''


  constructor(node: Node) {
    super(node);
    this.compute = (node.attrs.moduleData.name || node.attrs.moduleData.description) as string;
    this.initFrom();
    this.HIVEApi.request();
  }

  HIVEApi = apis.获取HIVE资源列表({
    needInit: false,
    initValue: []
  })

  options = apis.查询数据资产({
    needInit: false,
    initValue: []
  })

  loadingPromise: Promise<any>


  columns = [
    ...this.defaultColumns,
    {
      label: "映射字段",
      prop: "columnType",
      width: 120,
      defaultSlot: ({ row }: any) => {
        const options = this.getValue('options')
        // eslint-disable-next-line no-underscore-dangle
        const name = `value__${row.__alins || row.columnName}`;
        return <ElSelect
          clearable
          modelValue={this.getValue(name)}
          onChange={(e) => this.setValue({
            name,
            value: e,
          })}>
          {options?.map((item: any) => <ElOption
            key={item.value}
            label={item.label}
            value={item.value}
          />)}
        </ElSelect>
      }
    }
  ]

  async initFrom() {
    this.createNameInput();

    this.createSelect({
      name: 'MODEL_PARAMS_ASSETS_ID',
      label: 'HIVE表',
      placeholder: '请选择HIVE表',
      value: this.getValue('MODEL_PARAMS_ASSETS_ID'),
      options: this.HIVEApi.data?.map((item) => ({
        value: item.rowId,
        label: item.assetName
      })),
      useChange: async (value) => {
        // 查询数据资产并且把它 放置到表格上
        const options = await this.options.request(value).then((res) => res.columnList);
        this.setValue({
          name: 'options',
          value: options.map((item) => ({
            label: item.columnChName,
            value: item.columnName
          })),
        })

        return value;
      }
    });

    this.createSelect({
      name: 'type',
      label: '映射方式',
      placeholder: '请选择映射方式',
      value: this.getValue('type') || '0',
      options: [
        {
          value: '0',
          label: '覆盖'
        },
        {
          value: '1',
          label: '新增'
        }
      ],
    });

    this.initValue.forEach((item, index) => {
      const name = `dataValue_${index}`;
      this.createTable({
        ...item,
        name,
        value: this.getValue(name),
        columns: this.columns,
      });

    })
  }

  necessary() {
    const assetsId = this.getValue('MODEL_PARAMS_ASSETS_ID');
    const type = this.getValue('type') || '0';
    const data = this.getValues();
    const colMap = Object.entries(data)
      .filter(([, value]) => value.value && /^value__[\s-\S]*$/.test(value.name))
      .map(([, value]) => {
        const [, name] = value.name.split('__')
        return `${name}:${value.value}`
      }).join(',');

    if(!colMap) {
      return this.error('没有选择映射')
    }
    if(!assetsId) {
      return this.error('输出未选择')
    }
    return this.success({
      MODEL_PARAMS_ASSETS_ID: {
        assetsId,
        colMap,
        type
      }
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