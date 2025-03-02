"use client";

import { UseGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlertIcon } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { UseGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

export default function ChannelIdPage() {

  const channelId = useChannelId();

  const { results, status, loadMore } = UseGetMessages({ channelId });

  console.log({ results });

  const {
    data: channel,
    isLoading: isChannelLoading
  } = UseGetChannel({ id: channelId });

  if (isChannelLoading || status === "LoadingFirstPage") {
    <div className="h-full flex flex-1 justify-center items-center">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col gap-y-2 justify-center items-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground text-red-500" />
        <span className="text-md text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header name={channel.name} />
      {/* <div className="flex-1" /> */}
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`\u00A0Message # ${channel.name}`} />

    </div>
  )
}
