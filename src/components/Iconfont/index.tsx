
import { JSXInternal } from 'preact/src/jsx'
import styles from './iconfont.module.css'

// 图标地址 //at.alicdn.com/t/font_2886047_ax4rim1dlbo.css

export type IconfontNames = 'icon-shoucang' | 'icon-liebiaorongqi' | 'icon-a-ziyuan54' | 'icon-quanping' | 'icon-car' | 'icon-Three' | 'icon-Second' | 'icon-asset1' | 'icon-HIVE' | 'icon-a-APACHEFLINK' | 'icon-de-weight' | 'icon-SQL' | 'icon-grouping' | 'icon-js' | 'icon-shousuo' | 'icon-lajitong' | 'icon-jian' | 'icon-jia' | 'icon-enlarge' | 'icon-lessen' | 'icon-proportion-copy' | 'icon-year' | 'icon-trend' | 'icon-chain' | 'icon-a-complementnumber_disabled' | 'icon-group_disabled' | 'icon-sort' | 'icon-dynamic_text' | 'icon-static_text' | 'icon-issue' | 'icon-save' | 'icon-preview' | 'icon-upload' | 'icon-share' | 'icon-download' | 'icon-lock' | 'icon-unlock' | 'icon-a-dataorigin' | 'icon-numberthree' | 'icon-numbertwo' | 'icon-numberone' | 'icon-a-dataassets' | 'icon-datacard' | 'icon-a-datatemplate' | 'icon-a-indexcard' | 'icon-a-dataexploit' | 'icon-a-dataanalysis' | 'icon-a-indexcard1' | 'icon-a-toolmarket' | 'icon-drafts' | 'icon-task' | 'icon-enable' | 'icon-install' | 'icon-help' | 'icon-card' | 'icon-RDS' | 'icon-HTTP' | 'icon-output_DDM' | 'icon-output_HTTP' | 'icon-output_RDS' | 'icon-parameter' | 'icon-constant' | 'icon-derive' | 'icon-business' | 'icon-atom' | 'icon-minus' | 'icon-divide' | 'icon-multiply' | 'icon-plus' | 'icon-MAX' | 'icon-SUM' | 'icon-average' | 'icon-count' | 'icon-a-Neutralposition' | 'icon-Min' | 'icon-MJ' | 'icon-SU' | 'icon-select' | 'icon-intersection' | 'icon-filter' | 'icon-online-help' | 'icon-invite' | 'icon-version' | 'icon-index' | 'icon-decline' | 'icon-rise' | 'icon-participant' | 'icon-mutual';
export const iconfontNameArr: IconfontNames[] = ['icon-shoucang', 'icon-liebiaorongqi', 'icon-a-ziyuan54', 'icon-quanping', 'icon-car', 'icon-Three', 'icon-Second', 'icon-asset1', 'icon-HIVE', 'icon-a-APACHEFLINK', 'icon-de-weight', 'icon-SQL', 'icon-grouping', 'icon-js', 'icon-shousuo', 'icon-lajitong', 'icon-jian', 'icon-jia', 'icon-enlarge', 'icon-lessen', 'icon-proportion-copy', 'icon-year', 'icon-trend', 'icon-chain', 'icon-a-complementnumber_disabled', 'icon-group_disabled', 'icon-sort', 'icon-dynamic_text', 'icon-static_text', 'icon-issue', 'icon-save', 'icon-preview', 'icon-upload', 'icon-share', 'icon-download', 'icon-lock', 'icon-unlock', 'icon-a-dataorigin', 'icon-numberthree', 'icon-numbertwo', 'icon-numberone', 'icon-a-dataassets', 'icon-datacard', 'icon-a-datatemplate', 'icon-a-indexcard', 'icon-a-dataexploit', 'icon-a-dataanalysis', 'icon-a-indexcard1', 'icon-a-toolmarket', 'icon-drafts', 'icon-task', 'icon-enable', 'icon-install', 'icon-help', 'icon-card', 'icon-RDS', 'icon-HTTP', 'icon-output_DDM', 'icon-output_HTTP', 'icon-output_RDS', 'icon-parameter', 'icon-constant', 'icon-derive', 'icon-business', 'icon-atom', 'icon-minus', 'icon-divide', 'icon-multiply', 'icon-plus', 'icon-MAX', 'icon-SUM', 'icon-average', 'icon-count', 'icon-a-Neutralposition', 'icon-Min', 'icon-MJ', 'icon-SU', 'icon-select', 'icon-intersection', 'icon-filter', 'icon-online-help', 'icon-invite', 'icon-version', 'icon-index', 'icon-decline', 'icon-rise', 'icon-participant', 'icon-mutual'];
type Porps = {
  name: IconfontNames;
  className?: string;
  'class-name'?: string;
} & JSXInternal.HTMLAttributes<HTMLDivElement>
export default ({name, className = '', ...props}: Porps) => (
  <div {...props} className={`${styles.iconfont} ${styles[name]} ${className} ${props['class-name'] || ''}`}></div>
)