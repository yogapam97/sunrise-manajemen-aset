export const isColumnVisible = (configColumns: any[], columnId: string) => {
  const columnConfig = configColumns.find((col) => col.id === columnId);
  return columnConfig ? columnConfig.show : false;
};
