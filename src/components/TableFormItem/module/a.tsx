import { TableFormA } from '../index.d'
import styles from '../index.module.scss'


export default (props: TableFormA) => <div onClick={props.onClick} style={props.style} className={styles.tabs_item} key={props.text}>
  {props.text}
</div>