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
  work_location?: string | null;
  pay_frequency?: "monthly" | "biweekly" | "weekly" | "hourly" | null;
  engagement_type: "employee" | "intern";
  internship_paid: boolean;
  compensation_amount?: number | null;
  compensation_currency?: string | null;
  start_date?: string | null;
  last_working_date?: string | null;
  status: "pending" | "active" | "exited";
  workspace_account_status: "pending" | "created" | "manual";
  workflow_stage?: "screening_pending" | "approval_pending" | "approved" | "review_required";
  screening_consent?: boolean;
  screening_status?: "not_started" | "in_progress" | "clear" | "potential_match" | "unable_to_complete";
  screening_checks?: Array<{
    check_type: string;
    source_name: string;
    source_url: string;
    checked_at: string;
    checked_by?: string;
    outcome: "no_match" | "potential_match" | "unable_to_check" | "not_applicable";
    note?: string;
  }>;
  approval_status?: "not_requested" | "pending" | "approved" | "rejected";
  approval_by?: string | null;
  approval_at?: string | null;
  exit_request_status?: "not_requested" | "pending" | "approved" | "returned";
  exit_requested_by?: string | null;
  exit_requested_at?: string | null;
  exit_reviewed_by?: string | null;
  exit_reviewed_at?: string | null;
  exit_review_note?: string | null;
  exit_request_last_working_date?: string | null;
  created_at: string;
  updated_at: string;
};

export type Tab = "employees" | "screening" | "payroll" | "card" | "nda" | "offer" | "exit" | "promotion";

export type EmployeeForm = {
  full_name: string;
  employee_id: string;
  work_email: string;
  personal_email: string;
  linkedin_url: string;
  whatsapp_number: string;
  phone_number: string;
  role: string;
  work_location: string;
  screening_consent: boolean;
  pay_frequency: "monthly" | "biweekly" | "weekly" | "hourly";
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
  work_location: "",
  screening_consent: false,
  pay_frequency: "monthly",
  engagement_type: "employee",
  internship_paid: false,
  compensation_amount: "",
  compensation_currency: "SGD",
  start_date: ""
};
