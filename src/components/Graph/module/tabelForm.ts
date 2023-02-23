import { Cell } from "@antv/x6";
import dayjs from "dayjs";
import {
  FormOption,
  ColumnsItem,
  OptionsType,
  TableType,
  PickerType,
  PickerProps,
  SelectProps,
} from "@/components/TableFormItem/index.d";

export type ValueType = {
  name: string;
  expirationTime?: string;
  value: any;
};

export type FormatType = {
  title: string;
  data: any[];
};

type NecessaryType =
  | {
      code: 1; // 0 正确 1 错误
      message: string;
    }
  | {
      code: 0; // 0 正确 1 错误
      params: any;
    };

// 要用x6 的cell 开启
export default class TabelForm {
  node: Cell;

  constructor(cell: Cell) {
    this.node = cell;
  }

  // 更新方法列表
  valueCallback: {
    [name: string]: (value?: any) => void;
  } = {};

  formParamsDefault: {
    [key: string]: {
      expirationTime?: string,
      value: any,
      name: string,
    }
  } = {}

  /**
   * 更新from
   */

  upDateForm() {
    this.node.removeAttrByPath(["formOptions"]);
    this.node.attr("formOptions", this.formItemList as any);
    this.upDateAttrs();
  }

  attrsTimeout: any = null // 计时器

  upDateAttrs = () => {
    if (this.attrsTimeout) {
      clearTimeout(this.attrsTimeout);
    }

    this.attrsTimeout = setTimeout(() => {
      this.formChangeFn.forEach((item) => item(this.formItemList))
      clearTimeout(this.attrsTimeout);
      this.attrsTimeout = null
    }, 200);
  }

  formChangeFn: ((formOption: FormOption[]) => void) [] = []

  useFormChange = (fn: (formOption: FormOption[]) => void) => {
    this.formChangeFn.push(fn)
  }

  clearFormChange = () => {
    this.formChangeFn = []
  }

  /**
   * 设置value
   * @param name 字段名称
   * @param value 值
   * @param bindChangeCallback 修改完后的回调方法
   */
  setValue({
    bindChangeCallback,
    name,
    ...arg
  }: {
    /**
     * 字段名称
     */
    name: string;
    /**
     * 字段值
     */
    value: any;
    /**
     * 修改完后的回调方法
     */
    bindChangeCallback?: (value?: any) => void;
  }) {
    this.node.removeAttrByPath(`formParams/${name}`);
    this.node.removeAttrByPath(`formParams/${name}/value`);
    const newValue = {
      expirationTime: dayjs(new Date())
        .add(10, "minutes")
        .format("YYYY-MM-DD HH:mm:ss"),
      ...arg,
      name,
    };
    this.formParamsDefault[name] = newValue;
    this.node.attr(`formParams/${name}`, newValue);
    this.node.attr(`version`, (this.node.attrs.version as any || 0) + 1);
    this.upDateAttrs();

    if (bindChangeCallback) {
      this.valueCallback[name] = bindChangeCallback;
    } else {
      this.valueCallback[name]?.(arg.value);
    }
  }

