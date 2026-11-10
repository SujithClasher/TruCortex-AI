/**
 * TruCortex AI - Seed Data & Simulation Knowledge Base
 * Team Credit Cortex | TransUnion CIBIL
 *
 * NOTE: CV CMR = CreditVision® CIBIL Commercial Rank
 */

const SEED_USERS = [
  {
    id: "ananya",
    name: "Ananya Rao",
    email: "ananya.rao@cibil-demo.com",
    role: "Product Analyst",
    initials: "AR",
    color: "#00A6CA",
    accessLevels: ["General", "Internal", "Product-only"],
    canApprove: false,
    department: "Product Management",
    sampleQuestions: [
      "Explain the mathematical weights in CreditVision CMR Scoring Methodology.",
      "What is the rank scale defined in CreditVision CIBIL Commercial Rank v3.2?",
      "Show me the conflict between CreditVision CMR v3.2 and Validation Rules v2.1."
    ]
  },
  {
    id: "priya",
    name: "Priya Nair",
    email: "priya.nair@cibil-demo.com",
    role: "Sales Executive",
    initials: "PN",
    color: "#F2C94C",
    accessLevels: ["General", "Internal"],
    canApprove: false,
    department: "Commercial Sales",
    sampleQuestions: [
      "Which CV CMR pitch is approved, and can I share the rank scale?",
      "What is the rank scale in CreditVision CIBIL Commercial Rank Sales Deck?",
      "Show me internal formula weights in CreditVision CMR Methodology." // Triggers RESTRICTED ACCESS!
    ]
  },
  {
    id: "rohan",
    name: "Rohan Mehta",
    email: "rohan.mehta@cibil-demo.com",
    role: "UAT Tester",
    initials: "RM",
    color: "#0876B9",
    accessLevels: ["General", "Internal", "Technical"],
    canApprove: false,
    department: "Quality Engineering & UAT",
    sampleQuestions: [
      "What is the DPD threshold change in SHG CIR Technical Spec v5.0?",
      "Which UAT test cases fail due to the SHG_GROUP_ID schema change?",
      "What validation rule conflicts exist for the 6-month vs 12-month tradeline requirement?"
    ]
  },
  {
    id: "vikram",
    name: "Vikram Shah",
    email: "vikram.shah@cibil-demo.com",
    role: "Product Manager",
    initials: "VS",
    color: "#0B5A6B",
    accessLevels: ["General", "Internal", "Product-only", "Technical", "Approver"],
    canApprove: true,
    department: "Enterprise Credit Solutions",
    sampleQuestions: [
      "Give me an executive summary of SHG CIR Spec v5.0 impact across departments.",
      "What documents are affected by reducing DPD from 90 to 60 days?",
      "Review open conflicts between CreditVision CMR v3.2 and legacy v2.9."
    ]
  }
];

const SIMULATED_MODELS = {
  "qwen-3.5-2b-q4": {
    id: "qwen-3.5-2b-q4",
    name: "Qwen3.5-2B Q4_K_M",
    tokensPerSec: 28,
    ram: "1.4 GB",
    loadTime: 0.6,
    qualityScore: "94.2%",
    description: "Quantized ultra-fast local edge model, optimized for low-latency retrieval & high concurrency."
  },
  "qwen-3.5-2b-q5": {
    id: "qwen-3.5-2b-q5",
    name: "Qwen3.5-2B Q5_K_M",
    tokensPerSec: 24,
    ram: "1.8 GB",
    loadTime: 0.8,
    qualityScore: "96.8%",
    description: "Balanced precision quantized model with enhanced lexical semantic alignment across financial specs."
  },
  "qwen-2.5-coder-3b": {
    id: "qwen-2.5-coder-3b",
    name: "Qwen2.5-Coder-3B Q4_K_M",
    tokensPerSec: 19,
    ram: "2.2 GB",
    loadTime: 1.1,
    qualityScore: "97.5%",
    description: "Code and schema-specialized LLM for structured API payloads, diff verification & UAT trace analysis."
  }
};

