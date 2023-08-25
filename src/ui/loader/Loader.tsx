import styles from './Loader.module.css'

export default function Loader() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.loader}>
				<svg width='50' height='50' viewBox='0 0 50 50'>
					<circle
						className={styles.circle}
						cx='25'
						cy='25'
						r='20'
						fill='none'
						strokeWidth='5'
					/>
				</svg>
			</div>
		</div>
	)
}
