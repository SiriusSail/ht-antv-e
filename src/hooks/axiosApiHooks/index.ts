import { ref, reactive, toRef, customRef, nextTick } from "vue";

export interface ApiHooksParams<P, D> {
  /**
   * data的初始值
   */
  initValue?: {
    [N in keyof D]?: D[N];
  } & any;
  /**
   * 请求的参数，参数变化会自动使用新的参数再次发起请求
   */
  params?: P;
  /**
   * 是否自动请求接口
   */
  needInit?: boolean;
  // /**
  //  * 如果参数相同，是否使用缓存的上次data数据，取了新data会覆盖
  //  * 默认为：true
  //  */
  // cache?: boolean;
  /**
   * 相同的接口和参数只会请求一次
   */
  deepCache?: boolean;
  /**
   * 防抖间隔，频繁改变参数，则只发最后一次请求
   */
  debounceInterval?: number;
}
let initDataBak: any = {};

export const axiosApiHooksConfig = {
  setInitData: (value: any) => {
    initDataBak = value;
  },
  getInitData: () => initDataBak,
};
export default function axiosApiHooks<P = any, D = any>(
  request: (params?: P) => Promise<{
    result: D;
  }>
) {
  // (({ cache, initValue, params, needInit, deepCache, debounceInterval }?: ApiHooksParams<P, D>) => {
  //   request: (p?: P | undefined) => Promise<D>;
  //   data: D;
  //   loading: boolean;
  //   error: any;
  //   // dataRef: import("react").MutableRefObject<D>;
  // }) & {
  //   request: (params?: P | undefined) => Promise<D>;
  //   DataType: D;
  //   ParamsType: P;
  // }
  // const data = ref<{
  //   result: D;
  // }>({
  //   result: {} as D
  // })
  function req({
    initValue,
    params,
    needInit,
    deepCache,
    debounceInterval,
  }: ApiHooksParams<P, D>) {
    const loadingRef = ref(false);
    const requsetData = reactive({
      loading: false,
      loadingRef: {
        value: false,
      },
      dataRef: {
        value: (initValue || initDataBak) as D,
      },
      data: (initValue || initDataBak) as D,
      error: "",
      request: (_data?: P) => {
        requsetData.loading = true;
        loadingRef.value = true;
        return request(_data || params)
          .then((res) => {
            requsetData.data = ref(res.result).value;
            requsetData.dataRef.value = ref(res.result).value;
            return res.result;
          })
          .finally(() => {
            requsetData.loadingRef.value = false;
            requsetData.loading = false;
            nextTick();
          });
      },
    });
    // data.value.result = initValue || initDataBak;
    if (needInit) {
      requsetData.request();
    }
    return requsetData;
    // return customRef<typeof apiData>((track, trigger) => {
    //   customTrigger = trigger;
    //   customTrack = track;
    //   return {
    //     get() {
    //       track();
    //       return apiData
    //     },
    //     set(newValue) {
    //       trigger();
    //       console.log(3333, newValue)
    //     }
    //   }
    // })
  }
  req.request = request;
  return req;
}
