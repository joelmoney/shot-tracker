"use client"

import { useState } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Camera } from 'lucide-react'

interface ExportDialogProps {
  statsRef: React.RefObject<HTMLDivElement>
}

export default function ExportDialog({ statsRef }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!statsRef.current) return
    
    setIsExporting(true)
    try {
      // Create a clone of the stats element to modify before capture
      const original = statsRef.current
      const clone = original.cloneNode(true) as HTMLElement
      
      // Temporarily append clone to body with specific styling for capture
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.background = 'white'
      document.body.appendChild(clone)
      
      // Capture the clone
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        width: original.offsetWidth,
        height: original.offsetHeight
      })
      
      // Remove the clone
      document.body.removeChild(clone)
      
      // Convert to image and handle download/share
      const dataUrl = canvas.toDataURL('image/png')
      
      if (navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], 'shot-tracker-stats.png', { type: 'image/png' })
          await navigator.share({
            files: [file],
          })
        } catch (error) {
          // Fall back to download if share fails
          downloadImage(dataUrl)
        }
      } else {
        downloadImage(dataUrl)
      }
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'shot-tracker-stats.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      <Camera className="h-4 w-4 mr-2" />
      Export Visual
    </Button>
  )
}

