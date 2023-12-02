"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id, boardId } = data;
  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId: orgId
        }
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST
    })
  } catch (error) {
    return {
      error: "Failed to Update List Title",
    };
  }

  revalidatePath(`/board/${id}`);
  return {
    data: list,
  };
};

export const updateList = createSafeAction(UpdateList, handler);
