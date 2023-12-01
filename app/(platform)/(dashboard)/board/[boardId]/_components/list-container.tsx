"use client";

import { ListWithCards } from "@/types";
import {
  DragDropContext,
  DropResult,
  Droppable,
  OnDragEndResponder,
  OnDragUpdateResponder,
} from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import ListForm from "./list-form";
import ListItem from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId == source.droppableId &&
      destination.index == source.index
    ) {
      return;
    }

    // User moves a list
    if (type == "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
      return;
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destinationList
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving cards in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards,
        });

        // User moves the card to another list
      } else {
        // First: remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        //Second: Assign to new listId to the moved card;
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        // Changing the order of the cards in the source list locally
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list locally
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          boardId: boardId,
          items: destinationList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            className="flex gap-x-3 h-full"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-2" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
