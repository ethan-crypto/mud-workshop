import { AsyncButton, Props as AsyncButtonProps } from "./AsyncButton";
import { twMerge } from "tailwind-merge";
import { PendingIcon } from "./icons/PendingIcon";

export type Props = AsyncButtonProps;

export const Button = ({ className, children, ...props }: Props) => {
  return (
    <AsyncButton className={twMerge("group/button", className)} {...props}>
      <span
        className={twMerge(
          "pointer-events-none",
          "flex items-center gap-[.5em]",
          "-translate-x-[.75em]",
          "transition group-aria-busy/button:translate-x-0"
        )}
      >
        <span
          className={twMerge(
            "leading-none",
            "opacity-0",
            "transition group-aria-busy/button:opacity-100"
          )}
        >
          <PendingIcon />
        </span>
        <span>{children}</span>
      </span>
    </AsyncButton>
  );
};
