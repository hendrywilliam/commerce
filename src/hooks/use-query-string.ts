/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

export function useQueryString() {
  // This will return readonly URLSearchParams object.
  const searchParams = useSearchParams();
  // new URLSearchParams accept a record of key and value string
  const params = new URLSearchParams(searchParams.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value);

      return params.toString();
    },
    [searchParams, params],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      params.delete(name);
      return params.toString();
    },
    [searchParams, params],
  );

  return {
    createQueryString,
    deleteQueryString,
  };
}
