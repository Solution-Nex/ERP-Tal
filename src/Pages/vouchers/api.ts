import clientApi from "../../store/cleintApi";
import type { VoucherTypeFormData, VoucherTypeFromBackend } from "./voucherTypes";

export const fetchByCompanyId = (
  companyId: string
): Promise<VoucherTypeFromBackend[]> => {
  return clientApi.get(`/companies/${companyId}/voucher-types`);
};

export const fetchAll = (): Promise<VoucherTypeFromBackend[]> => {
  return clientApi.get("/voucher-types");
};

export const create = (
  voucherTypeData: VoucherTypeFormData
): Promise<VoucherTypeFromBackend> => {
  return clientApi.post("/voucher-types", voucherTypeData);
};

export const update = (
  id: string,
  data: Partial<VoucherTypeFormData>
): Promise<VoucherTypeFromBackend> => {
  return clientApi.put(`/voucher-types/${id}`, data);
};

export const deleteVoucherType = (id: string): Promise<void> => {
  return clientApi.delete(`/voucher-types/${id}`);
};
