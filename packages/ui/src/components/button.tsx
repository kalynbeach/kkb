import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@kkb/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { isValidElement } from "react";

import { buttonVariants } from "./button-variants";

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const rendersNativeButton =
    render === undefined ||
    (isValidElement(render) && typeof render.type === "string" && render.type === "button");

  return (
    <ButtonPrimitive
      render={render}
      nativeButton={nativeButton ?? rendersNativeButton}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
