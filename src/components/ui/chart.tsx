"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEME_STYLES = {
  light: "",
  dark: ".dark",
} as const

type ThemeKey = keyof typeof THEME_STYLES

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<ThemeKey, string> }
  )
}

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart(): ChartContextValue {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer /> component.")
  }

  return context
}

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueReactId = React.useId()
    const chartId = React.useMemo(
      () => `chart-${id || uniqueReactId.replace(/:/g, "")}`,
      [id, uniqueReactId]
    )

    const contextValue = React.useMemo(() => ({ config }), [config])

    const containerClassName = cn(
      "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
      "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
      "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
      "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
      "[&_.recharts-radial-bar-background-sector]:fill-muted",
      "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
      "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
      "flex aspect-video justify-center text-xs",
      "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-layer]:outline-hidden",
      "[&_.recharts-sector]:outline-hidden",
      "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-surface]:outline-hidden",
      className
    )

    return (
      <ChartContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="chart"
          data-chart={chartId}
          className={containerClassName}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

export interface ChartStyleProps {
  id: string
  config: ChartConfig
}

const ChartStyle = React.memo(({ id, config }: ChartStyleProps) => {
  const themedEntries = React.useMemo(
    () => Object.entries(config).filter(([, itemConfig]) => itemConfig.theme || itemConfig.color),
    [config]
  )

  const cssContent = React.useMemo(() => {
    if (themedEntries.length === 0) return ""

    return Object.entries(THEME_STYLES)
      .map(([themeName, themeSelector]) => {
        const themeRules = themedEntries
          .map(([key, itemConfig]) => {
            const resolvedColor =
              itemConfig.theme?.[themeName as ThemeKey] || itemConfig.color
            return resolvedColor ? `  --color-${key}: ${resolvedColor};` : null
          })
          .filter(Boolean)
          .join("\n")

        return `\n${themeSelector} [data-chart=${id}] {\n${themeRules}\n}`
      })
      .join("\n")
  }, [id, themedEntries])

  if (!cssContent) {
    return null
  }

  return <style dangerouslySetInnerHTML={{ __html: cssContent }} />
})
ChartStyle.displayName = "ChartStyle"

const ChartTooltip = RechartsPrimitive.Tooltip

export interface ChartTooltipContentProps
  extends React.ComponentProps<typeof RechartsPrimitive.Tooltip>,
    React.ComponentProps<"div"> {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  const renderedTooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload || payload.length === 0) {
      return null
    }

    const [primaryItem] = payload
    const lookupKey = `${labelKey || primaryItem?.dataKey || primaryItem?.name || "value"}`
    const matchedConfig = getPayloadConfigFromPayload(config, primaryItem, lookupKey)
    
    const resolvedValue =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : matchedConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(resolvedValue, payload)}
        </div>
      )
    }

    if (!resolvedValue) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{resolvedValue}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const isNestedLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!isNestedLabel ? renderedTooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const itemKey = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, itemKey)
          const indicatorColor = color || item.payload?.fill || item.color

          return (
            <div
              key={item.dataKey ?? index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": isNestedLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      isNestedLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {isNestedLabel ? renderedTooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && item.value !== null && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : String(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

export interface ChartLegendContentProps
  extends React.ComponentProps<"div">,
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> {
  hideIcon?: boolean
  nameKey?: string
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart()

  if (!payload || payload.length === 0) {
    return null
  }

  const legendClassName = cn(
    "flex items-center justify-center gap-4",
    verticalAlign === "top" ? "pb-3" : "pt-3",
    className
  )

  return (
    <div className={legendClassName}>
      {payload.map((item, index) => {
        const itemKey = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, itemKey)

        return (
          <div
            key={String(item.value ?? index)}
            className="[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label || item.value}
          </div>
        )
      })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const innerPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let resolvedConfigKey = key

  if (
    key in payload &&
    typeof (payload as Record<string, unknown>)[key] === "string"
  ) {
    resolvedConfigKey = (payload as Record<string, unknown>)[key] as string
  } else if (
    innerPayload &&
    key in innerPayload &&
    typeof (innerPayload as Record<string, unknown>)[key] === "string"
  ) {
    resolvedConfigKey = (innerPayload as Record<string, unknown>)[key] as string
  }

  return resolvedConfigKey in config
    ? config[resolvedConfigKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}