"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
// import { createAuditLog } from "@/lib/create-audit-log";
// import { ACTION, ENTITY_TYPE } from "@prisma/client";
// import { decreaseAvailableCount } from "@/lib/org-limit";
// import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  //   const isPro = await checkSubscription();

  const { id, boardId } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
      },
    });

    // if (!isPro) {
    //   await decreaseAvailableCount();
    // }

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    })
  } catch (error) {
    return {
      error: "Failed to delete list.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const deleteList = createSafeAction(DeleteList, handler);
