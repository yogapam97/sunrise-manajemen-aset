import type { IAuditPayload } from "src/types/audit";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createAudit, getAllAudits } from "src/api/audit-api";

export const useGetAllAudits = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string; filter: any }
) => {
  const { search, limit, page, sort, filter } = options;
  return useQuery({
    queryKey: ["audits", search, limit, page, sort, filter],
    queryFn: () => getAllAudits(workspaceId, { search, limit, page, sort, filter }),
  });
};

export const useCreateAudit = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((audit: IAuditPayload) => createAudit(audit), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["audits"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};
