"use client"

import { useEffect, useState } from "react"
import { getFinancialHealthAnalysis } from "@/lib/actions"
import type { FinancialHealthOutput } from "@/ai/flows/financial-health-flow"
import type { Transaction } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react"

type FinancialHealthCardProps = {
  transactions: Transaction[]
}

export default function FinancialHealthCard({ transactions }: FinancialHealthCardProps) {
  const [data, setData] = useState<FinancialHealthOutput | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const res = await getFinancialHealthAnalysis({ transactions })
      if (res.success && res.data) {
        setData(res.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [transactions])

  if (loading) {
    return (
      <Card className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (!data) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500 hover:bg-green-600'
      case 'Stable': return 'bg-blue-500 hover:bg-blue-600'
      case 'Warning': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'Critical': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Financial Health</CardTitle>
          <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
        </div>
        <CardDescription>{data.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Health Score</span>
            <span className="font-bold">{data.score}/100</span>
          </div>
          <Progress value={data.score} className="h-2" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Insights</p>
          <ul className="space-y-2">
            {data.keyObservations.map((obs, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="mt-1 text-primary">•</span>
                {obs}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
