import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activity = [
  {
    user: {
      name: "John Smith",
      image: "/placeholder.svg?height=32&width=32",
      email: "j.smith",
    },
    action: "completed a training session",
    time: "2 minutes ago",
  },
  {
    user: {
      name: "Sarah Wilson",
      image: "/placeholder.svg?height=32&width=32",
      email: "s.wilson",
    },
    action: "started a new game",
    time: "4 minutes ago",
  },
  {
    user: {
      name: "Michael Brown",
      image: "/placeholder.svg?height=32&width=32",
      email: "m.brown",
    },
    action: "achieved a new save record",
    time: "6 minutes ago",
  },
  {
    user: {
      name: "Emily Davis",
      image: "/placeholder.svg?height=32&width=32",
      email: "e.davis",
    },
    action: "exported game statistics",
    time: "8 minutes ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activity.map((item, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.image} alt="Avatar" />
            <AvatarFallback>
              {item.user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.action}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {item.time}
          </div>
        </div>
      ))}
    </div>
  )
}

