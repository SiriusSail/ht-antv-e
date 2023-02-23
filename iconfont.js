/* eslint-disable no-underscore-dangle */
const _ = require("lodash");
// const utl = require('./utl/utl')
const path = require("path");
const fs = require("fs");
const request = require("request");
const wget = require("wget");
const args = require("minimist")(process.argv.slice(2));

console.log(args._[0]);

// const icon = [
//   {
//     // 自动维护图标
//     aliUrl: "//at.alicdn.com/t/font_2886047_sfhgddab88c.css", // 暂时只支持使用阿里巴巴图标库
//     dir: "src/components/Iconfont", // 公共图标
//   },
// ];
const defaultDir = "src/components/Iconfont";

const exTsx = (type) => `
import { JSXInternal } from 'preact/src/jsx'
import styles from './iconfont.module.css'

// 图标地址 ${args._[0]}

export type IconfontNames = ${type.join(" | ")};
export const iconfontNameArr: IconfontNames[] = [${type.join(", ")}];
type Porps = {
  name: IconfontNames;
  className?: string;
  'class-name'?: string;
} & JSXInternal.HTMLAttributes<HTMLDivElement>
export default ({name, className = '', ...props}: Porps) => (
  <div {...props} className={\`\${styles.iconfont} \${styles[name]} \${className} \${props['class-name'] || ''}\`}></div>
)`;

const postUrl = (_url, fn) => {
  request(_url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      fn(body);
    } else {
      throw new Error("gen Icon error");
    }
  });
};

const downIcon = (iconUrl, dir) => {
  postUrl(`https:${iconUrl}`, (_chunk) => {
    let chunk = _chunk;
    let form = 0;
    let to = form;
    let urlList = [];
    let count = 0;
    while (form !== -1 && to !== -1) {
      count++;
      if (count > 3000) throw new Error("gen icon failed");
      form = to + 1;
      form = chunk.indexOf("url(", form);
      to = chunk.indexOf(")", form + 1);
      if (form !== -1 && to !== -1) {
        urlList.push(chunk.substr(form + 5, to - form - 6));
      }
    }
    urlList = _.uniq(urlList.map((_url) => _url.split("#")[0]));
    count = urlList.length;
    urlList.forEach((_url) => {
      const __url = _url.split("?")[0];
      const { ext } = path.parse(__url);
      const fileName = `iconfont${ext}`;
      const filePath = path.join(dir, fileName);
      fs.existsSync(filePath) && fs.unlinkSync(filePath);
      if (__url[0] !== "/") return;
      const download = wget.download(`https:${__url}`, filePath, {});
      chunk.split(_url).join("");
      download.on("error", (err) => {
        throw err;
      });
    });
    urlList.forEach((_url) => {
      const strs = _url.split("?")[0].split(".");
      const type = strs[strs.length - 1];
      if (_url[0] !== "/") return;
      chunk = chunk.replace(_url, `./iconfont.${type}`);
      chunk = chunk.replace(_url, `./iconfont.${type}`);
    });
    const iconfontTypeName = chunk
      .match(/\..*:/g)
      .map((item) => `'${item.substring(1, item.length - 1)}'`);
    fs.writeFileSync(path.join(dir, "index.tsx"), exTsx(iconfontTypeName));
    fs.writeFileSync(path.join(dir, "iconfont.module.css"), chunk);
  });
};

// icon.forEach((item) => downIcon(item.aliUrl, path.resolve(item.dir)));
downIcon(args._[0], path.resolve(args._[1] || defaultDir));
