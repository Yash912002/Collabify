import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Hint } from "./hint";

import Quill, { Delta, Op, type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
}

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write something.....",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create"
}: EditorProps) => {

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  })

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    )

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef?.current?.files?.[0] || null;

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")
              }
            }
          }
        }
      }
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible(current => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }

  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emojiValue)
  }

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />

      <div className={cn(
        "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:shadow-sm focus-within:border-slate-300 transition bg-white",
        disabled && "opacity-50"
      )}>

        <div ref={containerRef} className="h-full ql-custom" />

        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex item-center justify-center group/image">
              <Hint label="Remove">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white z-[4] size-6 border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Image Icon"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex px-2 pb-2 z-[5] gap-x-3 items-center">
          <Hint label={isToolbarVisible ? "Hide Formatting" : "Show Formatting"}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
              className="size-4"
            >
              <PiTextAa />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              className="size-4"
            >
              <SmileIcon />
            </Button>
          </EmojiPopover>

          {variant === "create" && (
            <>
              <Hint label="Image">
                <Button
                  disabled={disabled}
                  size="iconSm"
                  variant="ghost"
                  onClick={() => imageElementRef?.current?.click()}
                  className="size-4"
                >
                  <ImageIcon />
                </Button>
              </Hint>

              <Button
                disabled={disabled || isEmpty}
                size="iconSm"
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }}
                className={cn(
                  "ml-auto",
                  isEmpty
                    ? "bg-white hover:white text-muted-foreground"
                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                )}
              >
                <MdSend />
              </Button>
            </>
          )}

          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {variant === "create" && (
        <div className={cn(
          "p-2 text-[10px] flex justify-end text-muted-foreground opacity-0 transition",
          !isEmpty && "opacity-100"
        )}>
          <p>
            <strong> Shift + Enter </strong> to add a new line
          </p>
        </div>
      )}

    </div>
  );
};

export default Editor;