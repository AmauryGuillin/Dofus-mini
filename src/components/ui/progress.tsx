import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "absolute h-6 w-[calc(100%-5%)] overflow-hidden rounded-lg bg-red-600/40",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-red-600 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold">
      {value}
    </div>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
