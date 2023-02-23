import Axios, { Method, ResponseType, AxiosResponse } from "axios";
import { ElMessage } from "element-plus/lib/components/message";
import Cookies from "js-cookie";
// const baseURL = "http://127.0.0.1:8080";
interface axiosData {
  url: string;
  method: Method;
  headers?: any;
  json: boolean;
  contentType?: string;
  data?: any;
  params?: any;
  timeout?: number;
  responseType?: ResponseType;
}
type Response<D> = {
  result: D;
  code: number;
  message: string;
  success: boolean;
  timestamp: number;
};

const axios = Axios.create({
  // baseURL,
  timeout: 20000,
});
// 允许携带cookie
axios.defaults.withCredentials = true;
// 请求头信息
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
// 默认使用 application/json 形式
axios.defaults.headers.post["Content-Type"] = "application/json";

let isLogin = true;
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem("token")) {
      config.headers["cas-token"] = sessionStorage.getItem("token");
    }
    if (sessionStorage.getItem("accessToken")) {
      config.headers.Authorization = `Bearer ${sessionStorage.getItem(
        "accessToken"
      )}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// 响应拦截器
axios.interceptors.response.use(
  (res) => res,
  (err: any) => {
    if (
      err.response.status === 401 &&
      err.response.headers["enable-redirect"]
    ) {
      if (isLogin) {
        isLogin = false;
        ElMessage.error(`请先登录！`);
        sessionStorage.removeItem("token");
      }
      window.location.href = err.response.headers["redirect-url"];
      // window.location.href = 'http://caddmuat.changan.com.cn/cas/login?service=http://10.64.23.18:8080/ddm-iic/login/cas';
      return;
    }
    if (err.response && err.response.data) {
      const code = err.response.status;
      const msg = err.response.data.message;
      // ElMessage.error(`Code: ${code}, Message: ${msg}`);
    } else {
      // ElMessage.error(`${err}`);
    }
    return Promise.reject(err);
  }
);

/** *
 * axios({url,method,content,params,datas})
 *
 * @param {string}  url，(必填)
 * @param {string}  method,默认post
 * @param {boolean} json, content-type类型，(必填)
 * @param {object}  params
 * @param {object}  datas  //token在datas中
 *
 * @param {boolean | string} config.success // 成功自定义是否弹窗提示
 * @param {boolean | string} config.error // 失败是否自定义弹窗提示
 */
export function $request<D = any> (
  arr: axiosData,
  config: {
    success?: boolean | string;
    error?: boolean | string;
  } = {
      success: false,
      error: false,
    }
) {
  return new Promise<AxiosResponse<Response<D>>>((resolve, reject) => {
    // arr = requestValidate(arr)
    axios({
      timeout: arr.timeout === undefined ? 10000 : arr.timeout, // 请求超时时间
      url: arr.url,
      method: arr.method || "POST",
      headers: {
        // 'Authorization': arr.token || '',
        // eslint-disable-next-line no-nested-ternary
        "content-type": arr.contentType
          ? arr.contentType
          : arr.json
            ? "application/json; charset=UTF-8"
            : "application/x-www-form-urlencoded; charset=UTF-8",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      params: arr.params || "",
      data: arr.data || "",
      responseType: arr.responseType || "json",
    })
      .then((response: AxiosResponse<Response<D>>) => {
        /**
         * response格式
         *
         * {
          data:{},
          status:200,
          statusText:'OK',//从服务器返回的http状态文本
          headers: {},//响应头信息
          config: {} //`config`是在请求的时候的一些配置信息
        }
         */
        if (response) {
          const responseStatus = `${response.status}`;
          // 状态码2开头的处理逻辑
          if (responseStatus.charAt(0) === "2") {
            if (response.data.code !== 200 && config.error) {
              ElMessage({
                type: "error",
                message: response.data.message,
                customClass: "msgZindex",
              });
              reject(response.data);
              return;
            }
            if (config.success) {
              let msg = response.data.message;
              if (typeof config.success === "string") {
                msg = config.success;
              }
              ElMessage.success(msg);
            }
            resolve(response);
          } else {
            // ElMessage({
            //   type: 'error',
            //   message: response.data.message
            // })
            reject(response);
          }
        }
      })
      .catch((err) => {
        // ElMessage({
        //   type: "error",
        //   message: err.message,
        // });
        reject(err);
      });
  });
}

/** *
 * axios({url,method,content,params,datas})
 *
 * @param {string}  url，(必填)
 * @param {string}  method,默认post
 * @param {boolean} json, content-type类型，(必填)
 * @param {object}  params
 * @param {object}  datas  //token在datas中
 *
 * @param {boolean | string} config.success // 成功自定义是否弹窗提示
 * @param {boolean | string} config.error // 失败是否自定义弹窗提示
 */
export default function request<D = any> (
  arr: axiosData,
  config: {
    success?: boolean | string;
    error?: boolean | string;
  } = {}
) {
  return $request<D>(arr, {
    success: false,
    error: true,
    ...config,
  }).then((res) => res.data);
}
