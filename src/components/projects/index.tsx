import { ProjectData } from '../../constants/data';

import styles from './index.module.scss';

const Projects = () => {
  return (
    <div className={styles.container}>
      <h1>Projects</h1>
      {ProjectData.length > 0 &&
        ProjectData.map(project => <div>{project.title}</div>)}
    </div>
  );
};

export default Projects;
