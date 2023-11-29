import { OrganizationSwitcher, auth } from '@clerk/nextjs';
import React from 'react'

type Props = {}

const OrganizationIdPage = (props: Props) => {

    const { userId, orgId } = auth();


  return (
    <div>
        
    </div>
  )
}

export default OrganizationIdPage