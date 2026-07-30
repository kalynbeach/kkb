"use client";

import {
  DirectionProvider as BaseDirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider";
import type * as React from "react";

type DirectionProviderProps = Omit<
  React.ComponentProps<typeof BaseDirectionProvider>,
  "direction"
> & {
  dir?: "ltr" | "rtl";
};

function DirectionProvider({ dir, ...props }: DirectionProviderProps) {
  return <BaseDirectionProvider direction={dir} {...props} />;
}

export { DirectionProvider, useDirection };
