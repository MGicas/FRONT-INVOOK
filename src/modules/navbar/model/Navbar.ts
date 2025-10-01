export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
}