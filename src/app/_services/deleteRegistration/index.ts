"use server";

import { makeRequest } from "..";

type Props = {
  registration_id: string;
};

export const deleteRegistration = ({
  registration_id,
}: Props): Promise<void> => {
  return makeRequest(
    `/api/v1/academics/registrations/${registration_id}/`,
    {
      method: "DELETE",
    },
    true
  );
};
