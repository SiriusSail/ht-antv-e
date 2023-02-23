

import styles from '../index.module.scss'

export default (props: { content: preact.JSX.Element[] }) => <div className={styles.tabs_content}>
	{props.content}
</div>