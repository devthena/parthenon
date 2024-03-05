import { Pages } from '../../constants/enums';
import { HeaderProps } from '../../constants/types';
import styles from './index.module.scss';

const Header = ({ page, setPage }: HeaderProps) => {
  return (
    <header>
      <button
        className={styles.nav}
        disabled={page === Pages.Landing}
        onClick={() => setPage(Pages.Landing)}>
        Home
      </button>
      <button
        className={styles.nav}
        disabled={page === Pages.Projects}
        onClick={() => setPage(Pages.Projects)}>
        Projects
      </button>
    </header>
  );
};

export default Header;
