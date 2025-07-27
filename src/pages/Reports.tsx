import { useState } from "react"
import { employees, payAdvancements } from "@/data/mockData"
import { calculateYearsOfService, calculateServiceLength } from "@/utils/dateCalculations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Printer, TrendingUp, BarChart } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Reports() {
  const [reportType, setReportType] = useState("all")
  const [sortBy, setSortBy] = useState("longest-service")

  const handleDownloadReport = (type: string) => {
    toast({
      title: "Generating Report",
      description: `${type} report is being generated...`,
    })
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${type} report has been downloaded successfully.`,
      })
    }, 2000)
  }

  const handlePrintView = () => {
    window.print()
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    switch (sortBy) {
      case "longest-service":
        return calculateYearsOfService(b.startDate) - calculateYearsOfService(a.startDate)
      case "most-claimed":
        return b.claimedYears - a.claimedYears
      case "name":
        return a.name.localeCompare(b.name)
      case "department":
        return a.department.localeCompare(b.department)
      default:
        return 0
    }
  })

  const departmentStats = [...new Set(employees.map(emp => emp.department))].map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept)
    const totalYears = deptEmployees.reduce((sum, emp) => sum + calculateYearsOfService(emp.startDate), 0)
    const totalClaimed = deptEmployees.reduce((sum, emp) => sum + emp.claimedYears, 0)
    
    return {
      department: dept,
      employees: deptEmployees.length,
      avgService: Math.round(totalYears / deptEmployees.length),
      totalClaimed,
      remainingYears: totalYears - totalClaimed
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and download comprehensive service and pay advancement reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintView}>
            <Printer className="h-4 w-4 mr-2" />
            Print View
          </Button>
          <Button onClick={() => handleDownloadReport("All Reports")} className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download All Reports as PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Duration Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Comprehensive report of all employee service durations and tenure milestones.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Employees:</span>
                <span className="font-medium">{employees.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Service:</span>
                <span className="font-medium">
                  {Math.round(employees.reduce((sum, emp) => sum + calculateYearsOfService(emp.startDate), 0) / employees.length)} years
                </span>
              </div>
            </div>
            <Button 
              onClick={() => handleDownloadReport("Service Duration Report")} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pay Advancement Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Summary of all pay advancement activities and outstanding balances.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Records:</span>
                <span className="font-medium">{payAdvancements.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">
                  ₱{payAdvancements.reduce((sum, adv) => sum + (adv.amount || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => handleDownloadReport("Pay Advancement Report")} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Unclaimed Years Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Analysis of unclaimed service years available for pay advancement.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Unclaimed:</span>
                <span className="font-medium">
                  {employees.reduce((sum, emp) => sum + Math.max(0, calculateYearsOfService(emp.startDate) - emp.claimedYears), 0)} years
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Eligible Employees:</span>
                <span className="font-medium">
                  {employees.filter(emp => calculateYearsOfService(emp.startDate) - emp.claimedYears > 0).length}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => handleDownloadReport("Unclaimed Years Report")} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Department-wise breakdown of service and advancement metrics.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Departments:</span>
                <span className="font-medium">{departmentStats.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Largest Dept:</span>
                <span className="font-medium">
                  {departmentStats.reduce((max, dept) => dept.employees > max.employees ? dept : max).department}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => handleDownloadReport("Department Summary Report")} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Employee Service Summary</CardTitle>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="longest-service">Longest Service</SelectItem>
                  <SelectItem value="most-claimed">Most Claimed</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
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
                  <th className="text-left py-3 px-4 font-medium text-foreground">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Service Length</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Years Claimed</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Remaining</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => {
                  const totalYears = calculateYearsOfService(employee.startDate)
                  const remaining = Math.max(0, totalYears - employee.claimedYears)
                  
                  return (
                    <tr key={employee.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{employee.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{employee.department}</td>
                      <td className="py-3 px-4 text-foreground">{calculateServiceLength(employee.startDate)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{employee.claimedYears} years</td>
                      <td className="py-3 px-4">
                        <span className={remaining > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                          {remaining} years
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium text-foreground mb-2">{dept.department}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees:</span>
                    <span className="font-medium">{dept.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Service:</span>
                    <span className="font-medium">{dept.avgService} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Claimed:</span>
                    <span className="font-medium">{dept.totalClaimed} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium text-primary">{dept.remainingYears} years</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}