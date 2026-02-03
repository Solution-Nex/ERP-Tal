import clientApi from "../../store/cleintApi";
import type { FormDataType, LedgerFromBackend } from "./Types";

// export const fetchAll = (): Promise<LedgerFromBackend[]> => {
//   return clientApi.get("/ledgers");
// };

export const fetchByCompanyId = (companyId: string): Promise<LedgerFromBackend[]> => {
  return clientApi.get(`/companies/${companyId}/ledgers`);
}

export const create = (ledgerData: FormDataType): Promise<LedgerFromBackend> => {
  return clientApi.post("/ledgers", ledgerData);
};

export const update = (
  id: string,
  data: Partial<FormDataType>,
): Promise<LedgerFromBackend> => {
  return clientApi.put(`/ledgers/${id}`, data);
};
