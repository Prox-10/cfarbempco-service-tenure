import { useState } from "react"
import { payAdvancements } from "@/data/mockData"
import { formatDate } from "@/utils/dateCalculations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PayAdvancementHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Pay advancement history is being exported to PDF...",
    })
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Pay advancement history has been downloaded successfully.",
      })
    }, 2000)
  }

  const filteredAdvancements = payAdvancements.filter(advancement => {
    const matchesSearch = advancement.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advancement.remarks.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pay Advancement History</h1>
          <p className="text-muted-foreground">View all past service-based pay advancements</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export as PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Advancement Records</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees or remarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="it">IT Department</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Employee Name</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Years Claimed</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvancements.map((advancement) => (
                  <tr key={advancement.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{advancement.employeeName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{advancement.yearsClaimed} years</td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(advancement.date)}</td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {advancement.amount ? `₱${advancement.amount.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                      {advancement.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAdvancements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pay advancement records found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{payAdvancements.length}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {payAdvancements.reduce((sum, adv) => sum + adv.yearsClaimed, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Years Claimed</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₱{payAdvancements.reduce((sum, adv) => sum + (adv.amount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount Paid</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}