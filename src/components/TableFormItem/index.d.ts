
import { Node } from '@antv/x6';

export interface FormItem {
  label?: string;
  name: string;
  value: string;
}

export interface ColumnsItem {
  label?: string;
  prop?: string;
  width?:string | number;
  defaultSlot?: (value: { row }) => any;
}

export type PickerType =
  | "year"
  | "month"
  | "date"
  | "dates"
  | "week"
  | "datetime"
  | "datetimerange"
  | "daterange"
  | "monthrange";

interface InputProps extends FormItem {
  tag: "input";
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}
interface PickerProps extends FormItem {
  tag: "dateTimePicker";
  value: string;
  type: PickerType;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export type OptionsType = {
  label: string;
  value: any;
};
export interface SelectProps extends FormItem {
  tag: "select" | "checkbox" | "radio";
  placeholder?: string;
  value: string | string[];
  multiple?: boolean;
  options?: OptionsType[];
  defaultSlots?: () => any;
  onChange?: (value: string) => void;
}

export interface GraphTableData {
  title: string;
  data: any[]
}

export declare namespace GraphTablePropsStore {
  type data = GraphTableData[]; // 页面数据
  type options = OptionsType[]; // 下啦列表
  type name = string;
  type title = string;
  type innerJoin = {
    colMap: string
  }[];
  type showField = any[];
  type getTableData = (
    rootNode: (GraphTableData & {
      id: string;
    })[],
    nodes: (GraphTableData & {
      id: string;
    })[]
  ) => (GraphTableData & {
    id: string;
  })[];
}
export interface GraphTablePropsStore {
  data?: GraphTablePropsStore.data;
  options?: GraphTablePropsStore.options;
  name?: GraphTablePropsStore.name;
  title?: GraphTablePropsStore.title;
  /**
   * 连接信息 colMap: "A箭头id:A字段名 ,B箭头id:B字段名"
   */
  innerJoin: GraphTablePropsStore.innerJoin;
  /**
   * 选择的原数据，直接保存，不转化，选择什么保存什么
   */
  showField: GraphTablePropsStore.showField;
  /**
   * 获取最新的表格内容
   */
  getTableData?: GraphTablePropsStore.getTableData;
}

export interface GraphTableProps extends GraphTablePropsStore {
  tag: "graphTable";
  onSelectTable?: (value: GraphTablePropsStore.showField[]) => void;
  onLink?: (value: GraphTablePropsStore.innerJoin[]) => void;
  onClose?: () => void;
}

interface RateValue extends FormItem {
  tag: "rate";
}

export type TableFormA = {
  tag: "a";
  text: string;
  link: string;
  onClick?: () => void;
  // eslint-disable-next-line no-undef
  style?: string | JSXInternal.CSSProperties;
  className?: string;
};
export type TableFormText = {
  tag: "text";
  text: string;
  onClick?: () => void;
  // eslint-disable-next-line no-undef
  style?: string | JSXInternal.CSSProperties;
  className?: string;
};

export type TableFormSpan = {
  tag: "span";
  text: string | any;
  onClick?: () => void;
  // eslint-disable-next-line no-undef
  style?: string | JSXInternal.CSSProperties;
  className?: string;
};

type Hr = {
  tag: "hr";
};
type FormTabs =
  | RateValue
  | Hr
  | TableFormA
  | InputProps
  | SelectProps
  | TableFormText
  | PickerProps
  | TableFormSpan;

type Tabs = {
  tag: "tabs";
  name: string;
  childs: FormTabs[];
};

type Button = {
  tag: "button";
  text: string;
  disabled: boolean;
  icon: string | any;
  type: primary | success | warning | danger | info | text;
  onClick: () => void;
  style?: string | JSXInternal.CSSProperties;
};

// function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
//   return names.map(n => o[n]);
// }

export type TableType = {
  tag: "table";
  name: string;
  expand?: boolean;
  isSelection?: boolean;
  expandColumns?: ColumnsItem[];
  columns: ColumnsItem[];
  data: any[];
  value?: any[];
  onChange?: (value: any[]) => void;
};

export type FormOption = FormTabs | Tabs | TableType | Button | GraphTableProps;

export type TableValues = {
  [key: string]: FormTabs | Tabs;
}[];

export type PublicPropsType<T = any> = {
  value: T;
} & FormItem;

