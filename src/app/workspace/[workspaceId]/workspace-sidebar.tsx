import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareTextIcon,
  SendHorizonalIcon
} from "lucide-react";

import { UserItem } from "./user-item";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";


export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [, setOpen] = useCreateChannelModal();

  const {
    data: member,
    isLoading: memberLoading
  } = useCurrentMember({ workspaceId });

  const {
    data: workspace,
    isLoading: workspaceLoading
  } = useGetWorkspace({ id: workspaceId });

  const {
    data: channels,
    // isLoading: channelsLoading
  } = UseGetChannels({ workspaceId });

  const {
    data: members,
    // isLoading: membersLoading
  } = useGetMembers({ workspaceId });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 justify-center items-center h-full bg-[#5E2C5F]">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">
          Workspace not found
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />

      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareTextIcon}
          id="threads"
        />

        <SidebarItem
          label="Draft & sent"
          icon={SendHorizonalIcon}
          id="drafts"
        />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((singleChannelItem) => (
          <SidebarItem
            key={singleChannelItem._id}
            label={singleChannelItem.name}
            icon={HashIcon}
            id={singleChannelItem._id}
            variant={channelId === singleChannelItem._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct messages"
        hint="New Direct messages"
        onNew={() => { }}
      >
        {members?.map((singleMember) => (
          <UserItem
            key={singleMember._id}
            id={singleMember._id}
            label={singleMember.user.name}
            image={singleMember.user.image}
            variant={singleMember._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
};