import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllShots } from "@/app/actions"
import { ShotDistributionChart } from "./shot-distribution-chart"
import { SavePercentageChart } from "./save-percentage-chart"

export default async function AnalyticsPage() {
  const shots = await getAllShots()
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Shot Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ShotDistributionChart shots={shots} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Save Percentage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SavePercentageChart shots={shots} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

