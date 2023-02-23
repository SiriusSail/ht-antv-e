import { Cell } from "@antv/x6";
import request from "@/utils/request";
import axiosApiHooks from "@/hooks/axiosApiHooks";

type Response = {
  attributes: null;
  description: string;
  head: string;
  nid: string;
  params: null;
  to: string;
  type: string;
};

export type Pages<T> = {
  current: number;
  hitCount: false;
  optimizeCountSql: true;
  orders: [];
  records: T[];
  pages: number;
  searchCount: true;
  size: number;
  total: number;
};

// 节点类型枚举
type BigType =
  | "MODEL_TYPE_VARIABLE "
  | "MODEL_TYPE_NODE"
  | "MODEL_TYPE_OUTPUT"
  | "MODEL_TYPE_INPUT";

// 节点类型枚举
type NodeigType = "NODE_GROUP_BY" | "INPUT_MERGE_DB"; // | "MODEL_TYPE_OUTPUT" | "MODEL_TYPE_INPUT"

export type NodeRuleModelType = {
  name: string; // 节点名称
  headBigTypeRule: BigType[]; // 允许接入的节点类型
  tailBigTypeRule: BigType[]; // 允许接出的节点类型
  rejectHeadNodeRule: NodeigType[]; // 不允许接出的节点类型
  rejectTailNodeRule: NodeigType[]; // 不允许接出的节点类型
  enabled: boolean; // 是否开启
  bigType: BigType; // 节点类型
  type: NodeigType;
  headMaxCount: number; // 上游节点最大链接数
  description: string;
  icon: string;
  attributes: {
    MODEL_PARAMS_FUNC_FIELD: {
      fieldName: string;
      funcName: string;
    }[];
  };
};

// 数据开发
export type InitModelInfo = {
  bigTypeMaxCountRule: {
    // 节点类型枚举
    [key in NodeigType]: number;
  };
  nodeRule: {
    [key in string]: NodeRuleModelType[];
  };
};

export type DdmflowPageRes = {
  code: string;
  createBy: string;
  gmtCreate: string;
  gmtModified: string;
  modifiedBy: string;
  name: string;
  rowId: string;
  isSql: 0;
  status: 0;
  tempdb: 0;
};

export type AttributeListType = {
  username: string;
  ip: string;
  port: string;
  dbName: string;
  password: string;
};

// 源名称

export type CreateDataSourceResType = {
  attributeList: AttributeListType;
  datasourceName: string;
  datasourceType: string;
  description: string;
  id: string;
};
export type DataSourceResType = {
  attributeList: AttributeListType;
  id: number;
  datasourceType: string;
  createBy: string;
  gmtCreate: string;
  modifiedBy: string;
  gmtModified: string;
  isDeleted: number;
  rowId: string;
  datasourceName: string;
  description: string;
};

export type IndassetDatabaseItemType = {
  assetId: string;
  businessType: string;
  columnChName: string;
  columnName: string;
  columnType: string;
  createBy: string;
  format: string;
  gmtCreate: string;
  gmtModified: string;
  id: 0;
  isDeleted: 0;
  modifiedBy: string;
  rowId: string;
};

export type IndassetDatabaseType = {
  assetName: string;
  columnList: IndassetDatabaseItemType[];
  createBy: string;
  datasourceName: string;
  datasourceId: string;
  description: string;
  domain: string;
  gmtCreate: string;
  gmtModified: string;
  id: 0;
  isDeleted: 0;
  modifiedBy: string;
  rowId: string;
  tableChName: string;
  tableEnName: string;
};

type DdmflowQueryListItemType = {
  createBy: string;
  fieldAliasName: string;
  fieldName: string;
  fieldType: string;
  flowId: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  rowId: string;
};

export type DdmflowQueryListType = {
  code: string;
  fields: DdmflowQueryListItemType[];
  name: string;
  row_id: string;
};

export type FlowDdmflowType = {
  code: string;
  resultStr: {
    [prop: string]: string;
  }[];
  logStr: {
    level: string;
    time: string;
    module: string;
    msg: string;
  }[];
  name: string;
  rowId: string;
  scriptStr: string;
};

