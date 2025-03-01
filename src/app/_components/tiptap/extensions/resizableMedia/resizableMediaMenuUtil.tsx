/* @unocss-include */
// import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconFloatLeft, IconFloatRight, IconDelete } from '~/assets'

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Trash2Icon,
} from "@yamada-ui/lucide";
import { ReactElement } from "react";

interface ResizableMediaAction {
  tooltip: string;
  icon?: ReactElement;
  action?: (updateAttributes: (o: Record<string, any>) => any) => void;
  isActive?: (attrs: Record<string, any>) => boolean;
  delete?: (d: () => void) => void;
}

export const resizableMediaActions: ResizableMediaAction[] = [
  {
    tooltip: "Align left",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "start",
        dataFloat: null,
      }),
    icon: <AlignLeftIcon />,
    isActive: (attrs) => attrs.dataAlign === "start",
  },
  {
    tooltip: "Align center",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "center",
        dataFloat: null,
      }),
    icon: <AlignCenterIcon />,
    isActive: (attrs) => attrs.dataAlign === "center",
  },
  {
    tooltip: "Align right",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "end",
        dataFloat: null,
      }),
    icon: <AlignRightIcon />,
    isActive: (attrs) => attrs.dataAlign === "end",
  },
  {
    tooltip: "Delete",
    icon: <Trash2Icon />,
    delete: (deleteNode) => deleteNode(),
  },
];
