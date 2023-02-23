import { ElMessage, ElMessageBox } from "element-plus/lib/components";
/**
 * @desc  函数防抖，用于将多次执行变为最后一次执行
 * @param {function} func - 需要使用函数防抖的被执行的函数。必传
 * @param {Number} wait - 多少毫秒之内触发，只执行第一次，默认1000ms。可以不传
 */

export const debounce = (
  fn: { apply: (arg0: any, arg1: IArguments) => void },
  delay = 300
) => {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null;
  function foo() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    const callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    if (callNow) fn.apply(foo, args);
  }
  return foo;
};
/**
 * 节流函数, 用于将多次执行变为每隔一段时间执行
 * @param fn 事件触发的操作
 * @param delay 间隔多少毫秒需要触发一次事件
 */
export function throttle(
  fn: { apply: (arg0: any, arg1: IArguments) => void },
  delay = 300
) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null;
  // eslint-disable-next-line func-names
  const foo = function () {
    const context = foo;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        clearTimeout(timer!);
      }, delay);
    }
  };
  return foo;
}

/**
 * 获取文件后缀名
 * @param {String} filename
 */
export function getExt(filename: string) {
  // if (typeof filename === "string") {
  return filename.split(".").pop()?.toLowerCase();
  // }
  // throw new Error("filename must be a string type");
}
export function getFileName(filename: string) {
  const arr = filename.split("/");

  const str = arr[arr.length - 1];
  return str;
}

export function copyToBoard(value: string) {
  const element = document.createElement("textarea");
  document.body.appendChild(element);
  element.value = value;
  element.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    document.body.removeChild(element);
    return true;
  }
  document.body.removeChild(element);
  return false;
}

/**
 * 休眠xxxms
 * @param {Number} milliseconds
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成随机id
 * @param {*} length
 * @param {*} chars
 */
export function uuid(length: number, chars: string) {
  // eslint-disable-next-line no-param-reassign
  chars =
    chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // eslint-disable-next-line no-param-reassign
  length = length || 8;
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

/**
 *浅拷贝
 * @export
 * @param {*} obj
 * @returns
 */
export function deepCopy(obj: any) {
  if (typeof obj !== "object") {
    return obj;
  }
  if (obj == null) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}
/**
 * 数组去重
 * @param {*} arr
 */
export function uniqueArray<T = any>(arr: T[]) {
  if (!Array.isArray(arr)) {
    throw new Error("The first parameter must be an array");
  }
  // eslint-disable-next-line eqeqeq
  if (arr.length == 1) {
    return arr;
  }
  return [...new Set(arr)];
}
/**
 * 对象转化为formdata
 * @param {Object} object
 */

export function getFormData(object: { [key: string]: string }) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => formData.append(`${key}[${i}]`, subValue));
    } else {
      formData.append(key, object[key]);
    }
  });
  return formData;
}

// 保留小数点以后几位，默认2位
export function cutNumber(number: number, no = 2) {
  if (typeof number !== "number") {
    // eslint-disable-next-line no-param-reassign
    number = Number(number);
  }
  return Number(number.toFixed(no));
}
/**
 * 数字加点
 * @param num
 * @returns
 */
export function thousands(num: number) {
  const str = num.toString();
  const reg =
    str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
}

// 对象数组去重
export const unquice = (person: any, key: any) => {
  let obj: any = {};
  let peon = person.reduce((cur: any, next: any) => {
    obj[next.key] ? "" : (obj[next.key] = true && cur.push(next));
    return cur;
  }, []); //设置cur默认类型为数组，并且初始值为空的数组
  return peon;
};

// 下载
export const dwonloadFile = (type: number, data: any, fileName?: any) => {
  if (type === 1) {
    window.open(`${data}&cas-token=${sessionStorage.getItem("token")}`);
  } else {
    // const datetime = Date.now();
    // 创建一个新的url，此url指向新建的Blob对象
    let url = window.URL.createObjectURL(new Blob([data]));
    // 创建a标签，并隐藏改a标签
    let link = document.createElement("a");
    link.style.display = "none";
    // a标签的href属性指定下载链接
    link.href = url;
    //setAttribute() 方法添加指定的属性，并为其赋指定的值。
    // let fileName = '购买明细表.xlsx'
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
};

export const debounces = (
  fn: { apply: (arg0: any, arg1: IArguments) => void },
  delay = 300
) => {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null;
  function foo() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(foo, args);
    }, delay);
  }
  return foo;
};

//下载文件流
export function DownloadBlob(
  blobData: any,
  contentType: string,
  fileName: string
) {
  const blob = new Blob([blobData], {
    type: contentType,
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.download = fileName;
  a.href = blobUrl;
  a.click();
  document.body.removeChild(a);
}

export function useConfirmDelete(
  title: string,
  comtext: string = "温馨提示",
  confirm: string = "确定",
  cancel: string = "取消"
) {
  return ElMessageBox.confirm(title, comtext, {
    confirmButtonText: confirm,
    cancelButtonText: cancel,
    type: "warning",
  })
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "您已取消",
      });
    });
}
export function getNowTime(val: number = 1) {
  let yy = new Date().getFullYear();
  let mm = new Date().getMonth() + 1;
  let dd = new Date().getDate();
  let hh = new Date().getHours();
  let mf =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  let ss =
    new Date().getSeconds() < 10
      ? "0" + new Date().getSeconds()
      : new Date().getSeconds();
  if (val === 1) {
    return yy + "年" + mm + "月" + dd + "日" + " " + hh + ":" + mf + ":" + ss;
  } else if (val === 2) {
    return yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
  }
}

//对象赋值
export function assignment(
  obj: { [x: string]: any },
  item: { [x: string]: any }
) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = item[key];
    }
  }
}

//对象转换为url参数

export function getUrlParamsStr(params: any) {
  let paramStr = "";
  Object.keys(params).forEach((item) => {
    if (
      params[item] === undefined ||
      params[item] === null ||
      params[item] === ""
    ) {
      return;
    }
    if (paramStr === "") {
      paramStr = `${item}=${params[item]}`;
    } else {
      paramStr = `${paramStr}&${item}=${params[item]}`;
    }
  });

  return paramStr;
}
