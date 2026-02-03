 export type MenuState = "gateway" | "info" | "accounts"  | "ledgers" | "vouchertype" | "groups";

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  onClick?: () => void;
  shortcutKey?: string;
  section?: string;
  highlightChar?: number;
  state?: Record<string, any>;
}

export const menuTitles: Record<MenuState, string> = {
  gateway: "Gateway of Tally",
  info: "Company info",
  accounts: "Accounts Info",
  ledgers: "Ledgers",
  groups: "Groups",
  vouchertype: "Voucher Types",
};

export const createMenuItems = (
  selectedCompany: any,
  handleMenuAction: (action: MenuState | (() => void)) => void,
  handleShutCompany: () => void,
  handleAlterCompany: () => void,
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
    {
      id: "groups",
      label: "Groups",
      path: "",
      onClick: () => handleMenuAction("groups"),
    },
    {
      id: "ledger",
      label: "Ledger",
      onClick: () => handleMenuAction("ledgers"),
    },
    {
      id: "voucher-types",
      label: "Voucher Types",
      onClick: () => handleMenuAction("vouchertype"),
    },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("gateway") },
  ],
  ledgers: [
    {
      id: "create",
      label: "Create",
      path: "/accounts/new-ledger",
      state: { mode: "create" },
    },
    {
      id: "display",
      label: "Display",
      path: "/accounts/ledgers",
      state: { mode: "display" },
    },
    {
      id: "alter",
      label: "Alter",
      path: "/accounts/ledgers",
      state: { mode: "alter" },
    },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("accounts") },
  ],
  vouchertype: [
    {
      id: "create",
      label: "Create",
      path: "/voucher-creation",
      state: { mode: "create" },
    },
    {
      id: "display",
      label: "Display",
      path: "/select-voucher-type",
      state: { mode: "display" },
    },
    {
      id: "alter",
      label: "Alter",
      path: "/select-voucher-type",
      state: { mode: "alter" },
    },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("accounts") },
  ],
  groups: [
    // Single Group
    {
      id: "sg-create",
      label: "Create",
      path: "/create-single-group",
      section: "Single Group",
      highlightChar: 0,
      state: { mode: "create" },
    },
    {
      id: "sg-display",
      label: "Display",
      path: "/select-group",
      section: "Single Group",
      highlightChar: 0,
      state: { mode: "display" },
    },
    {
      id: "sg-alter",
      label: "Alter",
      path: "/select-group",
      section: "Single Group",
      highlightChar: 0,
      state: { mode: "alter" },
    },
    // Multiple Groups
    {
      id: "mg-create",
      label: "Create",
      path: "/create-multiple-groups",
      section: "Multiple Groups",
      highlightChar: 0,
      state: { mode: "create-multiple" },
    },
    {
      id: "mg-display",
      label: "Display",
      path: "/select-group",
      section: "Multiple Groups",
      highlightChar: 1,
      state: { mode: "display-multiple" },
    },
    {
      id: "mg-alter",
      label: "Alter",
      path: "/select-group",
      section: "Multiple Groups",
      highlightChar: 2,
      state: { mode: "alter-multiple" },
    },
    { id: "quit", label: "Quit", onClick: () => handleMenuAction("accounts") },
  ],
});
