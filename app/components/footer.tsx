import Link from "next/link"
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-6 md:py-0 md:h-14 border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Designed by</span>
          <Link
            href="https://www.flushinc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Flush
          </Link>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart className="h-4 w-4 fill-current" /> in Baltimore
        </div>
      </div>
    </footer>
  )
}

