import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { employees, Employee } from "@/data/mockData"
import { calculateYearsOfService, formatDate } from "@/utils/dateCalculations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, RefreshCw, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export default function PayAdvancement() {
  const [searchParams] = useSearchParams()
  const preselectedEmployeeId = searchParams.get("employee")
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(preselectedEmployeeId || "")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [yearsToPayOut, setYearsToPayOut] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [payoutDate, setPayoutDate] = useState<Date>()
  const [remarks, setRemarks] = useState<string>("")

  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId)
      setSelectedEmployee(employee || null)
    } else {
      setSelectedEmployee(null)
    }
  }, [selectedEmployeeId])

  const totalYearsOfService = selectedEmployee ? calculateYearsOfService(selectedEmployee.startDate) : 0
  const remainingYears = selectedEmployee ? Math.max(0, totalYearsOfService - selectedEmployee.claimedYears) : 0

  const handleSubmit = () => {
    if (!selectedEmployee || !yearsToPayOut || !payoutDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const yearsNum = parseInt(yearsToPayOut)
    if (yearsNum > remainingYears) {
      toast({
        title: "Error",
        description: "Cannot claim more years than available",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Success",
      description: `Pay advancement recorded for ${selectedEmployee.name}`,
    })

    handleReset()
  }

  const handleReset = () => {
    setSelectedEmployeeId("")
    setSelectedEmployee(null)
    setYearsToPayOut("")
    setAmount("")
    setPayoutDate(undefined)
    setRemarks("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Pay Advancement Request</h1>
        <p className="text-muted-foreground">Process service-based pay advancement for employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pay Advancement Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employee">Select Employee *</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployee && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input value={formatDate(selectedEmployee.startDate)} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Years of Service</Label>
                      <Input value={`${totalYearsOfService} years`} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Years Already Claimed</Label>
                      <Input value={`${selectedEmployee.claimedYears} years`} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Remaining Years Available</Label>
                      <Input 
                        value={`${remainingYears} years`} 
                        disabled 
                        className={remainingYears === 0 ? "text-destructive" : "text-primary font-medium"}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium text-foreground">Advancement Request Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="years">Years to be Paid Out *</Label>
                        <Input
                          id="years"
                          type="number"
                          value={yearsToPayOut}
                          onChange={(e) => setYearsToPayOut(e.target.value)}
                          max={remainingYears}
                          min="1"
                          placeholder="Enter years..."
                        />
                        {parseInt(yearsToPayOut) > remainingYears && (
                          <p className="text-sm text-destructive">Cannot exceed {remainingYears} available years</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Equivalent Amount (₱)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Payout *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !payoutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {payoutDate ? format(payoutDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={payoutDate}
                            onSelect={setPayoutDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter any additional remarks..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                      Record Pay Advancement
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Form
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Eligibility Rules:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Employee must have unclaimed service years</li>
                  <li>• Cannot exceed total years of service</li>
                  <li>• Active employment status required</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Process:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Select employee from dropdown</li>
                  <li>• Review service calculations</li>
                  <li>• Enter advancement details</li>
                  <li>• Submit for processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}