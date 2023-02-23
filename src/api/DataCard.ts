import request from "@/utils/request";
import { ListReq, ListRes, InfoRes } from "./types/DataCard";
class Api {
  static getList(params: ListReq) {
    return request<ListRes>(
      {
        url: "/ddm-iic/indicatorCard/iicindindicatorcardpublish/page",
        method: "get",
        params,
        json: true,
      },
      { error: true }
    );
  }
  static getInfo(id: string) {
    return request<InfoRes>(
      {
        url: `/ddm-iic/indicatorCard/iicindindicatorcardpublish/${id}`,
        method: "get",
        json: true,
      },
      { error: true }
    );
  }
}
export default Api;
