import clientApi from "../../store/cleintApi";
import type { CompanyFromBackend } from "./slice";
import type { Company } from "./types";

export const fetchAll = (): Promise<CompanyFromBackend[]> => {
  return clientApi.get("/companies");
};

export const create = (
  companyData: Company
): Promise<CompanyFromBackend> => {
  return clientApi.post("/companies", companyData);
};

export const update = (
  id: string,
  data: Partial<CompanyFromBackend>
): Promise<CompanyFromBackend> => {
  return clientApi.put(`/companies/${id}`, data);
};

export const deleteComp = (id: string): Promise<void> => {
  return clientApi.delete(`/companies/${id}`);
};

