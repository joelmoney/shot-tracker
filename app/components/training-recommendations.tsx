import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shot } from "../types"

export default function TrainingRecommendations({ shots }: { shots: Shot[] }) {
  const getRecommendations = (shots: Shot[]) => {
    const zones = shots.reduce((acc, shot) => {
      const x = shot.position.x
      let zone: "Left" | "Center" | "Right" = "Center"
      
      if (x < 33) zone = "Left"
      else if (x > 66) zone = "Right"
      
      if (!acc[zone]) {
        acc[zone] = {
          total: 0,
          saved: 0
        }
      }
      
      acc[zone].total++
      if (shot.saved) acc[zone].saved++
      
      return acc
    }, {} as Record<string, { total: number; saved: number }>)

    const recommendations: TrainingRecommendation[] = []

    Object.entries(zones).forEach(([zone, stats]) => {
      const savePercentage = (stats.saved / stats.total) * 100
      
      if (savePercentage < 50) {
        recommendations.push({
          area: zone as "Left" | "Center" | "Right",
          improvement: `Improve ${zone.toLowerCase()} side saves`,
          drills: [
            `${zone} side diving practice`,
            `Quick reaction ${zone.toLowerCase()} saves`,
            `Positioning for ${zone.toLowerCase()} shots`
          ]
        })
      }
    })

    return recommendations
  }

  const recommendations = getRecommendations(shots)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">{rec.area} Side: {rec.improvement}</h3>
                <ul className="list-disc pl-4 space-y-1">
                  {rec.drills.map((drill, drillIndex) => (
                    <li key={drillIndex} className="text-muted-foreground">
                      {drill}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              Great work! Keep maintaining your current training routine.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

