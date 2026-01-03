export type MenuState = "gateway" | "info" | "accounts" | "ledgers";

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  onClick?: () => void;
  shortcutKey?: string;
}

export const menuTitles: Record<MenuState, string> = {
  gateway: "Gateway of Tally",
  info: "Company info",
  accounts: "Accounts Info",
  ledgers: "Ledgers",
};

export const createMenuItems = (
  selectedCompany: any,
  handleMenuAction: (action: MenuState | (() => void)) => void,
  handleShutCompany: () => void,
  handleAlterCompany: () => void
): Record<MenuState, MenuItem[]> => ({
  gateway: !selectedCompany
    ? [
        {
          id: "select-company",
          label: "Select Company",
          path: "/select-company",
        },
        { id: "login", label: "Login as Remote User", path: "/login" },
        {
          id: "create-company",
          label: "Create Company",
          path: "/create-company",
        },
        { id: "backup", label: "Backup", shortcutKey: "B" },
        { id: "restore", label: "Restore", shortcutKey: "R" },
        { id: "quit", label: "Quit", shortcutKey: "Q" },
      ]
    : [
        {
          id: "accounts-info",
          label: "Accounts info",
          onClick: () => handleMenuAction("accounts"),
        },
        {
          id: "inventory-info",
          label: "Inventory info",
          path: "/inventory/inventory-info",
        },
        {
          id: "accounting-vouchers",
          label: "Accounting vouchers",
          path: "/accounts/vouchers",
        },
        {
          id: "inventory-vouchers",
          label: "Inventory vouchers",
          path: "/inventory/inventory-vouchers",
        },
      ],
  info: [
    { id: "select-company", label: "Select Company", path: "/select-company" },
    { id: "shut-company", label: "Shut company", onClick: handleShutCompany },
    { id: "create-company", label: "Create Company", path: "/create-company" },
    { id: "alter", label: "Alter", onClick: handleAlterCompany },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("gateway") },
  ],
  accounts: [
    { id: "groups", label: "Groups", path: "" },
    {
      id: "ledger",
      label: "Ledger",
      onClick: () => handleMenuAction("ledgers"),
    },
    { id: "voucher-types", label: "Voucher Types", path: "" },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("gateway") },
  ],
  ledgers: [
    { id: "create", label: "Create", path: "/accounts/new-ledger" },
    { id: "display", label: "Display", path: "/accounts/ledgers" },
    { id: "alter", label: "Alter", path: "/accounts/new-ledger" },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("accounts") },
  ],
});
