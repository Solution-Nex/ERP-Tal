export interface Group {
  id?: string | number;
  name: string;
  alias?: string;
  under: string;
  behavesLikeSubLedger: "Yes" | "No";
  netDebitCredit: "Yes" | "No";
  usedForCalculation: "Yes" | "No";
  allocationMethod: string;
  companyId?: string;
  // createdAt?: string;
  // updatedAt?: string;
}

export interface GroupFromBackend extends Group {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
