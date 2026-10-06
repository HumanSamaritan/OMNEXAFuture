export type Employee = {
  id: string;
  employee_id: string;
  full_name: string;
  work_email: string;
  personal_email?: string | null;
  linkedin_url?: string | null;
  whatsapp_number?: string | null;
  phone_number?: string | null;
  role: string;
  engagement_type: "employee" | "intern";
  internship_paid: boolean;
  compensation_amount?: number | null;
  compensation_currency?: string | null;
  start_date?: string | null;
  last_working_date?: string | null;
  status: "active" | "exited";
  workspace_account_status: "pending" | "created" | "manual";
  created_at: string;
  updated_at: string;
};

export type Tab = "employees" | "card" | "nda" | "offer" | "exit" | "promotion";

export type EmployeeForm = {
  full_name: string;
  employee_id: string;
  work_email: string;
  personal_email: string;
  linkedin_url: string;
  whatsapp_number: string;
  phone_number: string;
  role: string;
  engagement_type: "employee" | "intern";
  internship_paid: boolean;
  compensation_amount: string;
  compensation_currency: string;
  start_date: string;
};

export const blankEmployee: EmployeeForm = {
  full_name: "",
  employee_id: "",
  work_email: "",
  personal_email: "",
  linkedin_url: "",
  whatsapp_number: "",
  phone_number: "",
  role: "",
  engagement_type: "employee",
  internship_paid: false,
  compensation_amount: "",
  compensation_currency: "SGD",
  start_date: ""
};
