declare module 'remote/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'remote/Analytics' {
  const Analytics: React.ComponentType;
  export default Analytics;
}

declare module 'remote/Reports' {
  const Reports: React.ComponentType;
  export default Reports;
}

// Shared remote module declarations
declare module 'shared/Auth' {
  export const msalInstance: any;
  export const LoginScreen: React.ComponentType;
  export const tokenRequest: any;
  export const msalConfig: any;
  export const loginRequest: any;
  export const authService: any;
  export const initializeMsal: () => void;
}

declare module 'shared/theme' {
  const theme: any;
  export default theme;
  export const fontTokens: any;
  export const fontWeights: any;
  export const brandColors: any;
}

declare module 'shared/API' {
  export const createApiClient: any;
  export const apiClient: any;
  export const setUserAdGroupIds: any;
  export const getUserAdGroupIds: any;
  export const queryClient: any;
  export const createMockApi: any;
  export const createMockPaginatedApi: any;
}

declare module 'shared/Header' {
  const Header: React.ComponentType<any>;
  export default Header;
}

declare module 'shared/SideNav' {
  const SideNav: React.ComponentType<any>;
  export default SideNav;
}

declare module 'shared/MUI' {
  export * from '@mui/material';
}

declare module 'shared/AgGrid' {
  export * from 'ag-grid-react';
}

declare module 'shared/DataTable' {
  const DataTable: React.ComponentType<any>;
  export default DataTable;
}

declare module 'shared/AppState' {
  export const useAppState: any;
  export const AppStateProvider: React.ComponentType<any>;
}
