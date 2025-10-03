"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useInventory } from "@/hooks/use-inventory"
import { useForecast } from "@/hooks/use-forecast"
import { StockChart } from "@/components/stock-chart"
import { ForecastChart } from "@/components/forecast-chart"
import { ConsumptionChart } from "@/components/consumption-chart"
import { CategoryDistributionChart } from "@/components/category-distribution-chart"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const { inventory, loading: inventoryLoading } = useInventory()
  const { forecast, loading: forecastLoading } = useForecast()
  const [timeRange, setTimeRange] = useState("30")
  const [category, setCategory] = useState("all")
  const { toast } = useToast()

  const categories = inventory ? ["all", ...new Set(inventory.map((med) => med.category))] : ["all"]

  const exportCSV = (type: string) => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "Export initiated",
      description: `${type} report is being generated and will download shortly.`,
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `${type} report has been downloaded.`,
      })
    }, 1500)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Reports & Analytics" text="View detailed reports and analytics for your inventory." />

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => exportCSV("Inventory")}>
            <FileText className="mr-2 h-4 w-4" />
            Export Inventory
          </Button>
          <Button onClick={() => exportCSV("Analytics")}>
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>Current stock levels across all medication categories</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <StockChart category={category === "all" ? undefined : category} />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Distribution of medications by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Trends</CardTitle>
              <CardDescription>Historical consumption data for the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ConsumptionChart
                days={Number.parseInt(timeRange)}
                category={category === "all" ? undefined : category}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>ML-powered prediction for future demand</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ForecastChart
                detailed
                days={Number.parseInt(timeRange)}
                category={category === "all" ? undefined : category}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Forecast Accuracy</CardTitle>
              <CardDescription>Comparison of predicted vs. actual demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-xs text-muted-foreground">Overall Accuracy</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">±0%</div>
                    <div className="text-xs text-muted-foreground">Mean Absolute Error</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">0.00</div>
                    <div className="text-xs text-muted-foreground">R² Score</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  The forecast model uses historical consumption data and a linear regression algorithm to predict
                  future demand. The model is retrained daily with new data to improve accuracy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Distribution of medications by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryDistributionChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Stock Status Distribution</CardTitle>
                <CardDescription>Distribution of medications by stock status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {inventoryLoading ? (
                    <p>Loading chart data...</p>
                  ) : (
                    <div className="w-full h-full">
                      {/* This would be a pie chart showing stock status distribution */}
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex items-center space-x-8">
                          <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                              {inventory?.filter((med) => med.quantity > med.minQuantity).length || 0}
                            </div>
                            <span className="mt-2">In Stock</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                              {inventory?.filter(
                                (med) => med.quantity <= med.minQuantity && med.quantity > med.minQuantity * 0.5,
                              ).length || 0}
                            </div>
                            <span className="mt-2">Low Stock</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold">
                              {inventory?.filter((med) => med.quantity <= med.minQuantity * 0.5).length || 0}
                            </div>
                            <span className="mt-2">Critical</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expiry Distribution</CardTitle>
              <CardDescription>Distribution of medications by expiry date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                {inventoryLoading ? (
                  <p>Loading chart data...</p>
                ) : (
                  <div className="w-full h-full">
                    {/* This would be a bar chart showing expiry distribution */}
                    <div className="flex items-center justify-around h-full">
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-24 bg-destructive rounded-t-md flex items-end justify-center">
                          <span className="text-destructive-foreground font-bold mb-2">
                            {inventory?.filter((med) => {
                              const expiry = new Date(med.expiryDate)
                              const today = new Date()
                              return expiry < today
                            }).length || 0}
                          </span>
                        </div>
                        <span className="mt-2">Expired</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-48 w-24 bg-yellow-500 rounded-t-md flex items-end justify-center">
                          <span className="text-white font-bold mb-2">
                            {inventory?.filter((med) => {
                              const expiry = new Date(med.expiryDate)
                              const today = new Date()
                              const diffTime = expiry.getTime() - today.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              return diffDays >= 0 && diffDays < 30
                            }).length || 0}
                          </span>
                        </div>
                        <span className="mt-2">{"< 30 days"}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-64 w-24 bg-orange-400 rounded-t-md flex items-end justify-center">
                          <span className="text-white font-bold mb-2">
                            {inventory?.filter((med) => {
                              const expiry = new Date(med.expiryDate)
                              const today = new Date()
                              const diffTime = expiry.getTime() - today.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              return diffDays >= 30 && diffDays < 90
                            }).length || 0}
                          </span>
                        </div>
                        <span className="mt-2">30-90 days</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-80 w-24 bg-primary rounded-t-md flex items-end justify-center">
                          <span className="text-primary-foreground font-bold mb-2">
                            {inventory?.filter((med) => {
                              const expiry = new Date(med.expiryDate)
                              const today = new Date()
                              const diffTime = expiry.getTime() - today.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              return diffDays >= 90
                            }).length || 0}
                          </span>
                        </div>
                        <span className="mt-2">{"> 90 days"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

