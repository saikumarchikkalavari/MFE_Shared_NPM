// Mock data for /pageConfig API
export const mockPageConfig = {
  showPause: true,
  showBatchDatePicker: true,
  showLastRefreshedDate: true,
  tabs: [
    {
      label: "Loans",
      table: "TableName",
      showSummaryDetailedView: true,
      showTenorDropdown: ["T+0", "T+1", "T+7", "T+30"],
      showViewByOptions: [
        {
          label: "Percentage",
          value: 100,
        },
        {
          label: "Basis Points (BPS)",
          value: 0.1,
        },
        {
          label: "Decimal (0.00001)",
          value: 0.00001,
        },
      ],
    },
    {
      label: "Deposits",
      table: "tableName",
      showSummaryDetailedView: true,
      showTenorDropdown: ["T+0", "T+1", "T+7", "T+30"],
      showViewByOptions: [
        {
          label: "Percentage",
          value: 100,
        },
        {
          label: "Basis Points (BPS)",
          value: 0.1,
        },
        {
          label: "Decimal (0.00001)",
          value: 0.00001,
        },
      ],
    },
    {
      label: "Commitment Lines",
      table: "tableName",
      showSummaryDetailedView: true,
      showTenorDropdown: ["T+0", "T+1", "T+7", "T+30"],
      showViewByOptions: [
        {
          label: "Percentage",
          value: 100,
        },
        {
          label: "Basis Points (BPS)",
          value: 0.1,
        },
        {
          label: "Decimal (0.00001)",
          value: 0.00001,
        },
      ],
    },
    {
      label: "Spot Utilization",
      table: "tableName",
    },
  ],
};