const SEED_DOCUMENTS = [
  {
    id: "DOC-CMR-32",
    code: "CMR-SPEC-3.2",
    title: "CreditVision CIBIL Commercial Rank (CMR) Overview v3.2",
    category: "CreditVision & Commercial Risk",
    version: "v3.2",
    status: "Approved",
    accessLevel: "Internal",
    owner: "Vikram Shah",
    updatedDate: "2024-09-15",
    fileSize: "2.8 MB",
    fileType: "PDF",
    summary: "Comprehensive commercial product specification for CreditVision CIBIL Commercial Rank (CMR), introducing standardized 1-10 risk ranking scale and 12-month trended tradeline seasoning criteria.",
    linkedDocIds: ["DOC-CMR-29", "DOC-CMR-METH", "DOC-CMR-VAL", "DOC-CMR-PITCH"],
    snippets: [
      {
        slide: 8,
        title: "CreditVision Commercial Rank (CMR) Scale Definition",
        content: "CreditVision CIBIL Commercial Rank (CMR) utilizes a standardized 1 to 10 tier classification scale. Tier 1 indicates the lowest probability of default (prime commercial enterprises), while Tier 10 indicates the highest default risk (distressed commercial borrowers).",
        tags: ["CreditVision", "CMR", "rank scale", "scoring", "tier 1-10"]
      },
      {
        slide: 12,
        title: "Minimum Bureau Trended History Requirement",
        content: "A minimum of 12 consecutive months of reported commercial credit history across formal banking institutions is mandatory to generate a definitive CreditVision CIBIL Commercial Rank.",
        tags: ["trended data", "seasoning", "12 months", "CreditVision", "eligibility"]
      },
      {
        slide: 19,
        title: "Commercial Segment Matrices",
        content: "Covers Micro, Small, Medium, and Mid-Corporate borrowing entities utilizing CreditVision trended algorithms that analyze past repayment velocity, credit limit utilization, and enquiry momentum.",
        tags: ["CreditVision", "MSME", "trended algorithms"]
      }
    ]
  },
  {
    id: "DOC-CMR-29",
    code: "CMR-SPEC-2.9",
    title: "CreditVision CIBIL Commercial Rank (CMR) Overview v2.9",
    category: "CreditVision & Commercial Risk",
    version: "v2.9",
    status: "Superseded",
    accessLevel: "Internal",
    owner: "Vikram Shah",
    updatedDate: "2023-04-10",
    fileSize: "2.4 MB",
    fileType: "PDF",
    summary: "Legacy specification for CreditVision CMR containing obsolete 1 to 5 scale definitions. Retained for historical tradeline audit and transition reconciliation.",
    linkedDocIds: ["DOC-CMR-32"],
    snippets: [
      {
        slide: 6,
        title: "Legacy Rank Scale (OBSOLETE 1-5)",
        content: "The legacy Commercial Rank risk tier utilized a 1 to 5 scale, where Rank 1 represented high confidence and Rank 5 denoted subprime asset quality.",
        tags: ["legacy", "rank scale", "1-5", "outdated copy"]
      }
    ]
  },
  {
    id: "DOC-CMR-PITCH",
    code: "CMR-SLS-1.4",
    title: "CreditVision CMR Sales Pitch Deck v1.4",
    category: "Commercial Sales",
    version: "v1.4",
    status: "Approved",
    accessLevel: "General",
    owner: "Priya Nair",
    updatedDate: "2024-06-20",
    fileSize: "5.1 MB",
    fileType: "PPTX",
    summary: "External client presentation deck for commercial banks, NBFCs, and financial institutions highlighting CreditVision predictive accuracy, trended data analytics, and 1-10 risk segmentation.",
    linkedDocIds: ["DOC-CMR-32"],
    snippets: [
      {
        slide: 4,
        title: "CreditVision Value Proposition for Commercial Lenders",
        content: "Enables corporate and MSME lenders to unlock automated credit decisions for enterprises with at least 12 months of bureau exposure, sorting applicants across 10 granular CreditVision risk tiers.",
        tags: ["commercial", "sales", "underwriting", "10 tiers", "CreditVision"]
      }
    ]
  },
  {
    id: "DOC-CMR-METH",
    code: "CMR-METH-0.9",
    title: "CreditVision CMR Scoring Methodology",
    category: "Data Science & Risk",
    version: "v4.1",
    status: "Approved",
    accessLevel: "Product-only",
    owner: "Ananya Rao",
    updatedDate: "2024-08-01",
    fileSize: "1.9 MB",
    fileType: "DOCX",
    summary: "CONFIDENTIAL algorithm architecture, trended feature importance weights, gradient boosting hyperparameters, and proprietary default odds tables for CreditVision CMR.",
    linkedDocIds: ["DOC-CMR-32"],
    snippets: [
      {
        slide: 14,
        title: "Mathematical Feature Weights (Trended CreditVision)",
        content: "CreditVision CMR Feature Weights: Tradeline Repayment Trend Velocity (38.5%), Working Capital Limit Utilization Dynamics (26.2%), Debt Service Coverage Ratio from GST filings (19.8%), Commercial Enquiry Velocity (15.5%). Gradient boosting ensemble trained on 1.4M commercial contracts.",
        tags: ["weights", "formula", "algorithm", "confidential", "product-only", "CreditVision"]
      },
      {
        slide: 22,
        title: "Score Calibration & Odds Curves",
        content: "Bad definition calibrated at 90+ DPD within 12 months performance window. Tier 1 bad rate < 0.8%; Tier 10 bad rate > 42.6%.",
        tags: ["calibration", "odds", "bad rate", "CMR"]
      }
    ]
  },
  {
    id: "DOC-CMR-VAL",
    code: "CMR-VAL-2.1",
    title: "CreditVision CMR Validation Rules v2.1",
    category: "Technical Architecture",
    version: "v2.1",
    status: "Approved",
    accessLevel: "Technical",
    owner: "Rohan Mehta",
    updatedDate: "2024-05-12",
    fileSize: "1.1 MB",
    fileType: "PDF",
    summary: "Integration validation specification and input schema rules implemented on the CIBIL API Gateway for CreditVision CIBIL Commercial Rank evaluation.",
    linkedDocIds: ["DOC-CMR-32"],
    snippets: [
      {
        slide: 9,
        title: "Tradeline History Validation Rule (CONFLICT)",
        content: "Rule VALIDATE_TR_HIST_04: Commercial applicants with at least 6 months of active tradeline history will be eligible for preliminary CreditVision score generation, subject to minimum 2 active trade lines.",
        tags: ["validation", "6 months", "conflict", "CreditVision"]
      }
    ]
  },
  {
    id: "DOC-SHG-40",
    code: "SHG-TECH-4.0",
    title: "SHG CIR Technical Spec v4.0",
    category: "Microfinance & SHG",
    version: "v4.0",
    status: "Approved",
    accessLevel: "Technical",
    owner: "Vikram Shah",
    updatedDate: "2024-01-10",
    fileSize: "3.4 MB",
    fileType: "PDF",
    summary: "Baseline technical schema for Self Help Group (SHG) Comprehensive Information Report (CIR), operating under 90-day delinquency threshold and legacy JSON format.",
    linkedDocIds: ["DOC-SHG-TRN", "DOC-SHG-SOP", "DOC-SHG-ATTR", "DOC-SHG-UAT"],
    snippets: [
      {
        slide: 15,
        title: "Delinquency Classification Logic (v4.0)",
        content: "Under v4.0 specification, an SHG account is classified as Delinquent when Days Past Due (DPD) exceeds 90 days. Accounts with 1-89 DPD are categorized as Regular Watchlist.",
        tags: ["DPD", "90 days", "delinquency", "classification"]
      },
      {
        slide: 28,
        title: "Member Account Payload Schema",
        content: "Payload contains SHG_MEMBER_ID, AADHAAR_REF, LOAN_ACC_NUM, CURRENT_BALANCE, OVERDUE_AMOUNT. Group linkage inferred via secondary batch reconciliation file.",
        tags: ["payload", "schema", "fields"]
      }
    ]
  },
  {
    id: "DOC-SHG-50",
    code: "SHG-TECH-5.0",
    title: "SHG CIR Technical Spec v5.0",
    category: "Microfinance & SHG",
    version: "v5.0",
    status: "Pending Approval",
    accessLevel: "Technical",
    owner: "Vikram Shah",
    updatedDate: "2024-10-24",
    fileSize: "3.9 MB",
    fileType: "PDF",
    summary: "Major regulatory revision reducing DPD threshold from 90 to 60 days, introducing mandatory SHG_GROUP_ID, and expanding batch payload concurrency to 50k records.",
    linkedDocIds: ["DOC-SHG-40", "DOC-SHG-TRN", "DOC-SHG-SOP", "DOC-SHG-ATTR", "DOC-SHG-UAT"],
    snippets: [
      {
        slide: 14,
        title: "Updated DPD Threshold (60 Days)",
        content: "In accordance with RBI Microfinance Master Directions 2024, the delinquency milestone is revised: DPD threshold is strictly reduced from 90 days to 60 days. Any SHG contract >= 60 DPD is flagged as Sub-Standard Asset.",
        tags: ["DPD", "60 days", "regulatory", "RBI"]
      },
      {
        slide: 22,
        title: "Mandatory SHG_GROUP_ID Field Definition",
        content: "Field SHG_GROUP_ID (Type: String, Length: 16, Regex: ^SHG[0-9]{13}$) is now MANDATORY in the primary member payload. Submissions omitting SHG_GROUP_ID will be rejected with HTTP 422 Unprocessable Entity (ERR_SHG_INVALID_GRP).",
        tags: ["SHG_GROUP_ID", "mandatory", "schema", "API"]
      },
      {
        slide: 31,
        title: "Batch Processing Throughput",
        content: "Batch API endpoint /api/v2/shg/batch accepts up to 50,000 member records per payload with GZIP compression required for payloads exceeding 5 MB.",
        tags: ["batch", "50000", "performance"]
      }
    ]
  },
  {
    id: "DOC-SHG-TRN",
    code: "SHG-LND-4.0",
    title: "SHG CIR Training Module v4.0",
    category: "Learning & Development",
    version: "v4.0",
    status: "Approved",
    accessLevel: "Internal",
    owner: "Neha Verma",
    updatedDate: "2024-02-15",
    fileSize: "8.2 MB",
    fileType: "PPTX",
    summary: "Internal field operational training module for credit assessment officers, training them on 90-day overdue escalation protocols.",
    linkedDocIds: ["DOC-SHG-40"],
    snippets: [
      {
        slide: 24,
        title: "Field Officer Remediation Cycle",
        content: "Field officers should initiate formal collection recovery proceedings when group accounts breach the 90-day DPD milestone. Warning notices are sent at 30 and 60 days.",
        tags: ["training", "90 days", "field officer", "collections"]
      }
    ]
  },
  {
    id: "DOC-SHG-SOP",
    code: "SHG-OPS-3.0",
    title: "Report-Handling SOP v3.0",
    category: "Operations",
    version: "v3.0",
    status: "Approved",
    accessLevel: "Internal",
    owner: "Rajesh Kumar",
    updatedDate: "2024-03-01",
    fileSize: "1.7 MB",
    fileType: "PDF",
    summary: "Standard Operating Procedure for TransUnion CIBIL Operations team handling manual SHG report disputes, bank escalations, and overdue corrections.",
    linkedDocIds: ["DOC-SHG-40"],
    snippets: [
      {
        slide: 11,
        title: "Escalation Matrix for Delinquent Files",
        content: "Tier-2 Operations manual review is automatically triggered when an SHG institution disputes a 90+ DPD flag reported by member credit institutions.",
        tags: ["SOP", "operations", "90 DPD", "escalation"]
      }
    ]
  },
  {
    id: "DOC-SHG-ATTR",
    code: "SHG-ATTR-2.4",
    title: "Attribute List & Data Dictionary",
    category: "Technical Architecture",
    version: "v2.4",
    status: "Approved",
    accessLevel: "Technical",
    owner: "Rohan Mehta",
    updatedDate: "2024-01-20",
    fileSize: "4.2 MB",
    fileType: "XLSX",
    summary: "Comprehensive master data dictionary listing all 148 bureau input attributes, validation masks, and database column mappings.",
    linkedDocIds: ["DOC-SHG-40"],
    snippets: [
      {
        slide: 4,
        title: "SHG Domain Attributes (Missing SHG_GROUP_ID)",
        content: "Lists 42 active SHG attributes including SHG_MEMBER_ID, SHG_PINCODE, LOAN_CYCLE_NUM, GROUP_NAME. Does not currently contain the SHG_GROUP_ID column definition.",
        tags: ["data dictionary", "attributes", "schema", "technical"]
      }
    ]
  },
  {
    id: "DOC-SHG-UAT",
    code: "SHG-UAT-4.0",
    title: "UAT Test Cases SHG CIR v4.0",
    category: "Quality Engineering & UAT",
    version: "v4.0",
    status: "Approved",
    accessLevel: "Technical",
    owner: "Rohan Mehta",
    updatedDate: "2024-02-01",
    fileSize: "2.1 MB",
    fileType: "XLSX",
    summary: "Official test suite containing 216 automated and manual test scenarios validating SHG report generation and scoring algorithms.",
    linkedDocIds: ["DOC-SHG-40"],
    snippets: [
      {
        slide: 18,
        title: "Test Case TC_SHG_088: Delinquency Boundary",
        content: "Asserts that accounts with DPD between 61 and 89 remain in 'Watchlist' and do not generate sub-standard asset alerts. Expected outcome: PASS for 89 days, FAIL only at >= 90 days.",
        tags: ["test case", "TC_SHG_088", "UAT", "90 days"]
      },
      {
        slide: 22,
        title: "Test Case TC_SHG_104: Ingestion Without Group ID",
        content: "Asserts that batch payloads without SHG_GROUP_ID are accepted with HTTP 200 OK and assigned synthetic group hash during nocturnal ETL.",
        tags: ["test case", "TC_SHG_104", "UAT", "payload"]
      }
    ]
  },
  {
    id: "DOC-GOV-20",
    code: "GOV-POL-2.0",
    title: "Approval Governance Policy v2.0",
    category: "Legal & Governance",
    version: "v2.0",
    status: "Approved",
    accessLevel: "General",
    owner: "Legal & Compliance",
    updatedDate: "2024-07-10",
    fileSize: "1.3 MB",
    fileType: "PDF",
    summary: "Standard governance protocol mandating 2 working days SLA for cross-functional approval of regulatory specification changes affecting external partners.",
    linkedDocIds: [],
    snippets: [
      {
        slide: 7,
        title: "Cross-Functional Approval SLA",
        content: "All Level-1 and Level-2 technical revisions that alter data ingestion schemas or risk classification milestones require formal sign-off within an SLA of 2 working days by designated Product Managers.",
        tags: ["governance", "SLA", "2 working days", "compliance"]
      }
    ]
  }
];

