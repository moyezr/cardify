"use client";

import { toast } from "sonner";
import { Loader2, MoreHorizontal, X } from "lucide-react";

import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BoardOptionsProps {
  id: string;
}

const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-2 sm:p-3 flex flex-col gap-6"
        side="bottom"
        align="start"
      >
        <div className="flex justify-between text-sm font-medium text-center text-neutral-600">
          <span className="">Board actions</span>
          <PopoverClose asChild>
            <Button
              className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
        </div>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-none flex items-center gap-4 w-full h-auto p-2 justify-start font-normal text-sm text-rose-500 hover:text-rose-500 hover:bg-rose-100"
        >
          Delete Board{" "}
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
