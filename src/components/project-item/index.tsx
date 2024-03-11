import { ProjectItemProps } from '../../constants/types';
import styles from './index.module.scss';

const ProjectItem = ({ item }: ProjectItemProps) => {
  return (
    <div className={styles.item}>
      <h2>
        {item.title}
        <sup className={styles.type}>{item.type}</sup>
      </h2>
      <p>{item.description}</p>
      <p className={styles.repository}>
        Github:{' '}
        <a href={item.repository} target="_blank" rel="noreferrer">
          {item.repository}
        </a>
      </p>
      <p>
        {item.tech.map(el => (
          <button className={styles.techItem}>{el}</button>
        ))}
      </p>
    </div>
  );
};

export default ProjectItem;