  // 默认表头
  defaultColumns: ColumnsItem[] = [
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
      prop: "columnType",
    },
  ];

  /**
   * 获取值
   */
  getValue(name: string | number) {
    return (this.node.attrs.formParams as any)?.[name]?.value;
  }

  /**
   * 组件版本号
   */
  getVersion() {
    return this.node.attrs.version as any;
  }

  /**
   * 获取值
   */
  getValues() {
    const formParams = this.node.attrs.formParams as any as {
      [name: string]: ValueType;
    };
    return formParams || {};
  }


  /**
   * 清除所有值
   */
  clearValue() {
    this.node.removeAttrByPath("formParams");
    this.node.attr("formParams", {});
  }

  /**
   * formItemList 列表
   */
  formItemList: FormOption[] = [];

  /**
   * 序列化 给下个节点的值 需要覆盖
   */
  format(): FormatType[] {
    console.log("该节点尚未定义序列化方法", this.initValue);
    return this.initValue;
  }

  /**
   * 生成后端用的数据
   */
  necessary(): NecessaryType {
    console.log("该节点尚未定义序列化方法", this.getValues());
    return {
      code: 0,
      params: {},
    };
  }

  /**
   * 设置到后端用的数据里面 修改 moduleData/attributes
   */
  setAttributes(params: any) {
    this.node.removeAttrByPath('moduleData/params');
    this.node.attr("moduleData/params", params);
  }

  /**
   * 初始化表单
   */
  initFrom() {
    this.formItemList = [];
    console.log("该节点尚未定义初始化表单方法", this.formItemList);
  }

  /**
   * 当这个 节点被连接，那么这个里面存放着上个节点的值
   */
  initValue: FormatType[] = [];

  /**
   * 上个节点的值 通过这个方法写入 可以覆盖
   */
  async setIninValue(value: FormatType[]) {
    this.initValue = value; // 设置初始化值
    this.formItemList = [];
    this.valueCallback = {};
    this.initFrom(); // 初始化表单项
    // this.upDateForm(); // 发送更新通知
  }

  async createFromItem(
    fn: FormOption | ((index: number) => FormOption | Promise<FormOption>)
  ) {
    const index = this.formItemList.length;
    this.formItemList.push(undefined);
    if (typeof fn === "function") {
      const itemConfig = await fn(index);
      this.formItemList.splice(index, 1, itemConfig);
    } else {
      this.formItemList.splice(index, 1, fn);
    }
    return this.formItemList[index];
  }

  /**
   *
   * 获取表格 为name 的选择项
   * @param {RegExp} regExp 正则
   * @return {*}
   * @memberof TabelForm
   */
  getSelectValue(regExp: RegExp) {
    const data = this.getValues();
    const selectData = Object.entries(data)
      .filter(([, value]) => value.value && regExp.test(value.name))
      .map(([, value]) => value.value);
    return selectData;
  }

  async createInput({
    name = `input_${this.formItemList.length}`,
    value,
    // update,
    useChange,
    ...arg
  }: {
    value?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    useChange?: (newValue: string, formItem: FormOption, node: Cell) => string;
  }) {
    const formItem = this.createFromItem((index) => {
      this.setValue({
        name,
        value,
        bindChangeCallback: () => {
          (this.formItemList[index] as SelectProps).value = this.getValue(name);
        },
      });
      return {
        ...arg,
        name,
        value: value || this.getValue(name),
        tag: "input",
        onChange: async (changeValue: string) => {
          const newValue =
            (await useChange?.(
              changeValue,
              this.formItemList[index],
              this.node
            )) || changeValue;
          this.setValue({
            name,
            value: newValue,
          });
          this.upDateForm();
        },
      } as FormOption;
    });
    return formItem;
  }

  createNameInput() {
    this.createInput({
      label: "节点名称",
      placeholder: "请输入节点名称",
      value: this.node.attrs.label.text as string,
      useChange: (value) => {
        this.node.attr("label/text", value);
        return value;
      },
    });
  }

  async createSelect({
    name = `select_${this.formItemList.length}`,
    tag = 'select',
    value,
    useChange,
    ...arg
  }: {
    name?: string;
    tag?: "select" | "checkbox" | "radio"
    label?: string;
    placeholder?: string;
    value: string;
    multiple?: boolean;
    defaultSlots?: () => any;
    options?: OptionsType[];
    useChange?: (
      newValue: string,
      formItem: FormOption,
      node: Cell
    ) => string | null | undefined | Promise<string>;
  }) {
    const formItem = this.createFromItem((index) => {
      this.setValue({
        name,
        value,
        bindChangeCallback: () => {
          (this.formItemList[index] as SelectProps).value = this.getValue(name);
        },
      });
      return {
        ...arg,
        name,
        value: value || this.getValue(name),
        tag,
        onChange: async (changeValue: string) => {
          const newValue =
            (await useChange?.(
              changeValue,
              this.formItemList[index],
              this.node
            )) || changeValue;
          if (newValue === undefined || newValue === null) {
            return;
          }
          this.setValue({
            name,
            value: newValue,
          });
          // const data = this.getValue(name);
          // // 先清除 formOptions
          // (this.formItemList[index] as SelectProps).value = data
          this.upDateForm();
        },
      } as SelectProps;
    });
    return formItem;
  }

  async createDateTimePicker({
    name = `dateTimePicker_${this.formItemList.length}`,
    value,
    useChange,
    ...arg
  }: {
    name?: string;
    label?: string;
    placeholder?: string;
    value: string;
    type: PickerType;
    useChange?: (
      newValue: string,
      formItem: FormOption,
      node: Cell
    ) => string | null | undefined | Promise<string>;
  }) {
    const formItem = this.createFromItem((index) => {
      this.setValue({
        name,
        value,
        bindChangeCallback: () => {
          (this.formItemList[index] as PickerProps).value = this.getValue(name);
        },
      });
      return {
        ...arg,
        name,
        value: value || this.getValue(name),
        tag: "dateTimePicker",
        onChange: async (changeValue: string) => {
          const newValue =
            (await useChange?.(
              changeValue,
              this.formItemList[index],
              this.node
            )) || changeValue;
          if (newValue === undefined) {
            return;
          }
          this.setValue({
            name,
            value: newValue,
          });
          // const data = this.getValue(name);
          // // 先清除 formOptions
          // (this.formItemList[index] as SelectProps).value = data
          this.upDateForm();
        },
      } as PickerProps;
    });
    return formItem;
  }

  async createTable({
    name = `table_${this.formItemList.length}`,
    dataName = `${name}_tableData`,
    columnsName = `${name}_TableColumns`,
    data = [],
    value,
    title,
    columns,
    useChange,
    useColumns,
    ...arg
  }: {
    /**
     * 这个表格的name 对应的值是 value
     */
    name?: string;
    /**
     * 这个表格的标题
     */
    title?: string;
    /**
     * 这个表格的data 的name 对应的是 data
     */
    dataName?: string;
    /**
     * 这个表格的columns 的name 对应的是 columns
     */
    columnsName?: string;
    expand?: boolean;
    isSelection?: boolean;
    expandColumns?: ColumnsItem[];
    columns: ColumnsItem[];
    data: any[];
    value?: any[];
    useChange?: (newValue: any, formItem: FormOption, node: Cell) => any;
    /**
     * columns变化中间件
     */
    useColumns?: (
      oldColumns: ColumnsItem[],
      changeColumns: ColumnsItem[]
    ) => ColumnsItem[];
  }) {
    this.createFromItem({
      tag: "text",
      text: title,
    });
    const formItem = this.createFromItem((index) => {
      const changeData = TabelForm.splitTableData(data);
      const finalColumns = useColumns?.(columns, changeData.columnTtile) || [
        ...columns,
        ...changeData.columnTtile,
      ];
      this.setValue({
        name,
        value,
        bindChangeCallback: () => {
          (this.formItemList[index] as TableType).value = this.getValue(name);
        },
      });
      this.setValue({
        name: dataName,
        value: changeData.columnData,
        bindChangeCallback: () => {
          (this.formItemList[index] as TableType).data =
            this.getValue(dataName);
        },
      });
      this.setValue({
        name: columnsName,
        value: finalColumns,
        bindChangeCallback: () => {
          (this.formItemList[index] as TableType).columns =
            this.getValue(columnsName);
        },
      });

      return {
        tag: "table",
        ...arg,
        name,
        value: value || this.getValue(name),
        data: this.getValue(dataName),
        columns: this.getValue(columnsName),
        onChange: async (changeValue) => {
          const newValue =
            (await useChange?.(
              changeValue,
              this.formItemList[index],
              this.node
            )) || changeValue;
          if (newValue === undefined || newValue === null) {
            return;
          }
          this.setValue({
            name,
            value: newValue,
          });
          this.upDateForm();
        },
      };
    });
    return formItem;
  }

  /**
   * 拆分 tableData 的来源并且添加到 tableData
   */
  static splitTableData = (data: any[] = []) => {
    const columnData: {
      [key: string]: any;
    }[] = [];
    const columnTtile: ColumnsItem[] = [];
    data.forEach((item) => {
      const column = item;
      Object.entries(item).forEach(([key, value]: [string, any]) => {
        const keys = key.split(/^journey_/);
        if (keys.length === 2) {
          const columnFind = columnTtile.find(
            (item2) => `__${value.prop}` === item2.prop
          );
          const prop = `__${value.prop}`;
          if (!columnFind) {
            columnTtile.push({
              label: value.label,
              prop,
            });
          }
          column[prop] = value.value;
        }
      });
      columnData.push(column);
    });
    return {
      columnData,
      columnTtile,
    };
  };

  /**
   * 还原 由 splitTableData 拆分的Data
   */
  static reductionTableData = (data: any[]) => {
    const newData = data.map((item) => {
      const column = item;
      Object.entries(item).forEach(([key]: [string, any]) => {
        const isExistence = /^__/.test(key);
        if (isExistence) {
          delete column[key];
        }
      });
      return column;
    });
    return newData;
  };

  /**
   * 给字段 item 增加标识 途径标识
   * @param journey.prop 标识name
   * @param journey.label title
   * @param journey.value 显示内容
   *
   */
  addJourney = (
    data: any,
    ...journey: {
      prop: string;
      label: string;
      value: string;
    }[]
  ) => {
    const newData = {
      ...data,
    };
    journey.forEach((item) => {
      newData[`journey_${this.node.id}_${item.prop}`] = item;
    });
    return newData;
  };

  // eslint-disable-next-line class-methods-use-this
  error(message: string): NecessaryType {
    return {
      code: 1,
      message,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  success(params: any): NecessaryType {
    return {
      code: 0,
      params,
    };
  }
}
