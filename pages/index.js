import Calendar from '../components/Calendar'
import styles from '/styles/pages/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
        <Calendar />
    </div>
  )
}
