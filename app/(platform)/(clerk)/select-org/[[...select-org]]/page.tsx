import React from "react";
import { OrganizationList } from "@clerk/nextjs";

type Props = {};

const CreateOrganizationPage = (props: Props) => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl={"/organization/:id"}
      afterCreateOrganizationUrl={"/organization/:id"}
    />
  );
};

export default CreateOrganizationPage;
