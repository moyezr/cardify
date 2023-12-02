"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteCard } from "./schema";
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
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
    });

    await createAuditLog({
      action: ACTION.DELETE,
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD
    })
  } catch (error) {
    return {
      error: "Failed to Delete card.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
