import { useState } from "react";
import { LoginMethod } from "../lib/enums";
import { IUser } from "../lib/interfaces";

export const useApi = () => {
  const [data, setData] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchUser = async (id: string, method: LoginMethod) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, method }),
      });

      const response = await res.json();

      if (response.error) {
        setApiError("useApi Error:" + response.error);
      } else {
        setData(response.data);
      }

      setIsLoading(false);
    } catch (fetchError) {
      setApiError(JSON.stringify(fetchError));
      setIsLoading(false);
    }
  };

  return { data, isLoading, apiError, fetchUser };
};