// 保存数据开发的数据格式
type FlowModelType = {
  attributes: any;
  bigType: string;
  description: string;
  head: string;
  headBigTypeRule: string[];
  headMaxCount: 0;
  icon: string;
  name: string;
  nid: string;
  params: any;
  rejectHeadNodeRule: string[];
  rejectTailNodeRule: string[];
  subName: string;
  tailBigTypeRule: string[];
  to: string;
  type: string;
};
type DdmflowReqType = {
  code: string;
  flowModel: FlowModelType[];
  rowId: string;
  name: string;
};

export type columnItemType = {
  assetId: string;
  businessType: string;
  columnChName: string;
  columnName: string;
  columnType: string;
  createBy: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  rowId: string;
};
export type ColumnDataType = {
  // columnList: columnItemType[],
  // rowId: 2,
  tableChName: "bank_customer";
  tableEnName: "bank_customer";
};

export type ColumnByTableInfo = {
  columnChName: string;
  columnName: string;
  columnType: string;
};

export type DomainItem = {
  dictLabel: string;
  dictValue: string;
};

export type IicindcardItem = {
  asset1Id: string;
  asset2Id: string;
  asset3Id: string;
  cardDomain: string;
  cardName: string;
  connectType: string;
  createBy: string;
  datasourceId: string;
  description: string;
  generateSql: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  rowId: string;
  table1ChName: string;
  table1EnName: string;
  table2ChName: string;
  table2EnName: string;
  table3ChName: string;
  table3EnName: string;
};

type DdmflowInfo = {
  code: string;
  createBy: string;
  gmtCreate: string;
  gmtModified: string;
  jsonStr: string;
  logStr: string;
  modifiedBy: string;
  name: string;
  rowId: string;
  flowType: 1;
  id: 67;
  isSql: 0;
  status: 0;
  tempdb: 0;
};

