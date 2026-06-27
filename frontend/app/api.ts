import type { PipelineStepType } from "./pipeline/PipelineStepType";

export const apiUrl = import.meta.env.VITE_API_URL;
export async function getData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return null;
  }
}
export async function postData<T>(
  url: string,
  req: Record<string, any>,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return null;
  }
}
export async function deleteData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return null;
  }
}
export type PipelineResponseType = PipelineStepType[];
export async function getPipeline(
  datasetId: string,
): Promise<PipelineResponseType | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
  });

  const prefix = `/pipeline?${param.toString()}`;

  return await getData<PipelineResponseType>(apiUrl + prefix);
}
export async function deleteStepPipeline(
  datasetId: string,
  stepIndex: number,
): Promise<{ steps: number } | null> {
  const params = new URLSearchParams({
    dataset_id: datasetId,
  });

  const prefix = `/pipeline/${stepIndex}?${params.toString()}`;

  return await deleteData(apiUrl + prefix);
}
