import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode
}: InviteModalProps) => {

  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "This will deactive the current invite code and generate a new one"
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite Link Copied to clipboard"))
  }

  const handleGenerateNewCode = async () => {

    const ok = await confirm();

    if (!ok) return;

    mutate({ workspaceId }, {
      onSuccess: () => {
        toast.success("New Code enerated");
      },
      onError: () => {
        toast.error("Failed to regenerate new code");
      },
    })
  }

  return (
    <>
      <ConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to {name}
            </DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col justify-center items-center gap-y-4 py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={isPending}
            >
              Copy Link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleGenerateNewCode}
              variant="outline"
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>

            <DialogClose asChild>
              <Button disabled={isPending}>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>

  )
}