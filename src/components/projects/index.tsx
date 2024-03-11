import { ProjectData } from '../../constants/data';
import ProjectItem from '../project-item';

import styles from './index.module.scss';

const Projects = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Projects</h1>
      <div className={styles.projects}>
        {ProjectData.length > 0 &&
          ProjectData.map(project => <ProjectItem item={project} />)}
      </div>
    </div>
  );
};

export default Projects;
