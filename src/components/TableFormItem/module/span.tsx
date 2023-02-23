import classnames from 'classnames'
import { TableFormText } from '../index.d'
import styles from '../index.module.scss'


export default ({text, className, ...props}: TableFormText) =>
  <div
    {...props}
    className={classnames(className, styles.text)}
  >
    {text}
  </div>