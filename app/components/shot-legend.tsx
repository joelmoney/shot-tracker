import { cn } from "@/lib/utils"

export function ShotLegend() {
  const items = [
    { color: "bg-red-500", label: "Saves" },
    { color: "bg-yellow-400", label: "Goals" },
    { color: "border-2 border-gray-400 bg-transparent", label: "Misses" }
  ]

  return (
    <div 
      className="flex items-center justify-center gap-4 py-2"
      role="legend"
      aria-label="Shot type indicators"
    >
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div 
            className={cn("h-3 w-3 rounded-full", color)}
            role="img"
            aria-label={`${label} indicator`}
          />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

