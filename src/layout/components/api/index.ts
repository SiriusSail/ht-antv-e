import request from "@/utils/request";
import type { GetData } from "./index.d";
// 我的任务
export const getMyMessagesApi = () =>
  request<GetData[]>(
    {
      url: "/ddm-iic/sys/sysmessage/getMyMessages",
      method: "get",
      json: true,
    },
    { error: true }
  );

export const deleteSysmessageApi = (rowIds: string[]) =>
  request({
    url: "/ddm-iic/sys/sysmessage",
    method: "delete",
    data: rowIds,
    json: true,
  });

///ddm-iic/sys/sysmessage/getMyMessages
