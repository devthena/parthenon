import { Pages } from './enums';

export type HeaderProps = {
  page: Pages;
  setPage: Function;
};

export type LandingProps = {
  setPage: Function;
};

export type ProjectItemObject = {
  title: string;
  description: string;
  type: string;
  repository: string;
  tech: Array<string>;
  demo?: string;
};

export type ProjectItemProps = {
  item: ProjectItemObject;
};
