"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from 'lucide-react'

export function InstructionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to Use Shot Tracker</DialogTitle>
          <DialogDescription>
            Track and analyze your goalkeeper performance with these simple steps.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <h4 className="font-medium mb-2">Recording Shots</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Tap or click anywhere on the field to record a shot</li>
              <li>Shots inside the goal frame require you to specify if they were saved</li>
              <li>Shots outside the frame are automatically recorded as misses</li>
              <li>Tap or click on any existing shot to edit or delete it</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Shot Colors</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Red dots represent saved shots</li>
              <li>Yellow dots represent goals scored</li>
              <li>White dots represent shots that missed the goal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Using Controls</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Use the half selector to record shots for specific periods</li>
              <li>Use undo/redo buttons to correct mistakes</li>
              <li>Switch between halves to view shots from different periods</li>
              <li>View all shots together by selecting "All Shots"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Mobile Tips</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Tap precisely on the field to place shots</li>
              <li>Use a light touch for better accuracy</li>
              <li>Avoid dragging motions when placing shots</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

