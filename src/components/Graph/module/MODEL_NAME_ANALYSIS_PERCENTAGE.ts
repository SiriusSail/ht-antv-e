import { Cell } from "@antv/x6";
import TabelForm from "./tabelForm";
import { ColumnsItem } from "@/components/TableFormItem/index.d";

// 占比
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.initFrom();
    this.compute = cell.attrs.moduleData.name as string;
  }

  async initFrom() {
    this.createNameInput();
    // const selectValue = this.getSelectValue(/F/).flat();
    // indexSelect = [];
    const options = this.initValue
      .map((item, index) =>
        // eslint-disable-next-line no-shadow
        item.data.map((item) => ({
          label: item.columnChName,
          value: item.columnName,
        }))
      )
      .flat();

    this.createSelect({
      name: "MODEL_PARAMS_ANALYSIS_INDEX_FIELD",
      label: "计算字段",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_INDEX_FIELD"),
      multiple: true,
      options,
    });
    this.createSelect({
      name: "MODEL_PARAMS_ANALYSIS_AGGREGATE_FIELD",
      label: "计算维度",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_AGGREGATE_FIELD"),
      multiple: true,
      options,
    });

    this.createInput({
      name: "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX",
      label: "输出前缀",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX"),
    });
    this.createInput({
      name: "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX",
      label: "输出后缀",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX"),
    });

    this.initValue.forEach((item, index) => {
      const name = `duplicateValue_${index}`;
      this.createTable({
        ...item,
        name,
        value: this.getValue(name),
        columns: this.defaultColumns,
        isSelection: false,
        useColumns: (
          oldColumns: ColumnsItem[],
          changeColumns: ColumnsItem[]
        ) => [...oldColumns, ...changeColumns],
      });
    });
  }

  necessary() {
    // const data = this.getValues();
    // console.log("data", data);

    const MODEL_PARAMS_ANALYSIS_INDEX_FIELD = this.getValue(
      "MODEL_PARAMS_ANALYSIS_INDEX_FIELD"
    );

    if (MODEL_PARAMS_ANALYSIS_INDEX_FIELD.length === 0) {
      return this.error("请选择计算字段");
    }
    const MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX = this.getValue(
      "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX"
    );
    console.log(MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX);
    if (!MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX) {
      return this.error("请输入前缀");
    }
    const MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX = this.getValue(
      "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX"
    );

    const MODEL_PARAMS_ANALYSIS_AGGREGATE_FIELD = this.getValue(
      "MODEL_PARAMS_ANALYSIS_AGGREGATE_FIELD"
    );

    return this.success({
      MODEL_PARAMS_ANALYSIS_INDEX_FIELD,
      MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX,
      MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX,
      MODEL_PARAMS_ANALYSIS_AGGREGATE_FIELD,
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
          columnChName: `${prefix}${item.columnChName}${suffix}`,
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
        title: `${this.compute}法`,
        data: newColumn,
      });
      return formatData;
    }
    return formatData.map((item) => {
      if (item.title === `${this.compute}法`) {
        item.data.push(...newColumn);
        return item;
      }
      return item;
    });
  }
}
