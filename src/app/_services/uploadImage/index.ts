"use server";

import { makeRequest } from "..";

type Props = {
  formData: FormData;
};

export const uploadImage = async ({ formData }: Props): Promise<any> => {
  return makeRequest(
    "/api/v1/articles/upload_image/",
    {
      method: "POST",
      body: formData,
    },
    true
  );
};
