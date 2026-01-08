import clientApi from "../../store/cleintApi";
import type { Group, GroupFromBackend } from "./types";

export const fetchAll = (): Promise<GroupFromBackend[]> => {
  return clientApi.get("/groups");
};

export const fetchByCompanyId = (companyId: string): Promise<GroupFromBackend[]> => {
  return clientApi.get(`/companies/${companyId}/groups`);
};

export const create = (groupData: Group): Promise<GroupFromBackend> => {
  return clientApi.post("/groups", groupData);
};

export const createMultiple = (groupsData: Group[]): Promise<GroupFromBackend[]> => {
  return clientApi.post("/groups/batch", { groups: groupsData });
};

export const update = (
  id: string,
  data: Partial<Group>
): Promise<GroupFromBackend> => {
  return clientApi.put(`/groups/${id}`, data);
};

export const updateMultiple = (
  groupsData: GroupFromBackend[]
): Promise<GroupFromBackend[]> => {
  return clientApi.put("/groups/batch", { groups: groupsData });
};

export const deleteGroup = (id: string): Promise<void> => {
  return clientApi.delete(`/groups/${id}`);
};

export const deleteMultiple = (ids: string[]): Promise<void> => {
  return clientApi.delete("/groups/batch", { data: { ids } });
};
