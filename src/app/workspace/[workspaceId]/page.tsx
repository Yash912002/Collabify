"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";

import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

export default function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();

  const {
    data: workspace,
    isLoading: workspaceLoading
  } = useGetWorkspace({ id: workspaceId });

  const {
    data: member,
    isLoading: memberLoading
  } = useCurrentMember({ workspaceId });

  const {
    data: channels,
    isLoading: channelsLoading
  } = UseGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    ) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }

  }, [
    channelId,
    channelsLoading,
    workspace,
    workspaceId,
    workspaceLoading,
    member,
    memberLoading,
    open,
    setOpen,
    router,
    isAdmin
  ])

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlertIcon className="size-5 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          Workspace Not Found
        </span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlertIcon className="size-5 text-muted-foreground" />
      <span className="text-muted-foreground text-sm">
        No Channel Found
      </span>
    </div>
  )
};