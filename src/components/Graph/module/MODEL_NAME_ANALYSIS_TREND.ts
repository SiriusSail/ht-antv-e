import { Cell } from "@antv/x6";
import dayjs from "dayjs";
import TabelForm from "./tabelForm";
import { ColumnsItem } from "@/components/TableFormItem/index.d";
// 趋势组件 MODEL_NAME_ANALYSIS_TREND
export default class Index extends TabelForm {
  compute = "";

  constructor(cell: Cell) {
    super(cell);
    this.initFrom();
    this.compute = cell.attrs.moduleData.name as string;
  }

  async initFrom() {
    const options = this.initValue
      .map((item, index) =>
        // eslint-disable-next-line no-shadow
        item.data.map((item) => ({
          label: item.columnChName,
          value: item.columnName,
        }))
      )
      .flat();
    this.createNameInput();

    this.createSelect({
      name: "MODEL_PARAMS_ANALYSIS_TIME_FIELD",
      label: "时间字段",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_TIME_FIELD"),
      options,
    });

    this.createDateTimePicker({
      name: "MODEL_PARAMS_ANALYSIS_MIN_TIME",
      label: "开始时间",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_MIN_TIME"),
      type: "date",
      placeholder: "开始",
    });
    this.createDateTimePicker({
      name: "MODEL_PARAMS_ANALYSIS_MAX_TIME",
      label: "结束时间",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_MAX_TIME"),
      type: "date",
      placeholder: "请选择结束时间",
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
    const MODEL_PARAMS_ANALYSIS_TIME_FIELD = this.getValue(
      "MODEL_PARAMS_ANALYSIS_TIME_FIELD"
    );
    if (!MODEL_PARAMS_ANALYSIS_TIME_FIELD) {
      return this.error("时间字段不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_MIN_TIME = this.getValue(
      "MODEL_PARAMS_ANALYSIS_MIN_TIME"
    );
    console.log(MODEL_PARAMS_ANALYSIS_MIN_TIME);
    if (!MODEL_PARAMS_ANALYSIS_MIN_TIME) {
      return this.error("开始时间不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_MAX_TIME = this.getValue(
      "MODEL_PARAMS_ANALYSIS_MAX_TIME"
    );
    console.log(MODEL_PARAMS_ANALYSIS_MAX_TIME);
    if (!MODEL_PARAMS_ANALYSIS_MAX_TIME) {
      return this.error("结束时间不能为空");
    }
    const minDate = dayjs(MODEL_PARAMS_ANALYSIS_MIN_TIME).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const maxDate = dayjs(MODEL_PARAMS_ANALYSIS_MAX_TIME).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    return this.success({
      MODEL_PARAMS_ANALYSIS_TIME_FIELD,
      MODEL_PARAMS_ANALYSIS_MIN_TIME: minDate,
      MODEL_PARAMS_ANALYSIS_MAX_TIME: maxDate,
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
