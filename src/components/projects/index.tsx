import { ProjectData } from '../../constants/data';
import ProjectItem from '../project-item';

import styles from './index.module.scss';

const Projects = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Projects</h1>
      <p className={styles.description}>
        The following are personal projects that I have worked on for the past
        few years.
      </p>
      <p className={`${styles.description} ${styles.secondary}`}>
        Some of these are deployed locally using Raspberry Pi, and others using
        AWS Lightsail and Vercel.
      </p>
      <div className={styles.projects}>
        {ProjectData.length > 0 &&
          ProjectData.map(project => <ProjectItem item={project} />)}
      </div>
    </div>
  );
};

export default Projects;