const SEED_IMPACT_RADAR = {
  sourceDocId: "DOC-SHG-50",
  sourceDocTitle: "SHG CIR Technical Spec v5.0",
  sourceDocVersion: "v5.0",
  baselineDocVersion: "v4.0",
  owner: "Vikram Shah",
  changesSummary: [
    {
      field: "DPD Threshold",
      oldValue: "90 Days Past Due",
      newValue: "60 Days Past Due",
      type: "Policy / Threshold",
      criticality: "High"
    },
    {
      field: "SHG_GROUP_ID",
      oldValue: "Optional / Inferred via ETL",
      newValue: "Mandatory Payload Field (CHAR16)",
      type: "Schema / Contract",
      criticality: "High"
    },
    {
      field: "Batch Concurrency",
      oldValue: "10,000 records max",
      newValue: "50,000 records max (GZIP required)",
      type: "Infrastructure",
      criticality: "Medium"
    }
  ],
  diffLines: [
    { line: 140, type: "normal", text: "  // Section 4.2 Delinquency State Machine" },
    { line: 141, type: "normal", text: "  const WATCHLIST_MIN_DAYS = 30;" },
    { line: 142, type: "delete", text: "- const DPD_THRESHOLD_DAYS = 90; // v4.0 Standard" },
    { line: 142, type: "insert", text: "+ const DPD_THRESHOLD_DAYS = 60; // v5.0 RBI Regulatory Mandate" },
    { line: 143, type: "normal", text: "  function classifyContract(dpd) {" },
    { line: 144, type: "delete", text: "-   return dpd >= 90 ? 'SUB_STANDARD' : 'STANDARD';" },
    { line: 144, type: "insert", text: "+   return dpd >= 60 ? 'SUB_STANDARD' : 'STANDARD';" },
    { line: 145, type: "normal", text: "  }" },
    { line: 188, type: "normal", text: "  // Payload Ingestion Validation Contract" },
    { line: 189, type: "insert", text: "+ MANDATORY_FIELD: SHG_GROUP_ID (CHAR16, Regex: ^SHG[0-9]{13}$)" },
    { line: 190, type: "insert", text: "+ REJECT_ON_ABSENCE: HTTP 422 ERR_SHG_INVALID_GRP" },
    { line: 204, type: "normal", text: "  // Batch Gateway Tuning" },
    { line: 205, type: "delete", text: "- BATCH_MAX_SIZE = 10000;" },
    { line: 205, type: "insert", text: "+ BATCH_MAX_SIZE = 50000; // Requires Content-Encoding: gzip" }
  ],
  affectedDocs: [
    {
      docId: "DOC-SHG-TRN",
      docTitle: "SHG CIR Training Module v4.0",
      shortTitle: "SHG Training",
      owner: "Neha Verma (L&D)",
      department: "L&D",
      severity: "High",
      severityColor: "#C0504D",
      angle: 35,
      distance: 145,
      reason: "Module 4 and Slide 24 instruct field recovery agents to begin delinquency outreach at 90 days. Must update curriculum to 60 days.",
      status: "Pending",
      acknowledged: false
    },
    {
      docId: "DOC-SHG-ATTR",
      docTitle: "Attribute List & Data Dictionary",
      shortTitle: "Attribute Master",
      owner: "Rohan Mehta (Tech)",
      department: "Technical",
      severity: "High",
      severityColor: "#C0504D",
      angle: 110,
      distance: 175,
      reason: "Missing column definition and validation regex for new mandatory field SHG_GROUP_ID. Database staging tables will drop payloads without DDL migration.",
      status: "Pending",
      acknowledged: false
    },
    {
      docId: "DOC-SHG-UAT",
      docTitle: "UAT Test Cases SHG CIR v4.0",
      shortTitle: "UAT Test Cases",
      owner: "Rohan Mehta (UAT)",
      department: "UAT",
      severity: "High",
      severityColor: "#C0504D",
      angle: 190,
      distance: 160,
      reason: "Test Case TC_SHG_088 asserts 90 DPD boundary and will throw false regression failures. TC_SHG_104 asserts ingestion without group ID which now returns HTTP 422.",
      status: "Pending",
      acknowledged: true
    },
    {
      docId: "DOC-SHG-SOP",
      docTitle: "Report-Handling SOP v3.0",
      shortTitle: "Operations SOP",
      owner: "Rajesh Kumar (Ops)",
      department: "Ops",
      severity: "Medium",
      severityColor: "#F2C94C",
      angle: 275,
      distance: 135,
      reason: "Manual dispute escalation workflow triggers when DPD exceeds 90 days. Operations teams must align internal queue triggers to 60 DPD to prevent backlog surge.",
      status: "Confirmed",
      acknowledged: true
    },
    {
      docId: "DOC-CMR-PITCH",
      docTitle: "CreditVision CMR Sales Deck v1.4",
      shortTitle: "CreditVision CMR",
      owner: "Priya Nair (Sales)",
      department: "Sales",
      severity: "Low",
      severityColor: "#00A6CA",
      angle: 330,
      distance: 185,
      reason: "CreditVision CIBIL Commercial Rank marketing collateral references delinquency monitoring horizon alignment with RBI guidelines. Low priority copy refresh required.",
      status: "Dismissed",
      acknowledged: true
    }
  ]
};

