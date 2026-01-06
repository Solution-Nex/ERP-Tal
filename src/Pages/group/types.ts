export interface Group {
  id?: string;
  name: string;
  alias?: string;
  under: string;
  behavesLikeSubLedger: "Yes" | "No";
  nettDebitCredit: "Yes" | "No";
  usedForCalculation: "Yes" | "No";
  allocationMethod: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupFromBackend extends Group {
  id: string;
  createdAt: string;
  updatedAt: string;
}
