import * as Element from 'element-plus'
import classnames from 'classnames'
import { TableFormA } from '../index.d'
import styles from '../index.module.scss'

const { ElButton} = Element;


export default ({ className, text, ...arg}: TableFormA) => <ElButton
  {...arg}
  className={classnames(styles.tabs_item, className)}
  key={text}>
  {text}
</ElButton>