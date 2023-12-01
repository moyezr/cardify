"use client";

import { Card } from "@prisma/client";

interface CardItemProps {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <li role="button" className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm transition duration-100">
      {data.title}
    </li>
  );
};

export default CardItem;
