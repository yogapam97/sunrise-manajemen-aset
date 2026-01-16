import type { AxiosProgressEvent } from "axios";

import { useMutation } from "@tanstack/react-query";

import { uploadFile } from "src/api/file-api";

export const useUploadFile = (
  options: { onSuccess(response: any): void },
  onProgress: (percentCompleted: number) => void
) =>
  useMutation(
    (file: File) =>
      uploadFile(file, (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? 1; // Use 1 as a fallback to avoid division by zero
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        onProgress(percentCompleted);
      }),
    {
      ...options,
    }
  );
