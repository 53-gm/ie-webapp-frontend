import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { getMediaPasteDropPlugin, UploadFnType } from "./mediaPasteDropPlugin";
import { ResizableMediaNodeView } from "./ResizableMediaNodeView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableMedia: {
      /**
       * Set media
       */
      setMedia: (options: {
        "media-type": "img" | "video";
        src: string;
        alt?: string;
        title?: string;
        width?: string | number;
        height?: string | number;
      }) => ReturnType;
    };
  }
}

export interface MediaOptions {
  HTMLAttributes: Record<string, any>;
  uploadFn: UploadFnType;
}

export const IMAGE_INPUT_REGEX =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const VIDEO_INPUT_REGEX =
  /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const ResizableMedia = Node.create<MediaOptions>({
  name: "resizableMedia",

  addOptions() {
    return {
      HTMLAttributes: {},
      uploadFn: async () => {
        return "";
      },
    };
  },

  inline: false,

  group: "block",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      "media-type": {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 400,
      },
      height: {
        default: "auto",
      },
      dataAlign: {
        default: "start", // 'start' | 'center' | 'end'
      },
      dataFloat: {
        default: null, // 'left' | 'right'
      },
    };
  },

  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (el) => ({
          src: (el as HTMLImageElement).getAttribute("src"),
          "media-type": "img",
        }),
      },
      {
        tag: "video",
        getAttrs: (el) => ({
          src: (el as HTMLVideoElement).getAttribute("src"),
          "media-type": "video",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { "media-type": mediaType } = HTMLAttributes;

    if (mediaType === "img") {
      return [
        "img",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ];
    }
    if (mediaType === "video") {
      return [
        "video",
        { controls: "true", style: "width: 100%", ...HTMLAttributes },
        ["source", HTMLAttributes],
      ];
    }

    // Default fallback
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setMedia:
        (options) =>
        ({ commands }) => {
          const { "media-type": mediaType } = options;

          if (mediaType === "img") {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
          if (mediaType === "video") {
            return commands.insertContent({
              type: this.name,
              attrs: {
                ...options,
                controls: "true",
              },
            });
          }

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableMediaNodeView);
  },

  addStorage() {
    return {
      uploadFn: this.options.uploadFn,
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;

          return {
            src,
            alt,
            title,
            "media-type": "img",
          };
        },
      }),
      nodeInputRule({
        find: VIDEO_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , src] = match;

          return {
            src,
            "media-type": "video",
          };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [getMediaPasteDropPlugin(this.options.uploadFn)];
  },
});
