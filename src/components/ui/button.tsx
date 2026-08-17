import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * PRESS FEEDBACK — why `active:` is in the base and not left to callers.
 *
 * Until this was added the button had a hover state and nothing else, and a
 * search for `active:` across `src/` returned no matches at all: no control
 * anywhere in the product acknowledged being pressed. On a pointer that is
 * survivable, because hover already signals "this is live". On touch — which
 * is the audience this product is built for — there was no feedback of any
 * kind between the tap and whatever happened next, so every button felt dead
 * for as long as the work behind it took.
 *
 * The rule being followed is that feedback belongs on pointer-*down*, not on
 * release. `:active` is the platform's pointer-down state, so it costs one
 * declaration and needs no JavaScript.
 *
 * 0.97 and 100ms are deliberately small: this should register as the surface
 * yielding under a finger, not as an animation playing. `transition-colors`
 * became an explicit property list because the transform has to be included
 * or the scale would snap.
 *
 * `motion-reduce:active:scale-100` keeps the press *acknowledged* under
 * reduced motion — the colour change still fires — while removing the travel.
 * Reduced motion means less vestibular movement, not less feedback.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-tight transition-[transform,background-color,border-color,color,opacity] duration-100 ease-out active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-pac-ember hover:text-pac-paper",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
        outline:
          "border border-border bg-transparent hover:bg-secondary text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-80",
        ghost: "hover:bg-secondary text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
