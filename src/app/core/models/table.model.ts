export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
}
