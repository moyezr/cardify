import { OrganizationSwitcher, auth } from '@clerk/nextjs';
import React, { Suspense } from 'react'
import Info from './_components/info';
import { Separator } from '@/components/ui/separator';
import BoardList from './_components/board-list';

type Props = {}

const OrganizationIdPage = (props: Props) => {

    const { userId, orgId } = auth();


  return (
    <div className="w-full mb-20">
    <Info isPro={false} />
    <Separator className="my-4" />
    <div className="px-2 md:px-4">
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  </div>
  )
}

export default OrganizationIdPage