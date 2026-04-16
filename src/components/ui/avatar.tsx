"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarContextValue {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  imageError: boolean;
  setImageError: (error: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue>({
  imageLoaded: false,
  setImageLoaded: () => {},
  imageError: false,
  setImageError: () => {},
});

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <AvatarContext.Provider
      value={{ imageLoaded, setImageLoaded, imageError, setImageError }}
    >
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "", onLoad, onError, ...props }, ref) => {
    const { setImageLoaded, setImageError } = React.useContext(AvatarContext);

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onLoad={(e) => {
          setImageLoaded(true);
          setImageError(false);
          onLoad?.(e);
        }}
        onError={(e) => {
          setImageError(true);
          setImageLoaded(false);
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { imageLoaded, imageError } = React.useContext(AvatarContext);

    // Show fallback when there's an error or no image loaded yet
    if (imageLoaded && !imageError) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-sm font-medium",
          className
        )}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
