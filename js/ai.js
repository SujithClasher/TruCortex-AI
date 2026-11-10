/**
 * TruCortex AI - Simulated AI Engine & Governed RAG Pipeline
 * Team Credit Cortex | TransUnion CIBIL
 *
 * NOTE: CV CMR = CreditVision® CIBIL Commercial Rank
 */

class TruCortexAIEngine {
  constructor() {
    this.currentModelId = "qwen-3.5-2b-q4";
    this.models = window.SIMULATED_MODELS;
    this.isStreaming = false;
    this.currentStreamInterval = null;

    // Intent dictionary mapping keywords & semantic patterns to verified answers
    this.intents = [
      {
        id: "INT-00",
        keywords: ["which cv cmr pitch is approved", "can i share the rank scale", "pitch is approved", "which pitch is approved", "which cv cmr pitch"],
        requiredAccess: "General",
        sourceDocId: "DOC-CMR-PITCH",
        sourceSlide: 4,
        answer: "The approved deck for lender presentations is 'CreditVision CMR Sales Pitch Deck v1.4' (Owner: Priya Nair, Status: Approved). Yes, you can share the official rank scale: it operates on a standardized 1 to 10 risk tier classification (Tier 1 = Prime, Tier 10 = High Risk).",
        bullets: [
          "Approved Deck: CreditVision CMR Sales Pitch Deck v1.4 (Status: Approved, General Access).",
          "Official Rank Scale: 10 granular tiers (1 to 10) for automated commercial underwriting.",
          "Compliance Advisory: Do NOT circulate legacy v2.9 (outdated 1-5 scale) which caused prior lender discrepancies."
        ]
      },
      {
        id: "INT-01",
        keywords: ["cmr rank scale", "rank scale", "cmr scale", "1-10", "1 to 10", "tiers", "what is the rank scale", "creditvision cmr"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-CMR-32",
        sourceSlide: 8,
        answer: "CreditVision CIBIL Commercial Rank (CMR) operates on a standardized 1 to 10 risk tier classification scale. Tier 1 represents prime low-risk commercial enterprises, while Tier 10 indicates the highest default probability. This 10-tier distribution replaces the legacy 1-5 scale.",
        bullets: [
          "Standardized across credit institutions for granular risk pricing and automated underwriting.",
          "Tier 1-3: Prime/Low Risk; Tier 4-7: Moderate/Standard; Tier 8-10: High Risk.",
          "Replaces the deprecated 1 to 5 scale defined in legacy v2.9 documentation."
        ]
      },
      {
        id: "INT-02",
        keywords: ["minimum history", "seasoning", "12 months", "6 months", "tradeline history", "history requirement", "how many months"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-CMR-32",
        sourceSlide: 12,
        answer: "According to CreditVision CIBIL Commercial Rank (CMR) Product Overview v3.2, a strict minimum of 12 consecutive months of reported commercial credit history is required to generate a definitive score. Note: An active conflict exists with Validation Rules v2.1 which permits preliminary evaluation at 6 months.",
        bullets: [
          "Mandates 12 consecutive months across formal banking institutions.",
          "Designed to protect lenders against thin-file default volatility using trended data.",
          "Conflict flagged: API gateway rule VALIDATE_TR_HIST_04 allows 6 months."
        ]
      },
      {
        id: "INT-03",
        keywords: ["weights", "formula", "algorithm", "scoring methodology", "mathematical weights", "gradient boosting", "feature importance", "creditvision methodology"],
        requiredAccess: "Product-only", // ROLE RESTRICTED TO PRODUCT TEAM!
        sourceDocId: "DOC-CMR-METH",
        sourceSlide: 14,
        answer: "The CreditVision CMR model is a gradient boosting ensemble trained on 1.4M commercial contracts utilizing trended multi-dimensional feature categories.",
        bullets: [
          "Tradeline Repayment Trend Velocity: 38.5% total model weight.",
          "Working Capital Limit Utilization Dynamics: 26.2% weight.",
          "Debt Service Coverage Ratio (derived from GST filings): 19.8% weight.",
          "Commercial Enquiry Velocity & Appetite: 15.5% weight."
        ]
      },
      {
        id: "INT-04",
        keywords: ["dpd threshold", "shg dpd", "60 days", "90 days", "delinquency milestone", "threshold change", "rbi mandate"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 14,
        answer: "Under the upcoming SHG CIR Technical Spec v5.0, the delinquency threshold is strictly reduced from 90 Days Past Due to 60 Days Past Due in alignment with RBI Microfinance Master Directions 2024.",
        bullets: [
          "Any SHG loan account >= 60 DPD will be classified as a Sub-Standard Asset.",
          "Accounts between 30 and 59 DPD remain in Regular Watchlist.",
          "Impacts Training Module v4.0, Report SOP v3.0, and 14 UAT test cases."
        ]
      },
      {
        id: "INT-05",
        keywords: ["shg_group_id", "group id", "new field", "mandatory field", "schema change", "char16", "regex"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 22,
        answer: "The field 'SHG_GROUP_ID' is now a mandatory 16-character alphanumeric string (Regex: ^SHG[0-9]{13}$) in the primary SHG member payload. Batch uploads missing this field will be rejected with HTTP 422 Unprocessable Entity (ERR_SHG_INVALID_GRP).",
        bullets: [
          "Format requirement: Exactly 16 characters prefixed with 'SHG' and 13 digits.",
          "Replaces nocturnal ETL group inference with real-time linkage.",
          "Requires Attribute List update and schema migration in database staging."
        ]
      },
      {
        id: "INT-06",
        keywords: ["sla", "governance", "approval sla", "policy", "working days", "how long to approve"],
        requiredAccess: "General",
        sourceDocId: "DOC-GOV-20",
        sourceSlide: 7,
        answer: "Approval Governance Policy v2.0 establishes a strict SLA of 2 working days for cross-functional review and approval of technical revisions affecting external member institutions.",
        bullets: [
          "Applies to Level-1 and Level-2 technical and schema modifications.",
          "Product Managers must obtain sign-off from Tech, Ops, and L&D within 48 hours.",
          "Pending reviews beyond SLA are escalated to the Credit Risk Steering Committee."
        ]
      },
      {
        id: "INT-07",
        keywords: ["uat test cases", "test cases", "tc_shg_088", "tc_shg_104", "testing", "regression"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-UAT",
        sourceSlide: 18,
        answer: "UAT Test Cases SHG CIR v4.0 contains 216 test scenarios, of which 14 boundary test cases are broken by the v5.0 spec updates. Specifically, TC_SHG_088 asserts a 90 DPD boundary and TC_SHG_104 asserts ingestion without group ID.",
        bullets: [
          "TC_SHG_088: Asserts Watchlist status at 89 DPD; will fail when 60 DPD rule applies.",
          "TC_SHG_104: Asserts successful ingestion without SHG_GROUP_ID; will fail with HTTP 422.",
          "Test suite update scheduled under JIRA ticket DEF-8812."
        ]
      },
      {
        id: "INT-08",
        keywords: ["batch size", "batch concurrency", "payload size", "50000", "throughput", "gzip"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 31,
        answer: "SHG CIR Technical Spec v5.0 expands batch payload capacity from 10,000 records to 50,000 member records per call at /api/v2/shg/batch, mandating GZIP payload compression for requests exceeding 5 MB.",
        bullets: [
          "5x increase in throughput capacity for large microfinance institutions.",
          "GZIP compression header (Content-Encoding: gzip) required over 5 MB.",
          "Asynchronous batch completion callback delivered via webhook within 180 seconds."
        ]
      },
      {
        id: "INT-09",
        keywords: ["grameen", "rural credit", "grameen score", "financial inclusion", "micro-enterprises"],
        requiredAccess: "General",
        sourceDocId: "DOC-CMR-PITCH",
        sourceSlide: 4,
        answer: "TransUnion CIBIL Grameen Score is a dedicated financial inclusion model designed to assess rural and semi-urban borrowers lacking formal bureau tradelines, utilizing agricultural repayment patterns and community cluster data.",
        bullets: [
          "Targeted at first-time borrowers in Tier-3 to Tier-5 geographies.",
          "Combines alternative agricultural data with self-help group repayment discipline.",
          "Enables NBFCs and rural cooperative banks to underwrite unbanked entrepreneurs."
        ]
      },
      {
        id: "INT-10",
        keywords: ["msme rank", "cibil msme", "small business", "sme score", "commercial rank"],
        requiredAccess: "General",
        sourceDocId: "DOC-CMR-32",
        sourceSlide: 8,
        answer: "CIBIL MSME Rank and CreditVision CIBIL Commercial Rank provide credit institutions with standardized scores from 1 to 10 predicting the probability of default for commercial enterprises over a 12-month forward horizon.",
        bullets: [
          "Utilized by over 120 Indian commercial banks and financial institutions.",
          "Integrates commercial borrowing data, proprietor individual history, and GST returns.",
          "Rank 1 to 3 indicates lowest risk, streamlining fast-track loan disbursal."
        ]
      },
      {
        id: "INT-11",
        keywords: ["executive summary", "summary of shg", "impact across departments", "what changed in v5.0"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 14,
        answer: "SHG CIR Technical Spec v5.0 introduces two major breaking changes: reducing the delinquency threshold from 90 to 60 DPD, and requiring a mandatory 16-character SHG_GROUP_ID in member payloads. This directly impacts 5 internal documents across L&D, Operations, Architecture, UAT, and Sales.",
        bullets: [
          "High Impact: L&D Training Module v4.0 requires curriculum revision to 60 DPD.",
          "High Impact: Attribute List & UAT Test Cases require schema & boundary updates.",
          "Medium Impact: Operations SOP v3.0 needs queue adjustment for 60 DPD disputes."
        ]
      },
      {
        id: "INT-12",
        keywords: ["sop", "report-handling", "dispute", "operations escalation", "manual review"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-SHG-SOP",
        sourceSlide: 11,
        answer: "Report-Handling SOP v3.0 outlines the operational procedure for resolving member bank delinquency disputes. Tier-2 manual review is triggered automatically when an institution disputes an account reported at or above the delinquency threshold.",
        bullets: [
          "Currently configured to trigger on 90+ DPD disputes.",
          "Must be retargeted to 60+ DPD under Spec v5.0 to prevent SLA breach.",
          "Target resolution turnaround: 48 hours from ticket creation."
        ]
      },
      {
        id: "INT-13",
        keywords: ["outdated copy", "v2.9", "legacy cmr", "superseded", "cmr v2.9"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-CMR-29",
        sourceSlide: 6,
        answer: "CreditVision CIBIL Commercial Rank (CMR) Product Overview v2.9 is a superseded document that defined an obsolete 5-point risk scale (1 to 5). It is maintained solely for legacy audit reference and must not be distributed to commercial partners.",
        bullets: [
          "Status: Superseded by v3.2 on 2024-09-15.",
          "Active Conflict: Regional partner teams still referencing obsolete 5-tier classification.",
          "Recommendation: Remove from shared drives and mandate v3.2 1-10 scale."
        ]
      },
      {
        id: "INT-14",
        keywords: ["sales deck", "commercial terms", "pitch deck", "client presentation", "creditvision deck"],
        requiredAccess: "General",
        sourceDocId: "DOC-CMR-PITCH",
        sourceSlide: 4,
        answer: "CreditVision CMR Sales Pitch Deck v1.4 is approved for external distribution to commercial lenders and NBFCs. It details the predictive power of trended credit algorithms and the 10-tier CMR scale.",
        bullets: [
          "Access Level: General (Client-facing).",
          "Includes ROI calculator for commercial portfolio risk optimization.",
          "Requires minor update to align terminology with 2024 regulatory guidelines."
        ]
      },
      {
        id: "INT-15",
        keywords: ["who is affected", "affected documents", "impact radar list", "what documents are affected"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 14,
        answer: "Updating SHG CIR Technical Spec to v5.0 impacts five key documents across five departments: SHG CIR Training Module v4.0 (High), Attribute List & Data Dictionary (High), UAT Test Cases SHG CIR v4.0 (High), Report-Handling SOP v3.0 (Medium), and CreditVision CMR Sales Deck (Low).",
        bullets: [
          "L&D (Neha Verma): Re-certify field trainers on 60 DPD cutoff.",
          "Tech Architecture (Rohan Mehta): Add SHG_GROUP_ID to data dictionary.",
          "UAT (Rohan Mehta): Fix boundary test cases TC_SHG_088 and TC_SHG_104."
        ]
      },
      {
        id: "INT-16",
        keywords: ["conflict between cmr", "conflicts", "open conflicts", "discrepancies"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-CMR-32",
        sourceSlide: 12,
        answer: "TruCortex Conflict Radar has detected three active enterprise document conflicts: 1) CreditVision CMR Rank Scale 1-10 in v3.2 vs 1-5 in v2.9; 2) Minimum Seasoning 12 months in Overview v3.2 vs 6 months in Validation Rules v2.1; 3) Delinquency Threshold 60 DPD in Spec v5.0 vs 90 DPD in Training v4.0.",
        bullets: [
          "Scoring Scale: v2.9 outdated copy causing partner integration confusion.",
          "Underwriting Seasoning: 6 vs 12 months causes gateway reject discrepancies.",
          "Regulatory: Training module lags RBI 60-day DPD mandate by 30 days."
        ]
      },
      {
        id: "INT-17",
        keywords: ["data dictionary", "attribute list", "shg attributes", "columns"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-SHG-ATTR",
        sourceSlide: 4,
        answer: "Attribute List & Data Dictionary v2.4 lists 148 bureau attributes, including 42 specific to SHG lending. It currently lacks the SHG_GROUP_ID definition required by Spec v5.0.",
        bullets: [
          "Owner: Rohan Mehta (Technical Architecture).",
          "DDL migration required for table T_SHG_MEMBER_STAGE before v5.0 release.",
          "Severity: High (Data ingestion blocker)."
        ]
      },
      {
        id: "INT-18",
        keywords: ["trended data", "creditvision features", "algorithms", "trended algorithms"],
        requiredAccess: "Internal",
        sourceDocId: "DOC-CMR-32",
        sourceSlide: 19,
        answer: "CreditVision CIBIL Commercial Rank incorporates trended historical data over time, examining 24 to 36 months of commercial payment trajectories, utilization velocity, and balance trends rather than static snapshots.",
        bullets: [
          "Analyzes trended trajectory of debt repayment across all active commercial trade lines.",
          "Identifies emerging financial distress months before formal default occurs.",
          "Differentiated scorecards for MSME, Mid-Market, and Large Corporate borrowers."
        ]
      },
      {
        id: "INT-19",
        keywords: ["bad rate", "default odds", "calibration curve", "odds table"],
        requiredAccess: "Product-only",
        sourceDocId: "DOC-CMR-METH",
        sourceSlide: 22,
        answer: "CreditVision CMR default odds calibration is anchored on a 12-month performance window with 90+ DPD bad definition. Tier 1 exhibits an empirical default rate under 0.8%, whereas Tier 10 default rate exceeds 42.6%.",
        bullets: [
          "Tier 1: < 0.8% default rate (Prime)",
          "Tier 5: 4.8% default rate (Market Average)",
          "Tier 10: > 42.6% default rate (Severe Distress)"
        ]
      },
      {
        id: "INT-20",
        keywords: ["rbi", "regulatory mandate", "master directions", "microfinance directions"],
        requiredAccess: "General",
        sourceDocId: "DOC-SHG-50",
        sourceSlide: 14,
        answer: "The RBI Microfinance Master Directions 2024 enforce enhanced early-warning monitoring for group loans, harmonizing delinquency recognition milestones across NBFC-MFIs and commercial banks to 60 DPD.",
        bullets: [
          "Replaces previous 90-day standard for self-help group portfolios.",
          "Designed to curb over-indebtedness and promote proactive loan restructuring.",
          "Effective date: Target Q4 2024 compliance deployment."
        ]
      },
      {
        id: "INT-21",
        keywords: ["api gateway", "validate_tr_hist_04", "validation rule", "gateway rules"],
        requiredAccess: "Technical",
        sourceDocId: "DOC-CMR-VAL",
        sourceSlide: 9,
        answer: "Rule VALIDATE_TR_HIST_04 in CreditVision CMR Validation Rules v2.1 permits commercial credit applicants with 6 months of active tradeline history to generate preliminary scores, requiring at least 2 active trade lines.",
        bullets: [
          "Engineered for fast-track fintech and digital lending onboarding.",
          "Directly contradicts the 12-month requirement in Product Overview v3.2.",
          "Action item: Product and Tech teams must harmonize or create sub-tier."
        ]
      },
      {
        id: "INT-22",
        keywords: ["cibil", "transunion cibil", "about cibil", "credit bureau", "information for good"],
        requiredAccess: "General",
        sourceDocId: "DOC-GOV-20",
        sourceSlide: 7,
        answer: "TransUnion CIBIL is India's leading credit information company, maintaining credit records of over 1 billion individuals and businesses to foster financial inclusion under the mission 'Information for Good®'.",
        bullets: [
          "Partner to over 4,000 credit institutions, commercial banks, and NBFCs nationwide.",
          "Provides consumer CIBIL Score, CreditVision Commercial Rank, and SHG CIR analytics.",
          "TruCortex AI powers unified knowledge governance across all CIBIL specifications."
        ]
      },
      {
        id: "INT-23",
        keywords: ["notify owner", "how to notify", "escalate question"],
        requiredAccess: "General",
        sourceDocId: "DOC-GOV-20",
        sourceSlide: 7,
        answer: "When an approved answer cannot be confirmed in the repository, TruCortex enables automatic ticket dispatch to the document owner with a guaranteed 2 working day SLA under Governance Policy v2.0.",
        bullets: [
          "One-click notification dispatches an audit-logged alert to the domain owner.",
          "Tracks resolution in TruCortex Acknowledgements and Audit Log.",
          "Ensures zero hallucinations and strictly governed enterprise specifications."
        ]
      },
      {
        id: "INT-24",
        keywords: ["model selector", "qwen", "qwen3.5", "qwen2.5", "models"],
        requiredAccess: "General",
        sourceDocId: "DOC-GOV-20",
        sourceSlide: 7,
        answer: "TruCortex AI supports three simulated local edge LLMs: Qwen3.5-2B Q4_K_M (28 tok/s, 1.4 GB RAM), Qwen3.5-2B Q5_K_M (24 tok/s, 1.8 GB RAM), and Qwen2.5-Coder-3B Q4_K_M (19 tok/s, 2.2 GB RAM).",
        bullets: [
          "Models run strictly locally with zero external data egress.",
          "Each quantization level balances token generation speed against schema precision.",
          "Switch models anytime from the top utility bar."
        ]
      },
      {
        id: "INT-25",
        keywords: ["credit cortex", "team credit cortex", "hackathon", "project"],
        requiredAccess: "General",
        sourceDocId: "DOC-GOV-20",
        sourceSlide: 7,
        answer: "TruCortex AI was developed by Team Credit Cortex at TransUnion CIBIL to eliminate spec fragmentation, detect cross-document conflicts, and automate change impact radius across mission-critical credit products.",
        bullets: [
          "Architecture: Governed Local RAG with Strict Role-Based Pre-filtering.",
          "Core modules: Change Impact Radar, Semantic Conflict Radar, and Human-in-the-Loop Approval.",
          "Designed to protect financial infrastructure integrity."
        ]
      }
    ];
  }

  switchModel(modelId, onComplete) {
    if (!this.models[modelId]) return;
    const oldModel = this.models[this.currentModelId];
    const newModel = this.models[modelId];
    this.currentModelId = modelId;

    if (window.TruCortexApp) {
      window.TruCortexApp.log("LLM", `Switching model: ${oldModel.name} -> ${newModel.name}...`);
    }

    if (onComplete) {
      setTimeout(() => {
        if (window.TruCortexApp) {
          window.TruCortexApp.log("PERF", `Model ${newModel.name} loaded in ${newModel.loadTime}s. Allocated RAM: ${newModel.ram}. Engine ready.`);
        }
        onComplete(newModel);
      }, newModel.loadTime * 1000);
    }
  }

  getCurrentModel() {
    return this.models[this.currentModelId] || this.models["qwen-3.5-2b-q4"];
  }

  checkAccess(user, intent) {
    if (!intent.requiredAccess || intent.requiredAccess === "General") {
      return { allowed: true };
    }

    const userLevels = user.accessLevels || ["General"];
    const isAllowed = userLevels.includes(intent.requiredAccess) || userLevels.includes("Approver");

    return {
      allowed: isAllowed,
      required: intent.requiredAccess,
      userLevels: userLevels
    };
  }

  matchIntent(questionText) {
    const q = questionText.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const intent of this.intents) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (q.includes(kw.toLowerCase())) {
          score += kw.length;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }

    return highestScore >= 3 ? bestMatch : null;
  }

  query(user, questionText, callbacks) {
    const { onSearching, onRestricted, onChunkFound, onToken, onComplete } = callbacks;
    const model = this.getCurrentModel();

    if (onSearching) onSearching();

    const allDocs = window.SEED_DOCUMENTS || [];
    const allowedDocs = allDocs.filter(d => {
      if (d.accessLevel === "General") return true;
      return user.accessLevels.includes(d.accessLevel) || user.accessLevels.includes("Approver");
    });

    if (window.TruCortexApp) {
      window.TruCortexApp.log("RAG", `Query received from ${user.name} (${user.role}): "${questionText.substring(0, 45)}..."`);
      window.TruCortexApp.log("ACCESS", `RBAC Pre-Filter: ${allowedDocs.length} of ${allDocs.length} documents eligible for user scope.`);
    }

    const matchedIntent = this.matchIntent(questionText);
    const searchDelay = 650 + Math.random() * 200;

    setTimeout(() => {
      if (!matchedIntent) {
        if (window.TruCortexApp) {
          window.TruCortexApp.log("RAG", `No approved repository document matched query. Returning governed fallback.`);
        }
        if (onComplete) {
          onComplete({
            success: false,
            restricted: false,
            message: "I could not find an approved document for this inquiry in the authorized repository.",
            suggestedOwner: "Product Governance & Compliance",
            question: questionText,
            trace: {
              question: questionText,
              roleCheck: `User: ${user.name} (${user.role}). Eligible Clearances: [${user.accessLevels.join(", ")}]`,
              documentsAllowed: `${allowedDocs.length} / ${allDocs.length}`,
              chunksFound: 0,
              confidence: "0.0%"
            }
          });
        }
        return;
      }

      const accessCheck = this.checkAccess(user, matchedIntent);
      if (!accessCheck.allowed) {
        if (window.TruCortexApp) {
          window.TruCortexApp.log("ACCESS", `BLOCKED: User ${user.name} lacks required [${accessCheck.required}] clearance for source ${matchedIntent.sourceDocId}.`, "ERROR");
          window.TruCortexApp.addAuditLog("ACCESS", `RBAC Blocked: ${user.name} attempted query requiring [${accessCheck.required}] level.`, "ERROR");
        }

        if (onRestricted) {
          onRestricted({
            requiredAccess: accessCheck.required,
            userRole: user.role,
            docId: matchedIntent.sourceDocId,
            trace: {
              question: questionText,
              roleCheck: `FAILED: [${accessCheck.required}] clearance required. User has [${accessCheck.userLevels.join(", ")}].`,
              documentsAllowed: `${allowedDocs.length} / ${allDocs.length} (Restricted Doc Filtered)`,
              chunksFound: 0,
              confidence: "N/A - Blocked Before Retrieval"
            }
          });
        }
        return;
      }

      const sourceDoc = allDocs.find(d => d.id === matchedIntent.sourceDocId) || {
        title: "CreditVision Specification",
        version: "v1.0",
        owner: "Enterprise Risk",
        status: "Approved"
      };

      const sourceChip = {
        docId: sourceDoc.id,
        docTitle: sourceDoc.title,
        docVersion: sourceDoc.version,
        slide: matchedIntent.sourceSlide,
        owner: sourceDoc.owner,
        status: sourceDoc.status
      };

      if (window.TruCortexApp) {
        window.TruCortexApp.log("RAG", `Retrieval Hit: ${sourceDoc.title} (${sourceDoc.version}, Slide ${matchedIntent.sourceSlide}). Synthesizing response via ${model.name}...`);
      }

      const bulletsText = matchedIntent.bullets && matchedIntent.bullets.length > 0
        ? "\n\n" + matchedIntent.bullets.map(b => `• ${b}`).join("\n")
        : "";
      const sourceCitation = `\n\nSource: ${sourceDoc.title} ${sourceDoc.version}, slide/section ${matchedIntent.sourceSlide}. (Owner: ${sourceDoc.owner})`;
      const fullResponse = matchedIntent.answer + bulletsText + sourceCitation;

      const words = fullResponse.split(" ");
      let wordIndex = 0;
      let streamedContent = "";
      const intervalMs = Math.max(25, Math.floor(1000 / (model.tokensPerSec * 1.3)));
      const startTime = performance.now();
      let ttftMs = Math.round(searchDelay);

      this.isStreaming = true;
      if (onChunkFound) {
        onChunkFound({
          model: model.name,
          ttft: `${ttftMs} ms`,
          sourceChip: sourceChip
        });
      }

      this.currentStreamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          const word = words[wordIndex] + " ";
          streamedContent += word;
          wordIndex++;
          if (onToken) onToken(streamedContent);
        } else {
          clearInterval(this.currentStreamInterval);
          this.isStreaming = false;
          const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);

          if (window.TruCortexApp) {
            window.TruCortexApp.log("LLM", `Inference complete. Streamed ${words.length} words in ${totalTime}s (${model.tokensPerSec} tok/s target).`);
          }

          if (onComplete) {
            onComplete({
              success: true,
              restricted: false,
              answer: streamedContent,
              sourceChip: sourceChip,
              modelName: model.name,
              tokensPerSec: `${model.tokensPerSec} tok/s`,
              ttft: `${ttftMs} ms`,
              trace: {
                question: questionText,
                roleCheck: `PASSED: User clearance [${user.accessLevels.join(", ")}] permits [${matchedIntent.requiredAccess || "General"}].`,
                documentsAllowed: `${allowedDocs.length} / ${allDocs.length} specifications eligible`,
                chunkSelected: `${sourceDoc.title} (Section/Slide ${matchedIntent.sourceSlide})`,
                confidence: "99.2%"
              }
            });
          }
        }
      }, intervalMs);
    }, searchDelay);
  }

  explainImpact(sourceDoc, affectedDocs, onToken, onComplete) {
    const model = this.getCurrentModel();
    const explanation = `Executive Impact Analysis generated by ${model.name}:
The pending revision of ${sourceDoc.title} (${sourceDoc.version}) introduces two breaking changes:
1. DPD Delinquency Threshold reduced from 90 to 60 days, triggering early default classification under RBI Microfinance directions.
2. New mandatory field SHG_GROUP_ID (CHAR16) in member batch payloads.

Affected Stakeholder Summary:
• L&D (Neha Verma - High Severity): Field collections curriculum (Slide 24) references 90 DPD. Must retrain 450+ field credit assessment officers before launch.
• Technical & UAT (Rohan Mehta - High Severity): 14 boundary test cases (TC_SHG_088) will fail. Master data dictionary requires column addition.
• Operations (Rajesh Kumar - Medium Severity): Manual dispute SOP v3.0 escalation threshold requires adjustment to 60 DPD.
• Commercial Sales (Priya Nair - Low Severity): CreditVision CMR marketing collateral references delinquency monitoring horizon alignment with RBI guidelines.

Recommended Review Priority: Rohan Mehta must stage database schema updates within 24 hours; Neha Verma must issue training addendum before production release.`;

    this._streamText(explanation, model, onToken, onComplete);
  }

  explainConflict(conflict, onToken, onComplete) {
    const model = this.getCurrentModel();
    const explanation = `Conflict Analysis generated by ${model.name}:
Conflict detected on key metric "${conflict.key}" between:
• Document A: ${conflict.docA.title} (${conflict.docA.version}, ${conflict.docA.slide}) -> ${conflict.docA.value}
• Document B: ${conflict.docB.title} (${conflict.docB.version}, ${conflict.docB.slide}) -> ${conflict.docB.value}

Root Cause Analysis:
${conflict.explanation}

Recommended Action:
${conflict.resolutionRecommendation}
Final determination resides with the designated Document Owner (${conflict.docA.owner}).`;

    this._streamText(explanation, model, onToken, onComplete);
  }

  _streamText(text, model, onToken, onComplete) {
    const words = text.split(" ");
    let wordIndex = 0;
    let streamed = "";
    const intervalMs = Math.max(20, Math.floor(1000 / (model.tokensPerSec * 1.4)));

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        streamed += words[wordIndex] + " ";
        wordIndex++;
        if (onToken) onToken(streamed);
      } else {
        clearInterval(timer);
        if (onComplete) onComplete(streamed);
      }
    }, intervalMs);
  }
}

window.TruCortexAIEngine = new TruCortexAIEngine();
