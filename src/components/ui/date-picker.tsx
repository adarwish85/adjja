
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  mode?: "single" | "range"
  selected?: Date | DateRange
  onSelect?: (date: Date | DateRange | undefined) => void
  defaultMonth?: Date
  className?: string
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  defaultMonth,
  className
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {mode === "range" && selected && typeof selected === 'object' && 'from' in selected ? (
              selected.to ? (
                <>
                  {format(selected.from, "LLL dd, y")} -{" "}
                  {format(selected.to, "LLL dd, y")}
                </>
              ) : (
                format(selected.from, "LLL dd, y")
              )
            ) : selected && selected instanceof Date ? (
              format(selected, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode={mode as any}
            defaultMonth={defaultMonth}
            selected={selected}
            onSelect={onSelect}
            numberOfMonths={mode === "range" ? 2 : 1}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
