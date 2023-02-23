import { Cell } from "@antv/x6";
import * as Element from 'element-plus'
import TabelForm from "./tabelForm";
import { ColumnsItem } from "@/components/TableFormItem/index.d";

const {
  ElSelect,
  ElOption,
} = Element;
// 排序
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);

    this.initFrom();
    this.compute = cell.attrs.moduleData.name as string;
    // this.defaultColumns.push(...this.expandColumns);
  }

  expandValue: {
    [rowId: string]: string
  } = {}

  expandColumns: ColumnsItem[]  = [
    {
      label: "字段名称",
      prop: "columnChName",
    },
    {
      label: "字段",
      prop: "columnName",
    },
    {
      label: "字段类型",
      width: "150px",
      prop: "columnType",
      defaultSlot: ({row}:any)=>{
        this.expandValue[row.columnName] = this.expandValue[row.columnName] || "ASC"
        return <ElSelect
          modelValue={this.expandValue[row.columnName]}
          onChange={(e: string) => {
            this.expandValue[row.columnName] = e
            this.upDateForm();
          }}
          placeholder='请选择领域'
        >
          <ElOption value={'ASC'} label='升序' />
          <ElOption value={'DESC'} label='降序' />
        </ElSelect>
      }
    },
  ];

  async initFrom() {
    this.initValue.forEach((item, index) => {;
      const name = `addition_${index}`;
      this.createTable({
        ...item,
        name,
        value: this.getValue(name),
        columns: this.expandColumns,
        isSelection: true,
        useColumns: (
          oldColumns: ColumnsItem[],
          changeColumns: ColumnsItem[]
        ) => [...oldColumns, ...changeColumns],
      });
    });
  }

  necessary() {
    const data = this.getValues();
    const funcName = (this.node.attrs.moduleData.attributes as any)
      .MODEL_PARAMS_FUNC_FIELD?.[0].funcName;
    const MODEL_PARAMS_ANALYSIS_SORT_FIELD = Object.entries(data)
      .filter(
        ([, value]) => value.value && /^addition_[0-9]*$/.test(value.name)
      )
      .map(([, value]) => value.value)
      .flat()
      .map((item) => item.columnName);
    if (MODEL_PARAMS_ANALYSIS_SORT_FIELD.length < 0) {
      return this.error(`${this.node.attrs.label.text as string} 缺少选择项`);
    }


    const  MODEL_PARAMS_ANALYSIS_SORT_TYPE =   MODEL_PARAMS_ANALYSIS_SORT_FIELD.map((key, index)=>this.expandValue[key])



    if(MODEL_PARAMS_ANALYSIS_SORT_FIELD.length <= 0) {
      return this.error("请选择排序字段")
    }


    return this.success({
      MODEL_PARAMS_ANALYSIS_SORT_FIELD,
      MODEL_PARAMS_ANALYSIS_SORT_TYPE
    });
  }

  // 序列化值
  format() {
    // 获取原本数据
    const formatData = this.initValue;

    const selectColumn = this.initValue
      .map((item) => item.data)
      .flat()
      .filter((diffItem) =>
        this.getValue("MODEL_PARAMS_ANALYSIS_INDEX_FIELD")?.find(
          (item: string) => item === diffItem.columnName
        )
      );
    const prefix = this.getValue("MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX");
    const suffix = this.getValue("MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX");
    const newColumn = selectColumn.map((item) =>
      this.addJourney(
        {
          ...item,
          columnChName: `${prefix}${item.columnName}${suffix}`,
          columnName: `${prefix}${item.columnName}${suffix}`,
          columnType: "string",
        },
        {
          prop: "analysis",
          label: "分析操作",
          // eslint-disable-next-line no-underscore-dangle
          value: "占比",
        }
      )
    );

    const find = formatData.find((item) => item.title === "分析操作");
    if (!find) {
      formatData.push({
        title: `${this.compute}`,
        data: newColumn,
      });
      return formatData;
    }
    return formatData.map((item) => {
      if (item.title === `${this.compute}`) {
        item.data.push(...newColumn);
        return item;
      }
      return item;
    });
  }
}
