export interface Colum {
  type?: "selection" | "index" | "expand";
  index?: number | ((index: number) => {});
  label?: string;
  columnKey?: string;
  prop?: string | number;
  width?: string | number;
  minWidth?: string | number;
  fixed?: "left" | "right";
  renderHeader?: (data: any) => {};
  resizable?: boolean;
  formatter?: (row: any, column: any, cellValue: any, index: any) => {};
  showOverflowTooltip?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  className?: string;
  labelClassName?: string;
  selectable?: (row: any, index: any) => {};
  filters?: { text: any; value: any }[];
  filterPlacement?: string;
  filterMultiple?: boolean;
  sortable?: boolean;
  slot?: boolean; // 是否开启插槽
}