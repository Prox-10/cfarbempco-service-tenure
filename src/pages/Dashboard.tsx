import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { employees, payAdvancements } from "@/data/mockData"
import { calculateYearsOfService } from "@/utils/dateCalculations"
import { Users, Clock, DollarSign, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length
  const totalPayAdvancementAmount = payAdvancements.reduce((sum, advance) => sum + (advance.amount || 0), 0)
  const avgServiceYears = Math.round(
    employees.reduce((sum, emp) => sum + calculateYearsOfService(emp.startDate), 0) / employees.length
  )

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      description: `${activeEmployees} active`
    },
    {
      title: "Average Service Years",
      value: `${avgServiceYears} years`,
      icon: Clock,
      description: "Company-wide average"
    },
    {
      title: "Total Advancements",
      value: payAdvancements.length,
      icon: TrendingUp,
      description: "This year"
    },
    {
      title: "Total Amount Paid",
      value: `₱${totalPayAdvancementAmount.toLocaleString()}`,
      icon: DollarSign,
      description: "Service pay advancements"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of service tenure and pay advancement data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payAdvancements.slice(0, 3).map((advancement) => (
                <div key={advancement.id} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {advancement.employeeName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {advancement.yearsClaimed} years claimed - ₱{advancement.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(advancement.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...new Set(employees.map(emp => emp.department))].map((dept) => {
                const deptEmployees = employees.filter(emp => emp.department === dept)
                return (
                  <div key={dept} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{dept}</p>
                      <p className="text-sm text-muted-foreground">{deptEmployees.length} employees</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {Math.round(
                        deptEmployees.reduce((sum, emp) => sum + calculateYearsOfService(emp.startDate), 0) / deptEmployees.length
                      )} years
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}