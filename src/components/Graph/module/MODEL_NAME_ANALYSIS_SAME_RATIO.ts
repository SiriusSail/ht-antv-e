import { Cell } from "@antv/x6";
import TabelForm from "./tabelForm";
import { ColumnsItem } from "@/components/TableFormItem/index.d";

// 同比 MODEL_NAME_ANALYSIS_SAME_RATIO
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
      label: "时间维度",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_TIME_FIELD"),
      options,
    });
    this.createSelect({
      name: "MODEL_PARAMS_ANALYSIS_INDEX_FIELD",
      label: "计算字段",
      multiple: true,
      value: this.getValue("MODEL_PARAMS_ANALYSIS_INDEX_FIELD"),
      options,
    });

    this.createSelect({
      name: "MODEL_PARAMS_ANALYSIS_RATIO_TYPE",
      label: "同比类型",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_RATIO_TYPE") || "0",
      options: [
        {
          label: "同比发展速度",
          value: "0",
        },
        {
          label: "同比增长速度",
          value: "1",
        },
      ],
    });
    this.createInput({
      label: "字段前缀",
      name: "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX",
      value: this.getValue("MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX"),
    });
    this.createInput({
      label: "字段后缀",
      name: "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX",
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
    // const funcName = (this.node.attrs.moduleData.attributes as any)
    //   .MODEL_PARAMS_FUNC_FIELD?.[0].funcName;
    // const selectData = Object.entries(data)
    //   .filter(
    //     ([, value]) => value.value && /^addition_[0-9]*$/.test(value.name)
    //   )
    //   .map(([, value]) => value.value)
    //   .flat()
    //   .map((item) => ({
    //     fieldName: item.columnName,
    //     funcName,
    //   }));
    // if (selectData.length < 0) {
    //   return this.error(`${this.node.attrs.label.text as string} 缺少选择项`);
    // }
    // });

    const MODEL_PARAMS_ANALYSIS_TIME_FIELD = this.getValue(
      "MODEL_PARAMS_ANALYSIS_TIME_FIELD"
    );
    if (!MODEL_PARAMS_ANALYSIS_TIME_FIELD) {
      return this.error("时间维度不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_INDEX_FIELD = this.getValue(
      "MODEL_PARAMS_ANALYSIS_INDEX_FIELD"
    );
    if (!MODEL_PARAMS_ANALYSIS_INDEX_FIELD) {
      return this.error("计算字段不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_RATIO_TYPE = this.getValue(
      "MODEL_PARAMS_ANALYSIS_RATIO_TYPE"
    );
    if (!MODEL_PARAMS_ANALYSIS_RATIO_TYPE) {
      return this.error("同比类型不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX = this.getValue(
      "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX"
    );
    if (!MODEL_PARAMS_ANALYSIS_RATIO_TYPE) {
      return this.error("字段前缀不能为空");
    }
    const MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX = this.getValue(
      "MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX"
    );

    return this.success({
      MODEL_PARAMS_ANALYSIS_TIME_FIELD,
      MODEL_PARAMS_ANALYSIS_INDEX_FIELD,
      MODEL_PARAMS_ANALYSIS_RATIO_TYPE,
      MODEL_PARAMS_ANALYSIS_OUT_COLUMN_PREFIX,
      MODEL_PARAMS_ANALYSIS_OUT_COLUMN_SUFFIX,
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
