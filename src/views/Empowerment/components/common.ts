import router from "@/router/index";
export const defaultPagination = {
  layout: " prev, pager, next",
  total: 0,
  currentPage: 1,
  pageSize: 10,
  small: true,
};

/**
 * 指标：1，5，6
互助：3
 * @param row 
 */
export const rowClick = (row: any) => {
  // console.log(row);
  if (
    row.contributeType === 1 ||
    row.contributeType === 5 ||
    row.contributeType === 6
  ) {
    router.push({ path: "/indexOnline/index", query: { key: row.refName } });
  } else if (row.contributeType === 3) {
    router.push({ path: "/messageInfo", query: { id: row.refId } });
  }
};