const SEED_CONFLICT_RADAR = [
  {
    id: "CONF-001",
    key: "CreditVision CMR Commercial Rank Scale",
    category: "Scoring Metric",
    docA: {
      title: "CreditVision CMR Product Overview v3.2",
      version: "v3.2",
      slide: "Slide 8",
      owner: "Vikram Shah",
      value: "Standardized 1-10 Granular Risk Tier Scale (Tier 1 = Lowest Risk, Tier 10 = Highest Default Probability)",
      status: "Approved",
      badge: "Current Standard"
    },
    docB: {
      title: "CreditVision CMR Product Overview v2.9",
      version: "v2.9",
      slide: "Slide 6",
      owner: "Vikram Shah",
      value: "Legacy 1-5 Risk Tier Scale (Tier 1 = Low Risk, Tier 5 = High Risk)",
      status: "Superseded",
      badge: "Outdated Copy"
    },
    explanation: "v3.2 transitioned CreditVision CIBIL Commercial Rank from a 5-bucket rank to an industry-standard 10-tier distribution. Legacy v2.9 documents in circulation amongst regional partner institutions cause integration confusion regarding tier boundaries.",
    resolutionRecommendation: "Archive v2.9 from partner portal, issue automated deprecation advisory, and map old 1-5 tiers to 1-10 equivalence in API transformation layer.",
    status: "Active"
  },
  {
    id: "CONF-002",
    key: "CreditVision Trended Seasoning Requirement",
    category: "Underwriting Policy",
    docA: {
      title: "CreditVision CMR Product Overview v3.2",
      version: "v3.2",
      slide: "Slide 12",
      owner: "Vikram Shah",
      value: "Strict minimum of 12 consecutive months of commercial bureau repayment history required for score computation",
      status: "Approved",
      badge: "Product Spec"
    },
    docB: {
      title: "CreditVision CMR Validation Rules v2.1",
      version: "v2.1",
      slide: "Section 3.4",
      owner: "Rohan Mehta",
      value: "Rule VALIDATE_TR_HIST_04 permits preliminary score evaluation with only 6 months of active tradeline history",
      status: "Approved",
      badge: "Gateway Conflict"
    },
    explanation: "Product Overview document mandates a conservative 12-month trended seasoning threshold to prevent thin-file volatility, but API Gateway validation logic v2.1 was deployed with an experimental 6-month threshold for fast-track fintech lenders.",
    resolutionRecommendation: "Align API validation rule to require 12 months for standard commercial portfolios, or introduce explicit 'CreditVision-Thin-File' product code for 6-month applicants.",
    status: "Active"
  },
  {
    id: "CONF-003",
    key: "SHG Delinquency Threshold Recognition",
    category: "Regulatory Compliance",
    docA: {
      title: "SHG CIR Technical Spec v5.0",
      version: "v5.0",
      slide: "Section 4.2",
      owner: "Vikram Shah",
      value: "Delinquent default milestone recognized immediately upon reaching 60+ Days Past Due (DPD)",
      status: "Pending Approval",
      badge: "RBI Directive 2024"
    },
    docB: {
      title: "SHG CIR Training Module v4.0",
      version: "v4.0",
      slide: "Slide 24",
      owner: "Neha Verma",
      value: "Delinquency default milestone classified only upon breaching 90+ Days Past Due (DPD)",
      status: "Approved",
      badge: "Training Outdated"
    },
    explanation: "Operations and training documentation have not caught up to the upcoming RBI regulatory transition. Field recovery officers operating under v4.0 training are delaying group interventions by a full 30 days.",
    resolutionRecommendation: "Publish emergency update bulletin to Learning & Development, push notification to all certified trainers, and update LMS courseware before v5.0 goes live.",
    status: "Active"
  }
];

