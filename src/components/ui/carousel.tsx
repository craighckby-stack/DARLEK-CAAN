"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]
export type CarouselPlugin = UseCarouselParameters[1]

export type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
} & React.ComponentProps<"div">

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel(): CarouselContextProps {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const emblaOptions = React.useMemo(
      () => ({
        ...opts,
        axis: orientation === "horizontal" ? "x" : ("y" as const),
      }),
      [opts, orientation]
    )

    const [carouselRef, api] = useEmblaCarousel(emblaOptions, plugins)
    const [canScrollPrev, setCanScrollPrev] = React.useState<boolean>(false)
    const [canScrollNext, setCanScrollNext] = React.useState<boolean>(false)

    const updateScrollStates = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          api?.scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          api?.scrollNext()
        }
      },
      [api]
    )

    React.useEffect(() => {
      if (!api || !setApi) return
      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) return
      
      updateScrollStates(api)
      api.on("reInit", updateScrollStates)
      api.on("select", updateScrollStates)

      return () => {
        api.off("reInit", updateScrollStates)
        api.off("select", updateScrollStates)
      }
    }, [api, updateScrollStates])

    const computedOrientation =
      orientation || (opts?.axis === "y" ? "vertical" : "horizontal")

    const contextValue = React.useMemo(
      () => ({
        carouselRef,
        api,
        opts,
        orientation: computedOrientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }),
      [carouselRef, api, opts, computedOrientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext]
    )

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  const contentClassName = React.useMemo(
    () =>
      cn(
        "flex",
        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
        className
      ),
    [orientation, className]
  )

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        ref={ref}
        className={contentClassName}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  const itemClassName = React.useMemo(
    () =>
      cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      ),
    [orientation, className]
  )

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={itemClassName}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  const prevClassName = React.useMemo(
    () =>
      cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
    [orientation, className]
  )

  return (
    <Button
      ref={ref}
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={prevClassName}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  const nextClassName = React.useMemo(
    () =>
      cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
    [orientation, className]
  )

  return (
    <Button
      ref={ref}
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={nextClassName}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}