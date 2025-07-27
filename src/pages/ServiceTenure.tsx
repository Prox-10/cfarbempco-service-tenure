import { useState } from "react"
import { employees } from "@/data/mockData"
import { calculateServiceLength, calculateYearsOfService, formatDate } from "@/utils/dateCalculations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Eye, Calculator } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ServiceTenure() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null)
  const navigate = useNavigate()

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRecalculate = () => {
    // Simulate recalculation
    alert("Service lengths recalculated successfully!")
  }

  const handleProceedToAdvance = (employeeId: string) => {
    navigate(`/pay-advancement?employee=${employeeId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Tenure Tracker</h1>
          <p className="text-muted-foreground">Track employee length of service (auto-updated yearly)</p>
        </div>
        <Button onClick={handleRecalculate} className="bg-primary hover:bg-primary/90">
          <Calculator className="h-4 w-4 mr-2" />
          Recalculate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Employee Service Records</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Employee Name</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Length of Service</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border hover:bg-muted/50 cursor-pointer">
                    <td className="py-3 px-4 font-medium text-foreground">{employee.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{employee.department}</td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(employee.startDate)}</td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {calculateServiceLength(employee.startDate)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Employee Service Details</DialogTitle>
                          </DialogHeader>
                          {selectedEmployee && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                                  <p className="text-foreground font-medium">{selectedEmployee.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                                  <p className="text-foreground">{selectedEmployee.department}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                                  <p className="text-foreground">{formatDate(selectedEmployee.startDate)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Length of Service</label>
                                  <p className="text-foreground font-medium">
                                    {calculateServiceLength(selectedEmployee.startDate)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Years Claimed</label>
                                  <p className="text-foreground">{selectedEmployee.claimedYears} years</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Remaining Years</label>
                                  <p className="text-foreground font-medium">
                                    {Math.max(0, calculateYearsOfService(selectedEmployee.startDate) - selectedEmployee.claimedYears)} years
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Eligible for Pay Advancement?</label>
                                <p className="text-foreground">
                                  {calculateYearsOfService(selectedEmployee.startDate) - selectedEmployee.claimedYears > 0 ? 
                                    "✅ Yes" : "❌ No"}
                                </p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  onClick={() => handleProceedToAdvance(selectedEmployee.id)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Proceed to Advance Pay
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}