const SEED_BENCHMARKS = [
  {
    id: "BM-01",
    query: "What is the DPD threshold difference between SHG CIR v4.0 and v5.0?",
    category: "Regulatory Schema",
    expectedAnswer: "v4.0 uses 90 days; v5.0 reduces it to 60 days.",
    results: {
      "qwen-3.5-2b-q4": { ttft: "420 ms", tps: "28.4 tok/s", memory: "1.38 GB", accuracy: "98.2%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "580 ms", tps: "24.1 tok/s", memory: "1.79 GB", accuracy: "99.1%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "760 ms", tps: "19.3 tok/s", memory: "2.18 GB", accuracy: "99.5%", status: "PASS" }
    }
  },
  {
    id: "BM-02",
    query: "State the mandatory validation regex for SHG_GROUP_ID in v5.0.",
    category: "Schema Verification",
    expectedAnswer: "^SHG[0-9]{13}$ (16 alphanumeric characters starting with SHG).",
    results: {
      "qwen-3.5-2b-q4": { ttft: "480 ms", tps: "27.8 tok/s", memory: "1.41 GB", accuracy: "95.4%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "620 ms", tps: "23.9 tok/s", memory: "1.81 GB", accuracy: "98.0%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "710 ms", tps: "19.8 tok/s", memory: "2.22 GB", accuracy: "100.0%", status: "PASS" }
    }
  },
  {
    id: "BM-03",
    query: "Explain the conflict between CreditVision CMR Overview v3.2 and Validation Rules v2.1.",
    category: "Conflict Detection",
    expectedAnswer: "12-month tradeline requirement in v3.2 vs 6-month in v2.1.",
    results: {
      "qwen-3.5-2b-q4": { ttft: "510 ms", tps: "28.1 tok/s", memory: "1.39 GB", accuracy: "94.8%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "650 ms", tps: "24.5 tok/s", memory: "1.80 GB", accuracy: "97.4%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "820 ms", tps: "18.9 tok/s", memory: "2.19 GB", accuracy: "98.8%", status: "PASS" }
    }
  },
  {
    id: "BM-04",
    query: "What are the algorithm feature weights for CreditVision CMR Scoring Methodology?",
    category: "RBAC & Role Gate",
    expectedAnswer: "Product-only access restriction check enforced. Block non-authorized queries.",
    results: {
      "qwen-3.5-2b-q4": { ttft: "390 ms", tps: "29.2 tok/s", memory: "1.37 GB", accuracy: "100.0%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "510 ms", tps: "25.0 tok/s", memory: "1.78 GB", accuracy: "100.0%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "690 ms", tps: "19.5 tok/s", memory: "2.17 GB", accuracy: "100.0%", status: "PASS" }
    }
  },
  {
    id: "BM-05",
    query: "List the affected documents when SHG Technical Spec is updated to v5.0.",
    category: "Impact Traceability",
    expectedAnswer: "Training Module, Attribute List, UAT Test Cases, Report SOP, CreditVision Sales Deck.",
    results: {
      "qwen-3.5-2b-q4": { ttft: "490 ms", tps: "27.9 tok/s", memory: "1.40 GB", accuracy: "96.5%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "640 ms", tps: "24.2 tok/s", memory: "1.82 GB", accuracy: "98.9%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "800 ms", tps: "19.1 tok/s", memory: "2.20 GB", accuracy: "99.4%", status: "PASS" }
    }
  },
  {
    id: "BM-06",
    query: "What is the cross-functional approval SLA defined in Governance Policy v2.0?",
    category: "SLA Policy Retrieval",
    expectedAnswer: "2 working days SLA for cross-functional approval by Product Managers.",
    results: {
      "qwen-3.5-2b-q4": { ttft: "410 ms", tps: "28.7 tok/s", memory: "1.38 GB", accuracy: "99.0%", status: "PASS" },
      "qwen-3.5-2b-q5": { ttft: "560 ms", tps: "24.6 tok/s", memory: "1.79 GB", accuracy: "100.0%", status: "PASS" },
      "qwen-2.5-coder-3b": { ttft: "730 ms", tps: "19.4 tok/s", memory: "2.18 GB", accuracy: "99.8%", status: "PASS" }
    }
  }
];

