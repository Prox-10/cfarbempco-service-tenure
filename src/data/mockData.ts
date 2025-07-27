export interface Employee {
  id: string
  name: string
  department: string
  startDate: string
  status: 'Active' | 'Inactive'
  claimedYears: number
}

export interface PayAdvancement {
  id: string
  employeeId: string
  employeeName: string
  yearsClaimed: number
  date: string
  amount?: number
  remarks: string
}

export const employees: Employee[] = [
  {
    id: "1",
    name: "John Santos",
    department: "Administration",
    startDate: "2004-08-15",
    status: "Active",
    claimedYears: 10
  },
  {
    id: "2",
    name: "Maria Garcia",
    department: "Finance",
    startDate: "2008-03-22",
    status: "Active",
    claimedYears: 5
  },
  {
    id: "3",
    name: "Carlos Mendoza",
    department: "Operations",
    startDate: "2010-11-10",
    status: "Active",
    claimedYears: 0
  },
  {
    id: "4",
    name: "Ana Rodriguez",
    department: "Human Resources",
    startDate: "2012-06-05",
    status: "Active",
    claimedYears: 3
  },
  {
    id: "5",
    name: "Roberto Cruz",
    department: "IT Department",
    startDate: "2015-01-20",
    status: "Active",
    claimedYears: 2
  },
  {
    id: "6",
    name: "Linda Flores",
    department: "Marketing",
    startDate: "2018-09-12",
    status: "Active",
    claimedYears: 0
  }
]

export const payAdvancements: PayAdvancement[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Santos",
    yearsClaimed: 10,
    date: "2024-12-01",
    amount: 50000,
    remarks: "10-year service pay advancement requested"
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Maria Garcia",
    yearsClaimed: 5,
    date: "2024-10-15",
    amount: 25000,
    remarks: "5-year service milestone payout"
  },
  {
    id: "3",
    employeeId: "4",
    employeeName: "Ana Rodriguez",
    yearsClaimed: 3,
    date: "2024-08-20",
    amount: 15000,
    remarks: "Early career advancement"
  },
  {
    id: "4",
    employeeId: "5",
    employeeName: "Roberto Cruz",
    yearsClaimed: 2,
    date: "2024-07-10",
    amount: 10000,
    remarks: "Technical career development fund"
  }
]