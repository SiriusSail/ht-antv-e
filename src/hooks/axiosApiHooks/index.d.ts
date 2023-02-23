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
    /**
     * 如果参数相同，是否使用缓存的上次data数据，取了新data会覆盖
     * 默认为：true
     */
    cache?: boolean;
    /**
     * 相同的接口和参数只会请求一次
     */
    deepCache?: boolean;
    /**
     * 防抖间隔，频繁改变参数，则只发最后一次请求
     */
    debounceInterval?: number;
}
export declare const axiosApiHooksConfig: {
    setCacheFn: (name: string, value: any) => any;
    getCacheFn: (name: string) => any;
};
export default function axiosApiHooks<P, D>(request: (params: P) => Promise<{
    data: D;
}>): (({ cache, initValue, params, needInit, deepCache, debounceInterval }?: ApiHooksParams<P, D>) => {
    request: (p?: P | undefined) => Promise<D>;
    data: D;
    loading: boolean;
    error: any;
    // dataRef: import("react").MutableRefObject<D>;
}) & {
    request: (params?: P | undefined) => Promise<D>;
    DataType: D;
    ParamsType: P;
};
