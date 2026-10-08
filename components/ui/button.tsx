import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-base font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-pill)] bg-medicity-blue text-white hover:bg-medicity-blue/90",
        outline:
          "rounded-[var(--radius-pill)] border-medicity-blue bg-white text-medicity-blue hover:bg-medicity-blue-light",
        secondary:
          "rounded-[var(--radius-pill)] border-border-default bg-white text-text-primary hover:bg-muted",
        whatsapp:
          "rounded-[var(--radius-pill)] bg-whatsapp text-white hover:bg-whatsapp/90",
        ghost:
          "rounded-lg hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive:
          "rounded-[var(--radius-pill)] bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "rounded-lg text-medicity-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-6 py-3.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-10 rounded-full",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
