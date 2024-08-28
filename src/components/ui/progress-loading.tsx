import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

const ProgressLoading = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, content, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "absolute h-6 w-[calc(100%-5%)] overflow-hidden border-2 border-gray-700 bg-gray-600",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[#99CC00]"
      style={{
        transform: `translateX(-${100 - ((value || 0) / max!) * 100}%)`,
      }}
    />
    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold sm:text-sm">
      {content} {value}%
    </div>
  </ProgressPrimitive.Root>
));
ProgressLoading.displayName = ProgressPrimitive.Root.displayName;

export { ProgressLoading };
