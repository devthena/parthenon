import { useState } from 'react';
import { Footer, Landing, Projects } from './components';
import { Pages } from './constants/enums';

import styles from './app.module.scss';

const App = () => {
  const [page, setPage] = useState<Pages>(Pages.Landing);

  return (
    <main className={styles.app}>
      {page === Pages.Landing && <Landing setPage={setPage} />}
      {page === Pages.Projects && <Projects />}
      <Footer />
    </main>
  );
};

export default App;
