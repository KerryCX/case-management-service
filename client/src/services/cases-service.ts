import type {
  Case,
  CreateCaseInput,
  StatusFilter,
  UpdateCaseInput,
} from "../types/case";

/* All error handling lives here: every function below turns a failed
response into a thrown Error with a clean, readable message. Components
never need to know the shape of the API's error JSON, they just try/catch
and show err.message. */

interface ApiErrorBody {
  message?: string;
}

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const throwIfNotOk = async (response: Response): Promise<void> => {
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
};

export const fetchCases = async (filter: StatusFilter): Promise<Case[]> => {
  const query = filter === "all" ? "" : `?status=${filter}`;
  const response = await fetch(`/cases${query}`);
  await throwIfNotOk(response);
  return (await response.json()) as Case[];
};

export const createCase = async (input: CreateCaseInput): Promise<Case> => {
  const response = await fetch("/cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(response);
  return (await response.json()) as Case;
};

export const updateCase = async (
  id: string,
  input: UpdateCaseInput,
): Promise<Case> => {
  const response = await fetch(`/cases/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(response);
  return (await response.json()) as Case;
};

export const deleteCase = async (id: string): Promise<void> => {
  const response = await fetch(`/cases/${id}`, { method: "DELETE" });
  await throwIfNotOk(response);
};
