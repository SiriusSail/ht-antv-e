import request from "@/utils/request";
import type {
  DevType,
  KnowledgeType,
  ListType,
  RecommendationType,
  ListParams,
  TopListParams,
  TopType,
} from "./types/index";

export function devList(params: ListParams) {
  return request<ListType<DevType[]>>(
    {
      url: "/ddm-iic/contribute/page/dev",
      method: "get",
      params,
      json: true,
    },
    { error: true }
  );
}
export function knowledgeList(params: ListParams) {
  return request<ListType<KnowledgeType[]>>(
    {
      url: "/ddm-iic/contribute/page/knowledge",
      method: "get",
      params,
      json: true,
    },

    { error: true }
  );
}
export function recommendationList(params: ListParams) {
  return request<ListType<RecommendationType[]>>(
    {
      url: "/ddm-iic/contribute/page/recommendation",
      method: "get",
      params,
      json: true,
    },
    { error: true }
  );
}

export function topList(type: TopListParams) {
  return request<TopType[]>(
    {
      url: "/ddm-iic/contribute/points/top",
      method: "get",
      json: true,
      params: { type: type },
    },
    { error: true }
  );
}
