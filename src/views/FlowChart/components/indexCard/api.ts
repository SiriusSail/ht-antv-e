import request from '@/utils/request'

export interface PageItem {
  limit: number,  //  每页显示记录数
  name?: string,  // 指标卡片名称
  order?: string, // 排序方式，可选值(asc、desc)
  orderField?: string, // 排序字段
  page: number,   // 当前页码，从1开始
}

export interface DraftsItem{
  cardContent: string,
  gmtCreate: string,
  gmtModified: string,
  id: number,
  isDeleted: number,
  name: string,
  rowId: string,
  status: number,
  createBy?:string,
  modifiedBy?:string,
  draftId?:string,
  publishId?:string,
  description?:string,
}

export interface DraftsProp{
  current: number,
  hitCount: boolean,
  optimizeCountSql: boolean,
  orders: any[],
  pages: number,
  records: DraftsItem[],
  searchCount: boolean,
  size: number,
  total: number,
}

export interface optionsItem {
  code: string,
  name: string,
  row_id: string,
}

type PublishProp = {
  thumbnail: string,
  content: string,
  flowIds: string[],
  name: string,
  publishId?: string,
  draftId?:string,
  description?:string,
}

type QuotaItemProp = {
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
}

export type QuotaListProp = {
  code: string;
  fields: QuotaItemProp[];
  name: string;
  row_id: string;
}

export type ChartProp = {
  quota? : string,
  x?: string,
  y?: string,
  curType?: string,
  symbol?: string,
  echartType?: string,
  tableType?: string,
  barColumn?: string,
  lineColumn?: string,
}

type DraftProp = {
  content: string,
  publishId: string,
  draftId: string,
  description: string,
  name: string,
}

export default {
  // 保存草稿箱
  ApiSaveDrafts: (param:DraftProp) => request({
    url: '/ddm-iic/indicatorCard/iicindindicatorcard/save',
    method: 'post',
    data: {
      content: param.content,
      draftId: param.draftId,
      publishId: param.publishId,
      description: param.description,
      name: param.name
    },
    json: true
  }),

  // 发布
  ApiCardPublish: (param:PublishProp) => request({
    url: '/ddm-iic/indicatorCard/iicindindicatorcardpublish/publish',
    method: 'post',
    data: {
      content: param.content,
      flowIds: param.flowIds,
      thumbnail: param.thumbnail,
      draftId: param.draftId,
      publishId: param.publishId,
      name: param.name,
      description: param.description,
    },
    json: true
  }),

  // 根据用户选择的条件，获取图表数据
  ApiGetChartData: (param:ChartProp) => request({
    url: '/ddm-iic/indicatorCard/iicindindicatorcard/getChartData',
    method: 'post',
    data: param,
    json: true
  }),

  // 根据字段名获取数据(复合表的图例接口)
  ApiGetDataByColumn: (param:ChartProp) => request({
    url: '/ddm-iic/indicatorCard/iicindindicatorcard/getDataByColumn',
    method: 'post',
    data: param,
    json: true
  }),

  // 获取草稿箱列表
  ApiGetDraftsList: (param:PageItem) => request<DraftsProp>({
    url: '/ddm-iic/indicatorCard/iicindindicatorcard/page',
    method: 'get',
    params: param,
    json: true
  }),

  // 获取单个草稿箱信息
  ApiGetDraftsItem: (id:string) => request({
    url: `/ddm-iic/indicatorCard/iicindindicatorcard/${id}`,
    method: 'get',
    json: true
  }),

  // 删除草稿箱
  ApiDelDrafts: (param:string[]) => request({
    url: '/ddm-iic/indicatorCard/iicindindicatorcard',
    method: 'delete',
    data: param,
    json: true
  }),

  // 获取下拉选择信息
  ApiOptions: (param:string) => request({
    url: `/ddm-iic/flow/ddmflow/queryList?flow_domain=${param}`,
    method: 'get',
    json: true
  }),

  // 根据领域获取指标
  ApiGetQuota: () => request({
    url: '/ddm-iic/flow/ddmflow/queryList/biz',
    method: 'get',
    json: true
  }),
}