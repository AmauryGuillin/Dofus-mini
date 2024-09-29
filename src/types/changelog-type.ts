export type ChangelogType = {
  version: string;
  date: string;
  features: string[] | null;
  bugs: string[] | null;
  balancing: string[] | null;
};