const SEED_AUDIT_LOGS = [
  {
    id: "AUD-1001",
    timestamp: "2024-10-24 09:15:22",
    tag: "AUTH",
    actor: "Vikram Shah",
    role: "Product Manager",
    action: "User SSO Authentication Successful",
    details: "Authenticated via Microsoft Entra ID (vikram.shah@cibil-demo.com) with MFA validation.",
    level: "INFO"
  },
  {
    id: "AUD-1002",
    timestamp: "2024-10-24 09:22:11",
    tag: "UPLOAD",
    actor: "Vikram Shah",
    role: "Product Manager",
    action: "Document Draft Ingestion Initiated",
    details: "Staged 'SHG CIR Technical Spec v5.0' (3.9 MB). Entity extraction & vector parsing initiated.",
    level: "INFO"
  },
  {
    id: "AUD-1003",
    timestamp: "2024-10-24 09:22:16",
    tag: "RADAR",
    actor: "System Engine",
    role: "TruCortex Core",
    action: "Change Impact Radar Computed",
    details: "Detected 5 affected documents (3 High, 1 Medium, 1 Low). Delta: DPD 90->60 days, SHG_GROUP_ID.",
    level: "INFO"
  },
  {
    id: "AUD-1004",
    timestamp: "2024-10-24 09:22:17",
    tag: "CONFLICT",
    actor: "System Engine",
    role: "TruCortex Core",
    action: "Conflict Analysis Completed",
    details: "Flagged active policy discrepancy with SHG CIR Training Module v4.0 (DPD 90 vs 60 days).",
    level: "WARN"
  },
  {
    id: "AUD-1005",
    timestamp: "2024-10-24 10:05:43",
    tag: "ACCESS",
    actor: "Priya Nair",
    role: "Sales Executive",
    action: "RBAC Security Gate Blocked Query",
    details: "Attempted retrieval on 'CreditVision CMR Scoring Methodology' containing [Product-only] mathematical weights. Access denied.",
    level: "ERROR"
  },
  {
    id: "AUD-1006",
    timestamp: "2024-10-24 10:14:30",
    tag: "NOTIFY",
    actor: "System Notification Hub",
    role: "Broadcast Service",
    action: "Targeted Impact Notification Dispatched",
    details: "Sent individualized review notices to 4 stakeholder teams for SHG Spec v5.0 release.",
    level: "INFO"
  },
  {
    id: "AUD-1007",
    timestamp: "2024-10-24 10:28:19",
    tag: "ACK",
    actor: "Rohan Mehta",
    role: "UAT Tester",
    action: "Impact Assessment Acknowledged",
    details: "Acknowledged high severity impact on UAT Test Cases SHG CIR v4.0. Assigned JIRA defect DEF-8812.",
    level: "INFO"
  }
];

// Export to window
window.SEED_USERS = SEED_USERS;
window.SIMULATED_MODELS = SIMULATED_MODELS;
window.SEED_DOCUMENTS = SEED_DOCUMENTS;
window.SEED_IMPACT_RADAR = SEED_IMPACT_RADAR;
window.SEED_CONFLICT_RADAR = SEED_CONFLICT_RADAR;
window.SEED_BENCHMARKS = SEED_BENCHMARKS;
window.SEED_AUDIT_LOGS = SEED_AUDIT_LOGS;
