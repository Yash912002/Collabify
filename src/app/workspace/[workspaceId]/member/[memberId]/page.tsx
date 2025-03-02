"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

export default function MemberIdPage() {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    }, {
      onSuccess: (data) => {
        setConversationId(data);
        console.log({ data });
      },
      onError: () => {
        toast.error("Failed to create or get conversations")
      }
    })
  }, [memberId, mutate, workspaceId])

  if (isPending) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 flex-1 items-center justify-center gap-2">
        <AlertTriangleIcon className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    )
  }


  return (
    <Conversation id={conversationId} />
  );
};