export default {
  数据开发左侧列表: axiosApiHooks(() =>
    request<InitModelInfo>({
      url: "/ddm-iic/flow/ddmflow/initModelInfo",
      method: "get",
      json: true,
    })
  ),

  数据源列表: axiosApiHooks(() =>
    request<DataSourceResType[]>({
      url: "/ddm-iic/flow/inddatasource/list",
      method: "get",
      json: true,
    })
  ),
  数据源列表2: () =>
    request<DataSourceResType[]>({
      url: "/ddm-iic/flow/inddatasource/list",
      method: "get",
      json: true,
    }),
  新增数据源: axiosApiHooks((data: CreateDataSourceResType) =>
    request(
      {
        url: "/ddm-iic/flow/inddatasource",
        method: "post",
        json: true,
        data: {
          datasourceName: data.datasourceName,
          description: data.description,
          datasourceType: data.datasourceType,
          attributeList: data.attributeList,
        },
      },
      {
        success: true,
      }
    )
  ),
  修改数据源: axiosApiHooks((data: DataSourceResType) =>
    request(
      {
        url: "/ddm-iic/flow/inddatasource",
        method: "put",
        json: true,
        data,
      },
      {
        success: true,
      }
    )
  ),
  查询数据源: axiosApiHooks((data: string) =>
    request<
      DataSourceResType & {
        attributeList: any[];
      }
    >({
      url: `/ddm-iic/flow/inddatasource/${data}`,
      method: "get",
      json: true,
    })
  ),
  删除数据源: (rowId: string[]) =>
    request(
      {
        url: "/ddm-iic/flow/inddatasource",
        method: "delete",
        json: true,
        data: rowId,
      },
      {
        success: true,
      }
    ),

  数据资产列表: axiosApiHooks(() =>
    request<IndassetDatabaseType[]>({
      url: "/ddm-iic/flow/indasset/list",
      method: "get",
      json: true,
    })
  ),

  分页数据资产列表: axiosApiHooks((page) =>
    request<Pages<IndassetDatabaseType[]>>({
      url: "/ddm-iic/flow/indasset/page",
      method: "get",
      params: {
        page,
        limit: 10,
      },
      json: true,
    })
  ),

  获取HIVE资源列表: axiosApiHooks(() =>
    request<IndassetDatabaseType[]>({
      url: "/ddm-iic/flow/indasset/getHiveAssetList",
      method: "get",
      json: true,
    })
  ),

  原子指标列表: axiosApiHooks(() =>
    request<DdmflowQueryListType[]>({
      url: "/ddm-iic/flow/ddmflow/queryList/atom",
      method: "get",
      json: true,
    })
  ),

  业务指标列表: axiosApiHooks(() =>
    request<DdmflowQueryListType[]>({
      url: "/ddm-iic/flow/ddmflow/queryList/biz",
      method: "get",
      json: true,
    })
  ),

  衍生指标列表: axiosApiHooks(() =>
    request<DdmflowQueryListType[]>({
      url: "/ddm-iic/flow/ddmflow/queryList/derive",
      method: "get",
      json: true,
    })
  ),

  获取源数据资产列表: axiosApiHooks<string, ColumnDataType[]>((datasourceId) =>
    request({
      url: "/ddm-iic/flow/inddatasource/getTableByDatasourceInfo",
      method: "post",
      json: true,
      data: {
        datasourceId,
      },
    })
  ),

  获取表字段: axiosApiHooks(
    (data: { datasourceId: string; tableName: string }) =>
      request<ColumnByTableInfo[]>({
        url: "/ddm-iic/flow/inddatasource/getColumnByTableInfo",
        method: "post",
        json: true,
        data,
      })
  ),

  获取草稿箱: axiosApiHooks((data: { page: number }) =>
    request<Pages<DdmflowPageRes>>({
      url: "/ddm-iic/flow/ddmflow/page",
      method: "get",
      json: true,
      params: {
        ...data,
        status: 0,
        limit: 20,
      },
    })
  ),

  删除指标: axiosApiHooks((id: string) =>
    request<Pages<DdmflowPageRes>>({
      url: "/ddm-iic/flow/ddmflow",
      method: "delete",
      json: true,
      data: [id],
    })
  ),

  新增数据资产: axiosApiHooks((data: any) =>
    request(
      {
        url: "/ddm-iic/flow/indasset",
        method: "post",
        json: true,
        data,
      },
      {
        success: true,
      }
    )
  ),
  修改数据资产: axiosApiHooks((data: any) =>
    request(
      {
        url: "/ddm-iic/flow/indasset",
        method: "put",
        json: true,
        data,
      },
      {
        success: true,
      }
    )
  ),
  查询领域: axiosApiHooks(() =>
    request<DomainItem[]>({
      url: "/ddm-iic/sys/sysdict/domain",
      method: "get",
      json: true,
    })
  ),

  // 查询数据资产: (data: string) => request<IndassetDatabaseType>({
  //   url: `/ddm-iic/flow/indasset/${data}`,
  //   method: 'get',
  //   json: true,
  // }).then((res) => res.result),

  删除数据资产: (rowId: string[]) =>
    request(
      {
        url: "/ddm-iic/flow/indasset",
        method: "delete",
        json: true,
        data: rowId,
      },
      {
        success: true,
      }
    ),

  查询数据资产: axiosApiHooks((data: string) =>
    request<IndassetDatabaseType>({
      url: `/ddm-iic/flow/indasset/${data}`,
      method: "get",
      json: true,
    })
  ),
  数据卡片列表: axiosApiHooks(() =>
    request<IicindcardItem[]>({
      url: "/ddm-iic/datasource/iicindcard/list",
      method: "get",
      json: true,
    })
  ),

  获取数据卡片: (data: IndassetDatabaseType) =>
    request(
      {
        url: "/ddm-iic/datasource/iicindcard",
        method: "post",
        json: true,
        data: {
          datasourceName: data.datasourceName,
          description: data.description,
        },
      },
      {
        success: true,
      }
    ),
  修改数据卡片: (data: IndassetDatabaseType) =>
    request(
      {
        url: "/ddm-iic/datasource/iicindcard",
        method: "put",
        json: true,
        data,
      },
      {
        success: true,
      }
    ),
  查询数据卡片: axiosApiHooks((data: string) =>
    request<IndassetDatabaseType>({
      url: `/ddm-iic/datasource/iicindcard/${data}`,
      method: "get",
      json: true,
    })
  ),
  删除数据卡片: (rowId: string[]) =>
    request(
      {
        url: "/ddm-iic/datasource/iicindcard",
        method: "delete",
        json: true,
        data: {
          rowIds: rowId,
        },
      },
      {
        success: true,
      }
    ),
  // cellList 为节点关系列表
  // formJson 原生数据
  保存数据开发: axiosApiHooks(
    ({
      cellList,
      formJSON,
      ...params
    }: {
      cellList: Cell.Properties[];
      formJSON: Cell.Properties[];
      status: 0 | 1;
      name: string;
      flowDomain: string;
      flowType: string;
    }) => {
      const flowModel = cellList.map((item) => {
        const superior = item.attrs.superior as any as [];
        const subordinate = item.attrs.subordinate as any as [];
        const moduleData = item.attrs.moduleData as any as FlowModelType;
        return {
          ...moduleData,
          // subordinate,
          name: item.attrs?.label?.text || "未命名",
          nid: item.id,
          icon: "",
          head: subordinate.join(","),
          to: superior.join(","),
          subName: subordinate.join(","),
        };
      });
      console.log(flowModel);
      return request<FlowDdmflowType>(
        {
          url: `/ddm-iic/flow/ddmflow`,
          method: "post",
          json: true,
          data: {
            flowModel,
            formJSON,
            ...params,
          },
        }
      );
    }
  ),
  获取指标数据: axiosApiHooks((rowId: string) =>
    request<DdmflowInfo>({
      url: `/ddm-iic/flow/ddmflow/${rowId}`,
      method: "get",
      json: true,
    })
  ),
  获取指标类型: axiosApiHooks(() =>
    request<
      {
        dictLabel: string;
        dictValue: string;
      }[]
    >({
      url: `/ddm-iic/sys/sysdict/flowType`,
      method: "get",
      json: true,
    })
  ),
  获取指标领域: axiosApiHooks((flowType: string) =>
    request<
      {
        code: string;
        description: string;
      }[]
    >({
      url: `/ddm-iic/indFlow/iicindCode/getDomainList`,
      method: "get",
      json: true,
      params: { flowType },
    }).then((res) => ({
      ...res,
      result: res.result.map((item) => ({
        value: item.code,
        label: item.description,
      })),
    }))
  ),
  获取名称列表: axiosApiHooks((flowType: string) =>
    request<
      {
        code: string;
        description: string;
      }[]
    >({
      url: `/ddm-iic/indFlow/iicindCode/getCodeList`,
      method: "get",
      json: true,
      params: { flowType },
    }).then((res) => ({
      ...res,
      result: res.result.map((item) => ({
        value: item.code,
        label: item.description,
      })),
    }))
  ),
  获取模块列表: axiosApiHooks((params: { flowType: string; domain: string }) =>
    request<
      {
        code: string;
        description: string;
      }[]
    >({
      url: `/ddm-iic/indFlow/iicindCode/getModuleList`,
      method: "get",
      json: true,
      params,
    }).then((res) => ({
      ...res,
      result: res.result.map((item) => ({
        value: item.code,
        label: item.description,
      })),
    }))
  ),
  预览数据开发: axiosApiHooks(
    ({
      cellList,
      formJSON,
      ...params
    }: {
      cellList: Cell.Properties[];
      formJSON: Cell.Properties[];
      status: 0 | 1;
      name: string;
      flowDomain: string;
      flowType: string;
    }) => {
      const flowModel = cellList?.map((item) => {
        const superior = item.attrs.superior as any as [];
        const subordinate = item.attrs.subordinate as any as [];
        const moduleData = item.attrs.moduleData as any as FlowModelType;
        return {
          ...moduleData,
          // subordinate,
          name: item.attrs?.label?.text || "未命名",
          nid: item.id,
          icon: "",
          head: subordinate.join(","),
          to: superior.join(","),
          subName: subordinate.join(","),
        };
      });
      return request<FlowDdmflowType>(
        {
          url: `/ddm-iic/flow/ddmflow/view`,
          method: "post",
          json: true,
          data: {
            flowModel,
            formJSON,
            ...params,
          },
        },
        {
          success: true,
        }
      );
    }
  ),
};

export const getDictType = (dictType: string) => request<any>({
  url: `/ddm-iic/sys/sysdict/list/${dictType}`,
  method: "get",
  json: true,
});
