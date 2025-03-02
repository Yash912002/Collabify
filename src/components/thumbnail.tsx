/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg cursor-zoom-in my-2">
          <img
            src={url}
            alt="Message Image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="Message Image"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};