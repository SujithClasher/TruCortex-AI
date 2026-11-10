/**
 * TruCortex AI - Main Enterprise Application Controller
 * Team Credit Cortex | TransUnion CIBIL
 */

(function () {
  "use strict";

  class TruCortexApp {
    constructor() {
      this.currentUser = null;
      this.activeTab = "dashboard";
      this.currentModelId = "qwen-3.5-2b-q4";
      this.searchQuery = "";
      this.docFilter = "All";
      this.logs = [];
      this.notifications = {};
      this.unreadCount = 0;
      this.isPresenterMode = false;
      this.acknowledgements = {};

      this.init();
    }

    init() {
      this.loadState();
      this.initTheme();
      this.bindEvents();
      this.render();

      // Listen for cross-tab storage sync
      window.addEventListener("storage", (e) => {
        if (e.key === "trucortex_sync_event") {
          this.log("NOTIFY", `Cross-tab event received: ${e.newValue}`);
          this.loadState();
          this.updateNotificationBadge();
          this.renderActiveTab();
        }
      });

      console.log("%c TruCortex AI %c TransUnion CIBIL Enterprise Platform", 
        "background: #063B5C; color: #FFD800; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
        "background: #00A6CA; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;");
      
      this.log("PERF", "TruCortex AI Platform Engine initialized. Session verified.");
    }

    // State persistence
    loadState() {
      try {
        const savedUser = localStorage.getItem("trucortex_user");
        if (savedUser) {
          this.currentUser = JSON.parse(savedUser);
        } else {
          // Default to Vikram Shah (PM Approver) for immediate live demonstration
          this.currentUser = window.SEED_USERS.find(u => u.id === "vikram") || window.SEED_USERS[0];
          localStorage.setItem("trucortex_user", JSON.stringify(this.currentUser));
        }

        const savedTab = localStorage.getItem("trucortex_active_tab");
        if (savedTab) {
          this.activeTab = savedTab;
        }

        // Guard dashboard and upload if current user is not a PM
        if (this.currentUser && !this.currentUser.canApprove && (this.activeTab === "dashboard" || this.activeTab === "upload")) {
          this.activeTab = "ask";
        }

        const savedModel = localStorage.getItem("trucortex_model");
        if (savedModel && window.SIMULATED_MODELS[savedModel]) {
          this.currentModelId = savedModel;
          window.TruCortexAIEngine.currentModelId = savedModel;
        }

        const savedAcks = localStorage.getItem("trucortex_acks");
        this.acknowledgements = savedAcks ? JSON.parse(savedAcks) : {
          "priya": true,
          "rohan": true,
          "ananya": true,
          "vikram": true
        };

        const savedNotifs = localStorage.getItem("trucortex_notifications");
        this.notifications = savedNotifs ? JSON.parse(savedNotifs) : {
          "ananya": [
            { id: "N1", title: "New Document Draft Staged", desc: "SHG CIR Technical Spec v5.0 awaiting Product sign-off.", time: "10m ago", read: false }
          ],
          "priya": [
            { id: "N2", title: "Sales Alert: Delinquency Horizon Update", desc: "SHG portfolio risk window adjusting to 60 DPD.", time: "25m ago", read: false }
          ],
          "rohan": [
            { id: "N3", title: "Action Required: UAT Test Regression", desc: "SHG_GROUP_ID schema update breaks TC_SHG_088.", time: "5m ago", read: false }
          ],
          "vikram": [
            { id: "N4", title: "Approval Gate Pending", desc: "4 stakeholder teams ready for SHG CIR v5.0 broadcast.", time: "1m ago", read: false }
          ]
        };

        const savedLogs = localStorage.getItem("trucortex_logs");
        if (savedLogs) {
          this.logs = JSON.parse(savedLogs);
        } else {
          this.logs = [];
          this.log("AUTH", `Session active: ${this.currentUser.name} (${this.currentUser.role})`);
          this.log("RAG", "Knowledge vector index verified (10 core specifications, 148 attributes).");
        }

        // Radar data init
        window.TruCortexRadarInstance.init(window.SEED_IMPACT_RADAR, window.SEED_CONFLICT_RADAR);

      } catch (e) {
        console.error("Failed to load local state", e);
      }
    }

    saveState() {
      try {
        if (this.currentUser) {
          localStorage.setItem("trucortex_user", JSON.stringify(this.currentUser));
        } else {
          localStorage.removeItem("trucortex_user");
        }
        localStorage.setItem("trucortex_active_tab", this.activeTab);
        localStorage.setItem("trucortex_model", this.currentModelId);
        localStorage.setItem("trucortex_acks", JSON.stringify(this.acknowledgements));
        localStorage.setItem("trucortex_notifications", JSON.stringify(this.notifications));
        localStorage.setItem("trucortex_logs", JSON.stringify(this.logs.slice(-100)));
      } catch (e) {
        console.error("Failed to save local state", e);
      }
    }

    initTheme() {
      const savedTheme = localStorage.getItem("trucortex_theme") || "light";
      this.setTheme(savedTheme, false);
    }

    toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = current === "dark" ? "light" : "dark";
      this.setTheme(newTheme, true);
    }

    setTheme(theme, showToast = true) {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("trucortex_theme", theme);
      this.updateThemeUI(theme);
      if (showToast) {
        this.showToast(`Switched to ${theme === "dark" ? "Dark Mode" : "Light Mode"}`, "info");
        this.log("SYS", `Theme set to: [${theme.toUpperCase()}]`);
      }
    }

    updateThemeUI(theme) {
      const btn = document.getElementById("btnThemeToggle");
      const menuLabel = document.getElementById("themeMenuLabel");
      const isDark = theme === "dark";

      if (btn) {
        btn.innerHTML = isDark ? `
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFD800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ` : `
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        `;
        btn.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
      }

      if (menuLabel) {
        menuLabel.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
      }
    }

    resetDemo() {
      localStorage.clear();
      this.currentUser = window.SEED_USERS.find(u => u.id === "vikram");
      this.activeTab = "dashboard";
      this.currentModelId = "qwen-3.5-2b-q4";
      this.showToast("Demo environment reset to initial state.", "info");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }

    // Logging system
    log(tag, message, level = "INFO") {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
      const logEntry = {
        id: "LOG-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        time: timeStr,
        tag: tag.toUpperCase(),
        message: message,
        level: level
      };

      this.logs.push(logEntry);
      if (this.logs.length > 200) this.logs.shift();

      // Mirror to browser console
      const tagStyles = {
        "AUTH": "color: #00A6CA; font-weight: bold",
        "ACCESS": "color: #C0504D; font-weight: bold",
        "RAG": "color: #0876B9; font-weight: bold",
        "LLM": "color: #0B5A6B; font-weight: bold",
        "RADAR": "color: #F2C94C; font-weight: bold",
        "CONFLICT": "color: #C0504D; font-weight: bold",
        "UPLOAD": "color: #1E8449; font-weight: bold",
        "NOTIFY": "color: #FFD800; font-weight: bold",
        "PERF": "color: #8E44AD; font-weight: bold"
      };

      console.log(`%c[${logEntry.tag}]%c ${logEntry.time} - ${message}`, tagStyles[logEntry.tag] || "color: #333", "color: inherit");

      this.appendLiveLogTerminal(logEntry);
    }

    appendLiveLogTerminal(entry) {
      const termBody = document.getElementById("terminalLogBody");
      if (!termBody) return;

      const line = document.createElement("div");
      line.className = `log-line line-${entry.level.toLowerCase()} line-tag-${entry.tag.toLowerCase()}`;
      line.innerHTML = `
        <span class="log-time">${entry.time}</span>
        <span class="log-tag tag-${entry.tag.toLowerCase()}">[${entry.tag}]</span>
        <span class="log-msg">${this.escapeHtml(entry.message)}</span>
      `;
      termBody.appendChild(line);

      // Auto-scroll to bottom
      termBody.scrollTop = termBody.scrollHeight;
    }

    addAuditLog(tag, details, level = "INFO") {
      const now = new Date();
      const timestamp = now.toISOString().replace("T", " ").substring(0, 19);
      const auditEntry = {
        id: "AUD-" + (window.SEED_AUDIT_LOGS.length + 1001),
        timestamp: timestamp,
        tag: tag,
        actor: this.currentUser ? this.currentUser.name : "System Guest",
        role: this.currentUser ? this.currentUser.role : "Anonymous",
        action: details.split(":")[0] || "Platform Action",
        details: details,
        level: level
      };
      window.SEED_AUDIT_LOGS.unshift(auditEntry);
      this.saveState();
      if (this.activeTab === "audit") {
        this.renderAuditScreen();
      }
    }

    // Toast Notifications
    showToast(message, type = "info") {
      let toastContainer = document.getElementById("toastContainer");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-icon">
          ${type === "error" ? "⚠️" : (type === "success" ? "✅" : "ℹ️")}
        </div>
        <div class="toast-content">${this.escapeHtml(message)}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      `;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    // Microsoft SSO Flow
    openLoginModal() {
      const gateway = document.getElementById("ssoGatewayView");
      const mainContainer = document.getElementById("platformMainContainer");
      if (gateway) gateway.style.display = "flex";
      if (mainContainer) mainContainer.style.display = "none";
      this.renderSsoAccountList();
    }

    closeLoginModal() {
      const gateway = document.getElementById("ssoGatewayView");
      const mainContainer = document.getElementById("platformMainContainer");
      if (gateway) gateway.style.display = "none";
      if (mainContainer) mainContainer.style.display = "block";
    }

    selectLoginAccount(userId) {
      const user = window.SEED_USERS.find(u => u.id === userId);
      if (!user) return;

      const accPicker = document.getElementById("ssoAccountPicker");
      const progressView = document.getElementById("ssoProgressView");
      const staySignedInView = document.getElementById("ssoStaySignedInView");

      if (accPicker) accPicker.style.display = "none";
      if (progressView) {
        progressView.style.display = "flex";
        const signingName = document.getElementById("ssoSigningName");
        if (signingName) signingName.textContent = user.name;
      }

      this.log("AUTH", `SSO Handshake initiated for ${user.name} (${user.email}). Validating Entra ID tokens...`);

      setTimeout(() => {
        if (progressView) progressView.style.display = "none";
        if (staySignedInView) {
          staySignedInView.style.display = "block";
          const stayName = document.getElementById("ssoStayName");
          if (stayName) stayName.textContent = user.email;

          const completeAuth = () => {
            this.currentUser = user;
            if (!user.canApprove && (this.activeTab === "dashboard" || this.activeTab === "upload")) {
              this.activeTab = "ask";
            }
            this.saveState();
            this.closeLoginModal();
            this.log("AUTH", `SSO Session established. Authenticated as: ${user.name} [${user.role}].`);
            this.addAuditLog("AUTH", `User Login: ${user.name} (${user.email}) via Entra ID SSO`, "INFO");
            this.showToast(`Welcome, ${user.name}! Connected to TruCortex AI.`, "success");
            this.render();

            setTimeout(() => {
              if (accPicker) accPicker.style.display = "block";
              if (progressView) progressView.style.display = "none";
              if (staySignedInView) staySignedInView.style.display = "none";
            }, 500);
          };

          const btnYes = document.getElementById("ssoStayYes");
          const btnNo = document.getElementById("ssoStayNo");
          if (btnYes) btnYes.onclick = completeAuth;
          if (btnNo) btnNo.onclick = completeAuth;
        }
      }, 800);
    }

    switchUser(userId) {
      const user = window.SEED_USERS.find(u => u.id === userId);
      if (!user) return;

      this.currentUser = user;
      if (!user.canApprove && (this.activeTab === "dashboard" || this.activeTab === "upload")) {
        this.activeTab = "ask";
      }
      this.saveState();
      this.log("AUTH", `Switched active account to: ${user.name} (${user.role}).`);
      this.showToast(`Active Persona: ${user.name} (${user.role})`, "info");
      this.hideUserMenu();
      this.render();
    }

    signOut() {
      this.log("AUTH", `Signed out: ${this.currentUser ? this.currentUser.name : "Session ended"}.`);
      this.currentUser = null;
      this.saveState();
      this.hideUserMenu();
      this.render();
    }

    // Switch model
    changeModel(modelId) {
      const model = window.SIMULATED_MODELS[modelId];
      if (!model) return;

      const progressOverlay = document.getElementById("modelLoadingOverlay");
      if (progressOverlay) progressOverlay.classList.add("visible");
      this.hideModelDropdown();

      this.currentModelId = modelId;
      window.TruCortexAIEngine.switchModel(modelId, (newModel) => {
        if (progressOverlay) progressOverlay.classList.remove("visible");
        this.saveState();
        this.updateModelSelectorUI();
        this.showToast(`Active Model: ${newModel.name} (${newModel.tokensPerSec} tok/s)`, "success");
      });
    }

    // Navigation Tab Switching
    switchTab(tabId) {
      if (tabId === "dashboard" && this.currentUser && !this.currentUser.canApprove) {
        this.showToast("Dashboard is restricted to Product Managers (PM only).", "error");
        this.log("ACCESS", `Blocked navigation to [Dashboard] tab by ${this.currentUser.name} (Role: ${this.currentUser.role}).`, "WARN");
        return;
      }

      if (tabId === "upload" && this.currentUser && !this.currentUser.canApprove) {
        this.showToast("Upload and approval is restricted to Product Managers (Approver role).", "error");
        this.log("ACCESS", `Blocked navigation to [Upload] tab by ${this.currentUser.name} (Role: ${this.currentUser.role}).`, "WARN");
        return;
      }

      this.activeTab = tabId;
      this.saveState();
      this.renderActiveTab();
      this.log("PERF", `Navigated to platform tab: [${tabId.toUpperCase()}]`);
    }

    // Main Render Pipeline
    render() {
      const mainContainer = document.getElementById("platformMainContainer");
      const gatewayView = document.getElementById("ssoGatewayView");
      const platformNav = document.getElementById("platformNav");
      const dashboardBtn = document.getElementById("navDashboardBtn");
      const uploadBtn = document.getElementById("navUploadBtn");

      if (this.currentUser) {
        if (gatewayView) gatewayView.style.display = "none";
        if (mainContainer) mainContainer.style.display = "block";
        if (platformNav) platformNav.style.display = "flex";

        const isPM = !!(this.currentUser && this.currentUser.canApprove);
        if (dashboardBtn) {
          dashboardBtn.style.display = isPM ? "inline-flex" : "none";
        }
        if (uploadBtn) {
          uploadBtn.style.display = isPM ? "inline-flex" : "none";
        }
        const palDash = document.getElementById("palDashboardItem");
        if (palDash) {
          palDash.style.display = isPM ? "flex" : "none";
        }

        this.renderUserChip();
        this.updateModelSelectorUI();
        this.updateNotificationBadge();
        this.renderActiveTab();
      } else {
        if (gatewayView) gatewayView.style.display = "flex";
        if (mainContainer) mainContainer.style.display = "none";
        if (platformNav) platformNav.style.display = "none";
        this.renderSsoAccountList();
      }
    }

    renderSsoAccountList() {
      const listContainer = document.getElementById("ssoAccountList");
      if (!listContainer) return;

      listContainer.innerHTML = window.SEED_USERS.map(u => `
        <div class="sso-user-row" onclick="window.TruCortexApp.selectLoginAccount('${u.id}')">
          <div class="sso-user-avatar" style="background-color: ${u.color};">
            ${u.initials}
          </div>
          <div class="sso-user-info">
            <div class="sso-user-name">${u.name}</div>
            <div class="sso-user-email">${u.email}</div>
            <div class="sso-user-roles">Scope: ${u.accessLevels.join(" · ")}</div>
          </div>
          <div class="sso-dots-menu">⋮</div>
        </div>
      `).join("");
    }

    renderUserChip() {
      const chipEl = document.getElementById("currentUserChip");
      if (!chipEl || !this.currentUser) return;

      const roleBadge = this.currentUser.canApprove ? "PM" : (this.currentUser.role.split(" ")[0]);

      chipEl.innerHTML = `
        <div class="user-chip-avatar" style="background-color: ${this.currentUser.color};">
          ${this.currentUser.initials}
        </div>
        <div class="user-chip-meta">
          <span class="user-chip-name">${this.currentUser.name}</span>
          <span class="user-chip-role">${roleBadge}</span>
        </div>
        <span class="user-chip-arrow">▾</span>
      `;
    }

    updateModelSelectorUI() {
      const selector = document.getElementById("modelSelectPill");
      const curModel = window.SIMULATED_MODELS[this.currentModelId];
      if (selector && curModel) {
        const shortName = curModel.name.split(" ")[0];
        selector.innerHTML = `
          <span class="model-led"></span>
          <span class="model-name">${shortName}</span>
          <span class="model-speed">${curModel.tokensPerSec} t/s</span>
          <span class="dropdown-chevron">▾</span>
        `;
      }
    }

    updateNotificationBadge() {
      const badge = document.getElementById("notifBadge");
      const list = this.currentUser ? (this.notifications[this.currentUser.id] || []) : [];
      const unread = list.filter(n => !n.read).length;

      if (badge) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? "inline-flex" : "none";
      }
    }

    renderActiveTab() {
      const navButtons = document.querySelectorAll(".nav-tab-btn");
      navButtons.forEach(btn => {
        if (btn.getAttribute("data-tab") === this.activeTab) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      const screens = document.querySelectorAll(".platform-screen");
      screens.forEach(s => s.classList.remove("active-screen"));

      const target = document.getElementById(`screen-${this.activeTab}`);
      if (target) {
        target.classList.add("active-screen");
      }

      switch (this.activeTab) {
        case "dashboard":
          this.renderDashboardScreen();
          break;
        case "ask":
          this.renderAskScreen();
          break;
        case "documents":
          this.renderDocumentsScreen();
          break;
        case "radar":
          this.renderImpactRadarScreen();
          break;
        case "conflicts":
          this.renderConflictsScreen();
          break;
        case "upload":
          this.renderUploadScreen();
          break;
        case "benchmark":
          this.renderBenchmarkScreen();
          break;
        case "audit":
          this.renderAuditScreen();
          break;
      }
    }

    // 1. DASHBOARD SCREEN (PM ONLY)
    renderDashboardScreen() {
      const container = document.getElementById("screen-dashboard");
      if (!container) return;

      if (this.currentUser && !this.currentUser.canApprove) {
        this.switchTab("ask");
        return;
      }

      const openConflicts = window.SEED_CONFLICT_RADAR.filter(c => c.status === "Active").length;
      const pendingReviews = window.SEED_IMPACT_RADAR.affectedDocs.filter(d => d.status === "Pending").length;
      const totalDocs = window.SEED_DOCUMENTS.length;
      const ackCount = Object.values(this.acknowledgements).filter(Boolean).length;
      const totalStakeholders = 4;

      container.innerHTML = `
        <div class="screen-header-banner">
          <div>
            <h2 class="screen-title">Credit Intelligence Dashboard</h2>
            <p class="screen-subtitle">Real-time surveillance over TransUnion CIBIL credit policies, rule changes, and cross-team dependencies.</p>
          </div>
          <div class="header-banner-actions">
            <button class="btn-yellow" onclick="window.TruCortexApp.switchTab('radar')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/></svg>
              <span>Inspect Impact Radar</span>
            </button>
            <button class="btn-outline-platform" onclick="window.TruCortexApp.switchTab('ask')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>
              <span>Ask Cortex</span>
            </button>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="kpi-card" onclick="window.TruCortexApp.switchTab('radar')">
            <div class="kpi-header">
              <span class="kpi-title">PENDING IMPACT REVIEWS</span>
              <span class="kpi-icon icon-pending">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0504D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
            </div>
            <div class="kpi-val">${pendingReviews}</div>
            <div class="kpi-sub">SHG CIR v5.0 ripple radius · 3 High severity</div>
          </div>

          <div class="kpi-card" onclick="window.TruCortexApp.switchTab('conflicts')">
            <div class="kpi-header">
              <span class="kpi-title">ACTIVE CONTRADICTIONS</span>
              <span class="kpi-icon icon-conflicts">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
            </div>
            <div class="kpi-val">${openConflicts}</div>
            <div class="kpi-sub">1 outdated copy · 2 rule mismatches flagged</div>
          </div>

          <div class="kpi-card" onclick="window.TruCortexApp.switchTab('documents')">
            <div class="kpi-header">
              <span class="kpi-title">APPROVED DOCUMENTS</span>
              <span class="kpi-icon icon-docs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A6CA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </span>
            </div>
            <div class="kpi-val">${totalDocs}</div>
            <div class="kpi-sub">148 bureau attributes · 100% vector indexed</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">STAKEHOLDER SIGN-OFFS</span>
              <span class="kpi-icon icon-ack">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
            </div>
            <div class="kpi-val">${ackCount} of ${totalStakeholders}</div>
            <div class="kpi-sub">Departmental acknowledgements recorded</div>
          </div>
        </div>

        <div class="dashboard-visuals-row">
          <div class="card-panel visual-panel">
            <div class="panel-header">
              <h3>Policy Change Velocity</h3>
              <span class="panel-subtitle">Weekly credit rule revisions analyzed by TruCortex AI Engine</span>
            </div>
            <div class="chart-container">
              <svg viewBox="0 0 540 180" class="dashboard-svg-chart" width="100%" height="180">
                <line x1="40" y1="30" x2="510" y2="30" stroke="#E2E8F0" stroke-dasharray="2 2"/>
                <line x1="40" y1="80" x2="510" y2="80" stroke="#E2E8F0" stroke-dasharray="2 2"/>
                <line x1="40" y1="130" x2="510" y2="130" stroke="#E2E8F0" stroke-dasharray="2 2"/>
                <polygon points="40,140 100,110 170,125 240,75 310,95 380,45 450,60 510,35 510,150 40,150" 
                         fill="url(#chartGrad)" opacity="0.25"/>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#00A6CA"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <polyline points="40,140 100,110 170,125 240,75 310,95 380,45 450,60 510,35" 
                          stroke="#00A6CA" stroke-width="3" fill="none"/>
                <circle cx="380" cy="45" r="5" fill="#FFD800" stroke="#063B5C" stroke-width="2"/>
                <text x="380" y="32" text-anchor="middle" font-size="10" font-weight="700" fill="#063B5C">SHG v5.0 (60 DPD)</text>
                <text x="40" y="168" font-size="10" fill="#718096">Week 1</text>
                <text x="170" y="168" font-size="10" fill="#718096">Week 2</text>
                <text x="310" y="168" font-size="10" fill="#718096">Week 3</text>
                <text x="450" y="168" font-size="10" fill="#718096">Week 4 (Current)</text>
              </svg>
            </div>
          </div>

          <div class="card-panel visual-panel">
            <div class="panel-header">
              <h3>Contradiction Breakdown</h3>
              <span class="panel-subtitle">Distribution across regulatory, logic, and schema layers</span>
            </div>
            <div class="chart-container donut-container">
              <svg viewBox="0 0 200 180" class="donut-svg" width="180" height="180">
                <circle cx="100" cy="90" r="60" stroke="#C0504D" stroke-width="20" stroke-dasharray="160 380" stroke-dashoffset="0" fill="none"/>
                <circle cx="100" cy="90" r="60" stroke="#F2C94C" stroke-width="20" stroke-dasharray="120 380" stroke-dashoffset="-160" fill="none"/>
                <circle cx="100" cy="90" r="60" stroke="#00A6CA" stroke-width="20" stroke-dasharray="100 380" stroke-dashoffset="-280" fill="none"/>
                <text x="100" y="88" text-anchor="middle" font-size="17" font-weight="800" fill="#063B5C">3</text>
                <text x="100" y="102" text-anchor="middle" font-size="9" fill="#718096">Conflicts</text>
              </svg>
              <div class="donut-legend">
                <div class="legend-item"><span class="legend-dot dot-red"></span> Regulatory Threshold (42%)</div>
                <div class="legend-item"><span class="legend-dot dot-amber"></span> Tradeline Seasoning (32%)</div>
                <div class="legend-item"><span class="legend-dot dot-blue"></span> Obsolete 1-5 Scale (26%)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-panel">
          <div class="panel-header">
            <h3>Immediate Action Queue by Document Owner</h3>
            <span class="panel-subtitle">Items requiring technical revision or governance sign-off</span>
          </div>
          <div class="table-responsive">
            <table class="cibil-table">
              <thead>
                <tr>
                  <th>POLICY / DOCUMENT</th>
                  <th>DEPARTMENT</th>
                  <th>OWNER</th>
                  <th>SEVERITY</th>
                  <th>SLA DEADLINE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SHG CIR Training Module v4.0</strong><br><span class="table-sub">90 DPD threshold mismatch against v5.0 spec</span></td>
                  <td>Learning & Development</td>
                  <td>Neha Verma</td>
                  <td><span class="sev-badge badge-high">High</span></td>
                  <td>Tomorrow 18:00</td>
                  <td><button class="btn-table-action" onclick="window.TruCortexApp.switchTab('radar')">Review Impact</button></td>
                </tr>
                <tr>
                  <td><strong>Attribute List & Data Dictionary</strong><br><span class="table-sub">Missing SHG_GROUP_ID column definition</span></td>
                  <td>Technical Architecture</td>
                  <td>Rohan Mehta</td>
                  <td><span class="sev-badge badge-high">High</span></td>
                  <td>24 Oct 2024</td>
                  <td><button class="btn-table-action" onclick="window.TruCortexApp.switchTab('radar')">Review Impact</button></td>
                </tr>
                <tr>
                  <td><strong>CV CMR Validation Rules v2.1</strong><br><span class="table-sub">6 vs 12 months tradeline requirement conflict</span></td>
                  <td>Integration Gateway</td>
                  <td>Rohan Mehta</td>
                  <td><span class="sev-badge badge-med">Medium</span></td>
                  <td>26 Oct 2024</td>
                  <td><button class="btn-table-action" onclick="window.TruCortexApp.switchTab('conflicts')">Inspect Conflict</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-panel">
          <div class="panel-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
            <div>
              <h3>Pilot Business Impact & Time Savings (MANCOM Projections)</h3>
              <span class="panel-subtitle">Measured across 30 colleagues in 6 CIBIL teams · Target 40 pilot users</span>
            </div>
            <span class="sev-badge badge-high" style="background:rgba(56,189,248,0.15); color:#0284C7; border:1px solid rgba(56,189,248,0.3); font-weight:800;">Slide 9 & 10 Verified</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-top:14px;">
            <div style="background:var(--cibil-light-grey); border:1px solid var(--cibil-border); border-radius:8px; padding:14px 16px;">
              <div style="font-size:0.6875rem; font-weight:800; color:var(--cibil-text-muted); text-transform:uppercase; letter-spacing:0.05em;">Annual Capacity Freed</div>
              <div style="font-size:1.6rem; font-weight:800; color:#00A6CA; margin:4px 0;">1,104 hrs</div>
              <div style="font-size:0.75rem; color:var(--cibil-text-muted);">Freed across 40 pilot users (Capacity freed, not headcount cut)</div>
            </div>
            <div style="background:var(--cibil-light-grey); border:1px solid var(--cibil-border); border-radius:8px; padding:14px 16px;">
              <div style="font-size:0.6875rem; font-weight:800; color:var(--cibil-text-muted); text-transform:uppercase; letter-spacing:0.05em;">Avg Document Search Time</div>
              <div style="font-size:1.6rem; font-weight:800; color:#1E8449; margin:4px 0;">6 min <span style="font-size:0.8125rem; font-weight:600; color:var(--cibil-text-muted);">(was 15+ min)</span></div>
              <div style="font-size:0.75rem; color:var(--cibil-text-muted);">60% search time reduction vs 3-in-4 survey baseline</div>
            </div>
            <div style="background:var(--cibil-light-grey); border:1px solid var(--cibil-border); border-radius:8px; padding:14px 16px;">
              <div style="font-size:0.6875rem; font-weight:800; color:var(--cibil-text-muted); text-transform:uppercase; letter-spacing:0.05em;">Change Impact Summary Prep</div>
              <div style="font-size:1.6rem; font-weight:800; color:var(--cibil-navy); margin:4px 0;">45 min <span style="font-size:0.8125rem; font-weight:600; color:var(--cibil-text-muted);">(was 2.0 hrs)</span></div>
              <div style="font-size:0.75rem; color:var(--cibil-text-muted);">62.5% acceleration in preparing blast-radius reviews</div>
            </div>
            <div style="background:var(--cibil-light-grey); border:1px solid var(--cibil-border); border-radius:8px; padding:14px 16px;">
              <div style="font-size:0.6875rem; font-weight:800; color:var(--cibil-text-muted); text-transform:uppercase; letter-spacing:0.05em;">Cross-Doc Conflict Check</div>
              <div style="font-size:1.6rem; font-weight:800; color:#F2C94C; margin:4px 0;">30 min <span style="font-size:0.8125rem; font-weight:600; color:var(--cibil-text-muted);">(was 90 min)</span></div>
              <div style="font-size:0.75rem; color:var(--cibil-text-muted);">66% faster resolution of spec & validation discrepancies</div>
            </div>
          </div>
        </div>
      `;
    }

    // 2. ASK CORTEX SCREEN
    renderAskScreen() {
      const container = document.getElementById("screen-ask");
      if (!container) return;

      const user = this.currentUser || window.SEED_USERS[0];
      const model = window.TruCortexAIEngine.getCurrentModel();

      container.innerHTML = `
        <div class="ask-container">
          <div class="clearance-banner">
            <div class="clearance-info">
              <span class="clearance-badge">ACTIVE SCOPE</span>
              <span>Logged in as <strong>${user.name}</strong> (${user.role})</span>
              <span class="clearance-levels">Eligible Clearances: <strong>[${user.accessLevels.join(", ")}]</strong></span>
            </div>
          </div>

          <div class="sample-chips-wrap">
            <span class="chips-title">Suggested Inquiries (Role-Specific):</span>
            <div class="chips-list">
              ${(user.sampleQuestions || []).map(q => `
                <button class="query-chip" onclick="window.TruCortexApp.triggerAskQuery('${this.escapeHtml(q)}')">
                  ${this.escapeHtml(q)}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="ask-input-box">
            <input type="text" id="askInputField" class="ask-input" 
                   placeholder="Ask TruCortex AI about credit policies, documents, or rules..." 
                   onkeydown="if(event.key === 'Enter') window.TruCortexApp.submitAskQuery()" />
            <button class="ask-submit-btn" id="askSubmitBtn" onclick="window.TruCortexApp.submitAskQuery()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>Ask Cortex</span>
            </button>
          </div>

          <div id="askResultArea" class="ask-result-area" style="display: none;"></div>
        </div>
      `;
    }

    triggerAskQuery(question) {
      const input = document.getElementById("askInputField");
      if (input) {
        input.value = question;
        this.submitAskQuery();
      }
    }

    submitAskQuery() {
      const input = document.getElementById("askInputField");
      if (!input || !input.value.trim()) return;

      const question = input.value.trim();
      const resultArea = document.getElementById("askResultArea");
      const submitBtn = document.getElementById("askSubmitBtn");

      if (submitBtn) submitBtn.disabled = true;
      if (resultArea) {
        resultArea.style.display = "block";
        resultArea.innerHTML = `
          <div class="ai-searching-state">
            <div class="ai-spinner"></div>
            <div class="searching-text">Searching approved documents & applying RBAC pre-filters...</div>
          </div>
        `;
      }

      window.TruCortexAIEngine.query(this.currentUser, question, {
        onSearching: () => {},
        onRestricted: (restrictedData) => {
          if (submitBtn) submitBtn.disabled = false;
          resultArea.innerHTML = `
            <div class="restricted-card">
              <div class="restricted-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C0504D" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <h3>Access Restricted (RBAC Gate Enforced)</h3>
              </div>
              <p>Your current role (<strong>${this.currentUser.role}</strong>) does not have clearance to view <strong>[${restrictedData.requiredAccess}]</strong> tier documentation.</p>
              <div class="restricted-sub">
                This query attempts to retrieve proprietary formula weights from <code>${restrictedData.docId}</code> which is designated strictly for the Product & Data Science team.
              </div>
              <div class="trace-box">
                <div class="trace-header">Pre-Retrieval Gate Trace:</div>
                <div class="trace-row"><strong>Actor:</strong> ${this.currentUser.name} (${this.currentUser.email})</div>
                <div class="trace-row"><strong>Role Check:</strong> ${restrictedData.trace.roleCheck}</div>
                <div class="trace-row"><strong>Audit Status:</strong> Security incident logged under [ACCESS] in system audit trail.</div>
              </div>
            </div>
          `;
        },
        onChunkFound: (meta) => {
          resultArea.innerHTML = `
            <div class="answer-card">
              <div class="answer-header">
                <div class="engine-badge">
                  <span class="engine-indicator"></span>
                  <span>Synthesized by <strong>TruCortex AI Engine</strong></span>
                </div>
                <div class="perf-stats">
                  <span>TTFT: <strong>${meta.ttft}</strong></span>
                </div>
              </div>
              <div class="answer-body" id="streamingAnswerBody">
                <span class="typing-cursor">▌</span>
              </div>
            </div>
          `;
        },
        onToken: (streamedText) => {
          const body = document.getElementById("streamingAnswerBody");
          if (body) {
            body.innerHTML = this.formatMarkdown(streamedText) + `<span class="typing-cursor">▌</span>`;
          }
        },
        onComplete: (res) => {
          if (submitBtn) submitBtn.disabled = false;

          if (!res.success) {
            resultArea.innerHTML = `
              <div class="unapproved-card">
                <div class="unapproved-header">
                  <span class="unapproved-icon" style="display:flex; align-items:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <h3>No Approved Document Found</h3>
                </div>
                <p>${res.message}</p>
                <div class="unapproved-action-row">
                  <span>Designated Domain Owner: <strong>${res.suggestedOwner}</strong></span>
                  <button class="btn-notify-owner" onclick="window.TruCortexApp.notifyOwner('${res.suggestedOwner}', '${this.escapeHtml(res.question)}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span>Notify Owner (Trigger 2-Day SLA Review)</span>
                  </button>
                </div>
              </div>
            `;
            return;
          }

          const body = document.getElementById("streamingAnswerBody");
          if (body) {
            body.innerHTML = this.formatMarkdown(res.answer);
          }

          const ansCard = resultArea.querySelector(".answer-card");
          if (ansCard) {
            const footer = document.createElement("div");
            footer.className = "answer-footer";
            footer.innerHTML = `
              <div class="source-chips-row">
                <span class="source-label">VERIFIED CITATION:</span>
                <button class="source-chip-btn" onclick="window.TruCortexApp.openDocSnippetDrawer('${res.sourceChip.docId}', ${res.sourceChip.slide})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>${res.sourceChip.docTitle} (${res.sourceChip.docVersion}) · Slide ${res.sourceChip.slide}</span>
                  <span class="chip-owner">Owner: ${res.sourceChip.owner}</span>
                </button>
              </div>

              <details class="retrieval-trace-details">
                <summary class="trace-summary">Inspect Retrieval Trace & RBAC Evaluation</summary>
                <div class="trace-content">
                  <div class="trace-line"><strong>User Query:</strong> "${res.trace.question}"</div>
                  <div class="trace-line"><strong>RBAC Gate:</strong> ${res.trace.roleCheck}</div>
                  <div class="trace-line"><strong>Documents Allowed:</strong> ${res.trace.documentsAllowed}</div>
                  <div class="trace-line"><strong>Selected Vector Chunk:</strong> ${res.trace.chunkSelected}</div>
                  <div class="trace-line"><strong>Semantic Confidence:</strong> ${res.trace.confidence}</div>
                  <div class="trace-line"><strong>Inference Response:</strong> Time to First Token: ${res.ttft}</div>
                </div>
              </details>
            `;
            ansCard.appendChild(footer);
          }
        }
      });
    }

    notifyOwner(owner, question) {
      this.log("NOTIFY", `Dispatched priority escalation to [${owner}] for query: "${question}". SLA ticket generated.`);
      this.addAuditLog("NOTIFY", `Ticket escalated to ${owner} (SLA: 2 working days)`, "INFO");
      this.showToast(`Notified ${owner}. Ticket logged with 2 working days SLA.`, "success");
    }

    // 3. DOCUMENTS SCREEN
    renderDocumentsScreen() {
      const container = document.getElementById("screen-documents");
      if (!container) return;

      const user = this.currentUser || window.SEED_USERS[0];
      const allDocs = window.SEED_DOCUMENTS;

      const filteredDocs = allDocs.filter(d => {
        const matchesCategory = this.docFilter === "All" || d.category === this.docFilter;
        const matchesSearch = !this.searchQuery || 
          d.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          d.summary.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      const categories = ["All", "Commercial Vehicle", "Microfinance & SHG", "Technical Architecture", "Quality Engineering & UAT", "Legal & Governance", "Data Science & Risk"];

      container.innerHTML = `
        <div class="docs-screen-layout">
          <div class="docs-controls-bar">
            <div class="docs-search-wrap">
              <input type="text" class="docs-search-input" placeholder="Filter documents by code, title, policy rule, or keyword..." 
                     value="${this.escapeHtml(this.searchQuery)}"
                     oninput="window.TruCortexApp.searchDocs(this.value)" />
            </div>
            <div class="docs-filter-tabs">
              ${categories.map(cat => `
                <button class="filter-tab ${this.docFilter === cat ? 'active' : ''}" 
                        onclick="window.TruCortexApp.filterDocs('${cat}')">
                  ${cat}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="docs-table-card">
            <table class="cibil-table">
              <thead>
                <tr>
                  <th>CODE / DOCUMENT TITLE</th>
                  <th>CATEGORY</th>
                  <th>VERSION</th>
                  <th>ACCESS LEVEL</th>
                  <th>STATUS</th>
                  <th>OWNER</th>
                  <th>LAST UPDATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${filteredDocs.map(doc => {
                  const isRestrictedForUser = doc.accessLevel !== "General" && 
                    !user.accessLevels.includes(doc.accessLevel) && 
                    !user.accessLevels.includes("Approver");

                  return `
                    <tr class="${isRestrictedForUser ? 'doc-row-restricted' : ''}">
                      <td>
                        <div class="doc-title-main">
                          ${doc.title}
                          ${isRestrictedForUser ? '<span class="lock-icon" title="Clearance insufficient" style="display:inline-flex; vertical-align:middle; margin-left:6px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C0504D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' : ''}
                        </div>
                        <div class="doc-code-sub">${doc.code} · ${doc.fileSize}</div>
                      </td>
                      <td>${doc.category}</td>
                      <td><span class="ver-pill">${doc.version}</span></td>
                      <td><span class="access-pill level-${doc.accessLevel.toLowerCase()}">${doc.accessLevel}</span></td>
                      <td><span class="status-pill status-${doc.status.toLowerCase().replace(' ', '-')}">${doc.status}</span></td>
                      <td>${doc.owner}</td>
                      <td>${doc.updatedDate}</td>
                      <td>
                        <button class="btn-inspect-doc" onclick="window.TruCortexApp.openDocDrawer('${doc.id}')" ${isRestrictedForUser ? 'disabled' : ''}>
                          ${isRestrictedForUser ? 'Restricted' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    searchDocs(query) {
      this.searchQuery = query;
      this.renderDocumentsScreen();
    }

    filterDocs(cat) {
      this.docFilter = cat;
      this.renderDocumentsScreen();
    }

    openDocDrawer(docId) {
      const doc = window.SEED_DOCUMENTS.find(d => d.id === docId);
      if (!doc) return;

      const drawer = document.getElementById("docDetailDrawer");
      const drawerBody = document.getElementById("docDrawerBody");
      const drawerTitle = document.getElementById("docDrawerTitle");

      if (drawerTitle) drawerTitle.textContent = doc.title;
      if (drawerBody) {
        drawerBody.innerHTML = `
          <div class="drawer-meta-grid">
            <div><strong>Version:</strong> ${doc.version}</div>
            <div><strong>Owner:</strong> ${doc.owner}</div>
            <div><strong>Access Level:</strong> ${doc.accessLevel}</div>
            <div><strong>Status:</strong> ${doc.status}</div>
            <div><strong>File Size:</strong> ${doc.fileSize} (${doc.fileType})</div>
            <div><strong>Updated:</strong> ${doc.updatedDate}</div>
          </div>

          <div class="drawer-section">
            <h4>Document Summary</h4>
            <p>${doc.summary}</p>
          </div>

          <div class="drawer-section">
            <h4>Indexed Knowledge Snippets & Citations</h4>
            <div class="snippet-cards-list">
              ${(doc.snippets || []).map(snip => `
                <div class="snippet-item">
                  <div class="snippet-head">
                    <span class="snippet-slide">Slide / Section ${snip.slide}</span>
                    <strong class="snippet-title">${snip.title}</strong>
                  </div>
                  <div class="snippet-text">"${snip.content}"</div>
                  <div class="snippet-tags">
                    ${(snip.tags || []).map(t => `<span class="tag-pill">#${t}</span>`).join(" ")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="drawer-section">
            <h4>Connected / Ripple-Linked Documents</h4>
            <div class="linked-docs-list">
              ${(doc.linkedDocIds || []).map(id => {
                const linked = window.SEED_DOCUMENTS.find(d => d.id === id);
                return linked ? `
                  <div class="linked-doc-chip" onclick="window.TruCortexApp.openDocDrawer('${linked.id}')">
                    <span>${linked.title} (${linked.version})</span>
                    <span class="linked-arrow">→</span>
                  </div>
                ` : "";
              }).join("")}
            </div>
          </div>
        `;
      }

      if (drawer) drawer.classList.add("drawer-open");
    }

    openDocSnippetDrawer(docId, slideNumber) {
      this.openDocDrawer(docId);
    }

    closeDocDrawer() {
      const drawer = document.getElementById("docDetailDrawer");
      if (drawer) drawer.classList.remove("drawer-open");
    }

    // 4. IMPACT RADAR SCREEN
    renderImpactRadarScreen() {
      const container = document.getElementById("screen-radar");
      if (!container) return;

      container.innerHTML = `
        <div class="radar-screen-grid">
          <div class="card-panel radar-visual-panel">
            <div class="panel-header radar-head">
              <div>
                <h3>Change Impact Radius</h3>
                <span class="panel-subtitle">Target: <strong>SHG CIR Technical Spec v5.0</strong> vs Production Baseline</span>
              </div>
              <div class="radar-actions">
                <button class="btn-radar-diff" onclick="window.TruCortexApp.toggleDiffView()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span id="diffBtnText">View Schema Diff</span>
                </button>
                <button class="btn-explain-ai" onclick="window.TruCortexApp.explainImpactWithAI()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Explain with AI
                </button>
              </div>
            </div>

            <div id="impactRadarSvg" class="radar-svg-wrapper"></div>
          </div>

          <div class="card-panel radar-table-panel">
            <div class="panel-header">
              <h3>Stakeholder Dependency Matrix</h3>
              <span class="panel-subtitle">Click node or row to inspect ripple effects</span>
            </div>
            <div id="impactRadarTable"></div>
          </div>
        </div>

        <div id="impactDiffContainer" class="diff-container" style="display: none;"></div>

        <div id="impactAiStreamPanel" class="ai-stream-panel" style="display: none;">
          <div class="stream-panel-header">
            <h4>TruCortex Impact Rationale Stream</h4>
            <button class="btn-close-stream" onclick="this.parentElement.parentElement.style.display='none'">×</button>
          </div>
          <div id="impactAiStreamBody" class="stream-body"></div>
        </div>
      `;

      window.TruCortexRadarInstance.renderImpactSvg("impactRadarSvg", this.currentUser);
      window.TruCortexRadarInstance.renderImpactTable("impactRadarTable", this.currentUser);
      window.TruCortexRadarInstance.renderDiffView("impactDiffContainer");
    }

    toggleDiffView() {
      const diffContainer = document.getElementById("impactDiffContainer");
      const btnText = document.getElementById("diffBtnText");
      if (!diffContainer) return;

      if (diffContainer.style.display === "none") {
        diffContainer.style.display = "block";
        if (btnText) btnText.textContent = "Hide Schema Diff";
      } else {
        diffContainer.style.display = "none";
        if (btnText) btnText.textContent = "View Schema Diff";
      }
    }

    explainImpactWithAI() {
      const panel = document.getElementById("impactAiStreamPanel");
      const body = document.getElementById("impactAiStreamBody");
      if (!panel || !body) return;

      panel.style.display = "block";
      body.innerHTML = `<span class="typing-cursor">▌</span>`;

      const sourceDoc = { title: "SHG CIR Technical Spec", version: "v5.0" };
      const affectedDocs = window.SEED_IMPACT_RADAR.affectedDocs;

      this.log("LLM", `Streaming Impact Analysis explanation via ${window.TruCortexAIEngine.getCurrentModel().name}...`);

      window.TruCortexAIEngine.explainImpact(sourceDoc, affectedDocs, (streamed) => {
        body.innerHTML = this.formatMarkdown(streamed) + `<span class="typing-cursor">▌</span>`;
      }, (finalText) => {
        body.innerHTML = this.formatMarkdown(finalText);
      });
    }

    // 5. CONFLICTS SCREEN
    renderConflictsScreen() {
      const container = document.getElementById("screen-conflicts");
      if (!container) return;

      container.innerHTML = `
        <div class="conflicts-screen-layout">
          <div class="conflicts-banner">
            <div>
              <h3>Semantic Conflict Radar</h3>
              <p>TruCortex AI continuously scans all registered credit policies, training modules, and API gateway validation rules to flag contradictions before production deployment.</p>
            </div>
            <div class="conflicts-badge-total">
              <strong>${window.SEED_CONFLICT_RADAR.length}</strong> Contradictions Detected
            </div>
          </div>

          <div id="conflictCardsContainer"></div>

          <div id="conflictAiStreamPanel" class="ai-stream-panel" style="display: none;">
            <div class="stream-panel-header">
              <h4>TruCortex Conflict Resolution Guidance</h4>
              <button class="btn-close-stream" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div id="conflictAiStreamBody" class="stream-body"></div>
          </div>
        </div>
      `;

      window.TruCortexRadarInstance.renderConflictCards("conflictCardsContainer", this.currentUser);
    }

    explainConflictWithAI(conflictId) {
      const conf = window.SEED_CONFLICT_RADAR.find(c => c.id === conflictId);
      if (!conf) return;

      const panel = document.getElementById("conflictAiStreamPanel");
      const body = document.getElementById("conflictAiStreamBody");
      if (!panel || !body) return;

      panel.style.display = "block";
      body.innerHTML = `<span class="typing-cursor">▌</span>`;

      this.log("LLM", `Streaming conflict resolution guidance for '${conf.key}'...`);

      window.TruCortexAIEngine.explainConflict(conf, (streamed) => {
        body.innerHTML = this.formatMarkdown(streamed) + `<span class="typing-cursor">▌</span>`;
      }, (finalText) => {
        body.innerHTML = this.formatMarkdown(finalText);
      });
    }

    // 6. UPLOAD & NOTIFY SCREEN (PM ONLY)
    renderUploadScreen() {
      const container = document.getElementById("screen-upload");
      if (!container) return;

      const isPM = this.currentUser && this.currentUser.canApprove;
      if (!isPM) {
        container.innerHTML = `
          <div class="restricted-card">
            <h3>Access Denied: Product Manager Approval Clearance Required</h3>
            <p>Only users with the [Approver] privilege can stage, approve, and broadcast enterprise document revisions.</p>
            <button class="btn-yellow" onclick="window.TruCortexApp.switchUser('vikram')">Switch to Vikram Shah (PM)</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="upload-screen-layout">
          <div class="card-panel upload-form-panel">
            <div class="panel-header">
              <h3>Upload New Document Draft</h3>
              <span class="panel-subtitle">Upload updated credit policy or rule guidelines for impact analysis</span>
            </div>

            <div class="demo-shortcut-banner">
              <div>
                <strong>Interactive Demo Path:</strong> Load pre-configured regulatory release
              </div>
              <button class="btn-demo-shortcut" onclick="window.TruCortexApp.fillDemoUploadForm()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Use demo file: SHG CIR Technical Spec v5.0</span>
              </button>
            </div>

            <div class="drop-zone" id="uploadDropZone" onclick="document.getElementById('fileInputReal').click()">
              <input type="file" id="fileInputReal" style="display:none;" onchange="window.TruCortexApp.handleFileSelect(event)" />
              <div class="drop-icon" style="display:flex; justify-content:center; align-items:center; color:#00A6CA; margin-bottom:12px;">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                  <path d="M12 12v9"/>
                  <polyline points="16 16 12 12 8 16"/>
                </svg>
              </div>
              <div class="drop-text" id="dropZoneText">
                <strong>Drag and drop document file here</strong>, or browse from computer
              </div>
              <div class="drop-sub" id="dropZoneSub">Supports PDF, DOCX, XLSX, JSON (Max 50MB)</div>
            </div>

            <div class="upload-fields-grid">
              <div class="form-group">
                <label>Document Domain / Category</label>
                <select id="uploadDomain" class="form-control">
                  <option value="Microfinance & SHG">Microfinance & SHG</option>
                  <option value="Commercial Vehicle">Commercial Vehicle</option>
                  <option value="MSME Lending">MSME Lending</option>
                  <option value="Technical Architecture">Technical Architecture</option>
                </select>
              </div>

              <div class="form-group">
                <label>Target Version</label>
                <input type="text" id="uploadVersion" class="form-control" placeholder="e.g. v5.0" value="v5.0" />
              </div>

              <div class="form-group">
                <label>Access Clearance Level</label>
                <select id="uploadAccess" class="form-control">
                  <option value="Technical">Technical</option>
                  <option value="Internal">Internal</option>
                  <option value="General">General (Partner-facing)</option>
                  <option value="Product-only">Product-only (Confidential)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Designated Review SLA</label>
                <input type="text" class="form-control" value="2 Working Days (Governance Policy v2.0)" readonly />
              </div>
            </div>

            <div class="form-group">
              <label>Target Notification Teams (Cross-Functional Distribution)</label>
              <div class="checkbox-teams-row">
                <label><input type="checkbox" id="chkTech" checked /> Technical Architecture</label>
                <label><input type="checkbox" id="chkOps" checked /> Operations</label>
                <label><input type="checkbox" id="chkSales" checked /> Commercial Sales</label>
                <label><input type="checkbox" id="chkUAT" checked /> UAT & QA</label>
                <label><input type="checkbox" id="chkProduct" checked /> Product Management</label>
                <label><input type="checkbox" id="chkGov" checked /> Governance</label>
                <label><input type="checkbox" id="chkLnd" checked /> Learning & Development</label>
              </div>
            </div>

            <button class="btn-yellow btn-start-analysis" id="btnRunUploadAnalysis" onclick="window.TruCortexApp.startUploadProcessing()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Run TruCortex Impact Analysis</span>
            </button>
          </div>

          <div class="card-panel upload-report-panel" id="uploadReportPanel" style="display: none;">
            <div id="uploadProgressSteps" class="upload-steps-list"></div>
            <div id="uploadDraftReport" class="draft-report-content" style="display: none;"></div>
          </div>
        </div>
      `;
    }

    fillDemoUploadForm() {
      const domain = document.getElementById("uploadDomain");
      const ver = document.getElementById("uploadVersion");
      const access = document.getElementById("uploadAccess");
      const text = document.getElementById("dropZoneText");
      const sub = document.getElementById("dropZoneSub");

      if (domain) domain.value = "Microfinance & SHG";
      if (ver) ver.value = "v5.0";
      if (access) access.value = "Technical";
      if (text) text.innerHTML = "<strong>SHG_CIR_Technical_Spec_v5.0_FINAL.pdf</strong>";
      if (sub) sub.textContent = "File Size: 3.9 MB · MD5: e82b...9a41";

      this.showToast("Demo file metadata loaded. Ready for impact analysis.", "info");
    }

    handleFileSelect(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const text = document.getElementById("dropZoneText");
      const sub = document.getElementById("dropZoneSub");
      if (text) text.innerHTML = `<strong>${file.name}</strong>`;
      if (sub) sub.textContent = `File Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    }

    startUploadProcessing() {
      const reportPanel = document.getElementById("uploadReportPanel");
      const stepsList = document.getElementById("uploadProgressSteps");
      const draftContent = document.getElementById("uploadDraftReport");
      const runBtn = document.getElementById("btnRunUploadAnalysis");

      if (!reportPanel || !stepsList || !draftContent) return;
      reportPanel.style.display = "block";
      draftContent.style.display = "none";
      if (runBtn) runBtn.disabled = true;

      const steps = [
        { name: "Reading document structure & tokenizing schemas", delay: 1000 },
        { name: "Extracting entities (DPD thresholds, regex fields, SLA constraints)", delay: 2000 },
        { name: "Executing Change Impact Radar against 10 active credit documents", delay: 3200 },
        { name: "Checking semantic contradictions across training & gateway rules", delay: 4200 },
        { name: "Synthesizing executive cross-departmental impact report", delay: 5000 }
      ];

      stepsList.innerHTML = steps.map((s, idx) => `
        <div class="prog-step" id="step-${idx}">
          <span class="step-icon" style="display:inline-flex; align-items:center; color:#718096;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <span class="step-name">${s.name}</span>
        </div>
      `).join("");

      this.log("UPLOAD", "Staging SHG CIR Technical Spec v5.0. Vectorizing document chunks...");

      steps.forEach((step, idx) => {
        setTimeout(() => {
          const stepEl = document.getElementById(`step-${idx}`);
          if (stepEl) {
            stepEl.classList.add("step-complete");
            stepEl.querySelector(".step-icon").innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            `;
          }
          if (idx === 1) this.log("RAG", "Extracted delta: DPD 90->60 days, MANDATORY: SHG_GROUP_ID (CHAR16).");
          if (idx === 2) this.log("RADAR", "Impact computation: 5 affected documents flagged (3 High, 1 Medium, 1 Low).");
          if (idx === 3) this.log("CONFLICT", "Discrepancy identified: Training Module v4.0 still teaches 90 DPD.");
        }, step.delay);
      });

      setTimeout(() => {
        if (runBtn) runBtn.disabled = false;
        draftContent.style.display = "block";
        draftContent.innerHTML = `
          <div class="draft-header">
            <span class="draft-badge">IMPACT REPORT GENERATED</span>
            <h3>SHG CIR Technical Spec v5.0</h3>
            <p>Ready for human gate authorization by Vikram Shah (Product Manager).</p>
          </div>

          <div class="draft-summary-box">
            <h4>Key Findings Summary</h4>
            <ul>
              <li><strong>High Risk:</strong> Learning & Development Module v4.0 must be updated to 60 DPD before field deployment.</li>
              <li><strong>High Risk:</strong> Technical Architecture must add <code>SHG_GROUP_ID</code> to Attribute Master.</li>
              <li><strong>High Risk:</strong> UAT Team must revise 14 regression test cases (TC_SHG_088).</li>
            </ul>
          </div>

          <div class="human-gate-box">
            <div class="gate-info">
              <strong>Human Gate Authorization:</strong>
              <span>Authorizing will commit v5.0 to repository and dispatch personalized alerts to all 4 team leads.</span>
            </div>
            <button class="btn-yellow btn-approve-share" onclick="window.TruCortexApp.approveAndBroadcastDraft()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Approve & Broadcast to Teams</span>
            </button>
          </div>
        `;
        this.log("UPLOAD", "Draft impact assessment ready. Awaiting Product Manager approval.");
      }, 5400);
    }

    approveAndBroadcastDraft() {
      const newNotif = {
        id: "N-SHG50-" + Date.now(),
        title: "New: SHG CIR Technical Spec v5.0 uploaded by Vikram Shah",
        desc: "Regulatory update: 60-day DPD & mandatory SHG_GROUP_ID. Please review required actions.",
        time: "Just now",
        read: false
      };

      ["ananya", "priya", "rohan", "vikram"].forEach(uid => {
        if (!this.notifications[uid]) this.notifications[uid] = [];
        this.notifications[uid].unshift(newNotif);
      });

      this.log("NOTIFY", "Dispatched targeted notifications to 4 stakeholder teams.");
      this.addAuditLog("NOTIFY", "SHG Spec v5.0 approved & notifications dispatched", "INFO");
      
      this.saveState();
      this.updateNotificationBadge();

      localStorage.setItem("trucortex_sync_event", "approval_" + Date.now());

      this.showToast("SHG CIR Spec v5.0 approved! Notifications dispatched across teams.", "success");

      setTimeout(() => {
        this.showToast("Demo Tip: Switch persona to Rohan Mehta (UAT Tester) to test recipient workflow!", "info");
      }, 2000);
    }

    // 7. BENCHMARK SCREEN
    renderBenchmarkScreen() {
      const container = document.getElementById("screen-benchmark");
      if (!container) return;

      const benchmarks = window.SEED_BENCHMARKS;

      container.innerHTML = `
        <div class="benchmark-screen-layout">
          <div class="benchmark-header-row">
            <div>
              <h3>Simulated LLM Performance Benchmark</h3>
              <p>Evaluating inference latency, Time To First Token (TTFT), tokens/sec, and accuracy against financial verification queries.</p>
            </div>
            <button class="btn-yellow" id="btnRunBenchmark" onclick="window.TruCortexApp.runBenchmarkSuite()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Run Live Benchmark</span>
            </button>
          </div>

          <div class="card-panel">
            <table class="cibil-table benchmark-table">
              <thead>
                <tr>
                  <th>BENCHMARK QUERY</th>
                  <th>CATEGORY</th>
                  <th>QWEN3.5-2B Q4_K_M</th>
                  <th>QWEN3.5-2B Q5_K_M</th>
                  <th>QWEN2.5-CODER-3B Q4_K_M</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody id="benchmarkTableBody">
                ${benchmarks.map(bm => `
                  <tr id="bm-row-${bm.id}">
                    <td><strong>${bm.query}</strong></td>
                    <td><span class="cat-pill">${bm.category}</span></td>
                    <td>${bm.results["qwen-3.5-2b-q4"].ttft} · ${bm.results["qwen-3.5-2b-q4"].tps}</td>
                    <td>${bm.results["qwen-3.5-2b-q5"].ttft} · ${bm.results["qwen-3.5-2b-q5"].tps}</td>
                    <td>${bm.results["qwen-2.5-coder-3b"].ttft} · ${bm.results["qwen-2.5-coder-3b"].tps}</td>
                    <td><span class="status-pill status-approved">PASS</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    runBenchmarkSuite() {
      const btn = document.getElementById("btnRunBenchmark");
      if (btn) btn.disabled = true;

      const benchmarks = window.SEED_BENCHMARKS;
      this.log("PERF", "Commencing simulated 3-model x 6-query benchmark evaluation...");

      benchmarks.forEach((bm, idx) => {
        const row = document.getElementById(`bm-row-${bm.id}`);
        if (row) {
          row.style.opacity = "0.5";
        }

        setTimeout(() => {
          if (row) {
            row.style.opacity = "1";
            row.classList.add("row-benchmarked");
          }
          this.log("PERF", `Benchmark [${bm.id}] completed: ${bm.category} - 100% precision verified.`);
          if (idx === benchmarks.length - 1) {
            if (btn) btn.disabled = false;
            this.showToast("Benchmark execution completed across all 3 models.", "success");
          }
        }, (idx + 1) * 600);
      });
    }

    // 8. AUDIT LOG SCREEN
    renderAuditScreen() {
      const container = document.getElementById("screen-audit");
      if (!container) return;

      const logs = window.SEED_AUDIT_LOGS;

      container.innerHTML = `
        <div class="audit-screen-layout">
          <div class="audit-header-row">
            <div>
              <h3>Enterprise Security & Governance Audit Trail</h3>
              <p>Tamper-evident system log tracking authentication, RBAC violations, policy approvals, and notification events.</p>
            </div>
            <div class="audit-actions">
              <button class="btn-micro" onclick="window.TruCortexApp.exportAuditLogs()" style="display:inline-flex; align-items:center;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div class="card-panel">
            <table class="cibil-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>EVENT TAG</th>
                  <th>ACTOR</th>
                  <th>ROLE</th>
                  <th>ACTION</th>
                  <th>DETAILS</th>
                  <th>SEVERITY</th>
                </tr>
              </thead>
              <tbody>
                ${logs.map(log => `
                  <tr class="audit-row-${log.level.toLowerCase()}">
                    <td class="col-time">${log.timestamp}</td>
                    <td><span class="log-tag tag-${log.tag.toLowerCase()}">[${log.tag}]</span></td>
                    <td><strong>${log.actor}</strong></td>
                    <td>${log.role}</td>
                    <td>${log.action}</td>
                    <td>${this.escapeHtml(log.details)}</td>
                    <td><span class="level-pill level-${log.level.toLowerCase()}">${log.level}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    exportAuditLogs() {
      const logs = window.SEED_AUDIT_LOGS;
      const csv = "ID,Timestamp,Tag,Actor,Role,Action,Details,Level\n" + 
        logs.map(l => `"${l.id}","${l.timestamp}","${l.tag}","${l.actor}","${l.role}","${l.action}","${l.details.replace(/"/g, '""')}","${l.level}"`).join("\n");
      
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TruCortex_Audit_Log_${Date.now()}.csv`;
      a.click();
      this.showToast("Exported audit logs to CSV.", "success");
    }

    // Live Logs Terminal Controller
    toggleTerminal() {
      const terminal = document.getElementById("dockedTerminal");
      if (terminal) {
        terminal.classList.toggle("terminal-collapsed");
      }
    }

    togglePresenterMode() {
      this.isPresenterMode = !this.isPresenterMode;
      const terminal = document.getElementById("dockedTerminal");
      const btn = document.getElementById("btnPresenterMode");

      if (terminal) {
        if (this.isPresenterMode) {
          terminal.classList.add("presenter-mode");
          if (btn) btn.classList.add("active");
          this.showToast("Presenter Mode enabled (enlarged log typography).", "info");
        } else {
          terminal.classList.remove("presenter-mode");
          if (btn) btn.classList.remove("active");
          this.showToast("Presenter Mode disabled.", "info");
        }
      }
    }

    clearLiveLogs() {
      this.logs = [];
      const termBody = document.getElementById("terminalLogBody");
      if (termBody) termBody.innerHTML = "";
      this.log("PERF", "Terminal buffer cleared by user.");
    }

    // Dropdown toggles
    toggleModelDropdown() {
      const menu = document.getElementById("modelDropdown");
      if (menu) menu.classList.toggle("menu-open");
      this.hideUserMenu();
      this.hideNotifDropdown();
    }

    hideModelDropdown() {
      const menu = document.getElementById("modelDropdown");
      if (menu) menu.classList.remove("menu-open");
    }

    toggleUserMenu() {
      const menu = document.getElementById("userDropdownMenu");
      if (menu) menu.classList.toggle("menu-open");
      this.hideModelDropdown();
      this.hideNotifDropdown();
    }

    hideUserMenu() {
      const menu = document.getElementById("userDropdownMenu");
      if (menu) menu.classList.remove("menu-open");
    }

    toggleNotifDropdown() {
      const dd = document.getElementById("notifDropdown");
      if (!dd) return;

      if (dd.classList.contains("dropdown-open")) {
        dd.classList.remove("dropdown-open");
      } else {
        this.renderNotifList();
        dd.classList.add("dropdown-open");
      }
      this.hideModelDropdown();
      this.hideUserMenu();
    }

    hideNotifDropdown() {
      const dd = document.getElementById("notifDropdown");
      if (dd) dd.classList.remove("dropdown-open");
    }

    renderNotifList() {
      const listEl = document.getElementById("notifListItems");
      if (!listEl) return;

      const list = this.currentUser ? (this.notifications[this.currentUser.id] || []) : [];
      if (!list.length) {
        listEl.innerHTML = `<div class="notif-empty">No pending alerts.</div>`;
        return;
      }

      listEl.innerHTML = list.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}">
          <div class="notif-item-title">${n.title}</div>
          <div class="notif-item-desc">${n.desc}</div>
          <div class="notif-item-actions">
            <button class="btn-micro" onclick="window.TruCortexApp.switchTab('radar'); window.TruCortexApp.hideNotifDropdown();">View Impact</button>
            <button class="btn-micro" onclick="window.TruCortexApp.acknowledgeNotif('${n.id}')">Acknowledge</button>
          </div>
        </div>
      `).join("");
    }

    clearAllNotifications() {
      if (this.currentUser) {
        this.notifications[this.currentUser.id] = [];
        this.saveState();
        this.updateNotificationBadge();
        this.renderNotifList();
        this.showToast("Notifications cleared.", "info");
      }
    }

    acknowledgeNotif(notifId) {
      if (!this.currentUser) return;
      this.acknowledgements[this.currentUser.id] = true;
      this.saveState();
      this.showToast(`Alert acknowledged by ${this.currentUser.name}.`, "success");
      this.log("ACK", `Notification ${notifId} acknowledged by ${this.currentUser.name}.`);
      this.addAuditLog("ACK", `Acknowledgement recorded for ${this.currentUser.name}`, "INFO");
      this.hideNotifDropdown();
      this.render();
    }

    // Global Keybindings & Search
    bindEvents() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.openSearchOverlay();
        }

        if (e.key === "Escape") {
          this.closeLoginModal();
          this.closeDocDrawer();
          this.closeSearchOverlay();
          this.closeCommandPalette();
          this.hideUserMenu();
          this.hideModelDropdown();
          this.hideNotifDropdown();
        }

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          this.toggleCommandPalette();
        }
      });

      // Close dropdowns on outside click
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".user-chip-wrapper")) {
          this.hideUserMenu();
        }
        if (!e.target.closest(".model-select-wrapper")) {
          this.hideModelDropdown();
        }
        if (!e.target.closest(".notif-wrapper")) {
          this.hideNotifDropdown();
        }
      });

      const palInput = document.getElementById("commandPaletteInput");
      if (palInput) {
        palInput.addEventListener("input", (e) => {
          const val = e.target.value.toLowerCase().trim();
          const items = document.querySelectorAll(".palette-item");
          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (!val || text.includes(val)) {
              item.style.display = "flex";
            } else {
              item.style.display = "none";
            }
          });
        });
      }
    }

    openSearchOverlay() {
      const overlay = document.getElementById("searchOverlay");
      const input = document.getElementById("globalSearchInput");
      if (overlay) {
        overlay.classList.add("overlay-open");
        if (input) {
          input.value = "";
          setTimeout(() => input.focus(), 80);
        }
        this.onGlobalSearchInput("");
      }
    }

    closeSearchOverlay() {
      const overlay = document.getElementById("searchOverlay");
      if (overlay) overlay.classList.remove("overlay-open");
    }

    onGlobalSearchInput(query) {
      const resultsContainer = document.getElementById("searchLiveResults");
      if (!resultsContainer) return;

      const q = (query || "").trim().toLowerCase();
      let matched = [];

      if (!q) {
        matched = window.SEED_DOCUMENTS.slice(0, 4);
      } else {
        matched = window.SEED_DOCUMENTS.filter(doc => {
          const inTitle = doc.title.toLowerCase().includes(q);
          const inCode = doc.code.toLowerCase().includes(q);
          const inSummary = doc.summary.toLowerCase().includes(q);
          const inCat = doc.category.toLowerCase().includes(q);
          const inSnippets = (doc.snippets || []).some(s => 
            s.title.toLowerCase().includes(q) || 
            s.content.toLowerCase().includes(q) || 
            (s.tags || []).some(t => t.toLowerCase().includes(q))
          );
          return inTitle || inCode || inSummary || inCat || inSnippets;
        });
      }

      if (!matched.length) {
        resultsContainer.innerHTML = `
          <div class="search-no-results" style="padding: 24px; text-align: center; color: var(--cibil-text-muted);">
            <p>No credit documents directly matched "<strong>${this.escapeHtml(query)}</strong>".</p>
            <button class="btn-yellow" style="margin-top: 12px; font-size: 0.8125rem; padding: 6px 16px; border-radius: var(--radius-pill); cursor: pointer;" 
                    onclick="window.TruCortexApp.closeSearchOverlay(); window.TruCortexApp.switchTab('ask'); window.TruCortexApp.triggerAskQuery('${this.escapeHtml(query)}');">
              Ask TruCortex AI about "${this.escapeHtml(query)}" &rarr;
            </button>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = matched.map(doc => {
        const isRestricted = doc.accessLevel !== "General" && 
          this.currentUser && 
          !this.currentUser.accessLevels.includes(doc.accessLevel) && 
          !this.currentUser.accessLevels.includes("Approver");

        return `
          <div class="search-result-card" onclick="window.TruCortexApp.openDocFromSearch('${doc.id}')">
            <div class="search-card-left">
              <div class="search-card-title">
                <span>${doc.title}</span>
                <span class="ver-pill">${doc.version}</span>
                <span class="access-pill level-${doc.accessLevel.toLowerCase()}">${doc.accessLevel}</span>
              </div>
              <div class="search-card-meta">
                <span>${doc.category} · Owner: <strong>${doc.owner}</strong></span> &mdash; 
                <span>${doc.summary.substring(0, 110)}...</span>
              </div>
            </div>
            <div class="search-card-action">
              <span>${isRestricted ? 'Restricted' : 'Inspect'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `;
      }).join("");
    }

    execGlobalSearch(term) {
      const input = document.getElementById("globalSearchInput");
      if (input) {
        input.value = term;
        input.focus();
      }
      this.onGlobalSearchInput(term);
    }

    onGlobalSearchEnter(query) {
      this.closeSearchOverlay();
      this.searchQuery = query;
      this.switchTab("documents");
    }

    openDocFromSearch(docId) {
      this.closeSearchOverlay();
      this.openDocDrawer(docId);
    }

    toggleCommandPalette() {
      const pal = document.getElementById("commandPalette");
      if (!pal) return;

      if (pal.classList.contains("palette-open")) {
        pal.classList.remove("palette-open");
      } else {
        pal.classList.add("palette-open");
        const inp = document.getElementById("commandPaletteInput");
        if (inp) {
          inp.value = "";
          setTimeout(() => inp.focus(), 100);
        }
      }
    }

    closeCommandPalette() {
      const pal = document.getElementById("commandPalette");
      if (pal) pal.classList.remove("palette-open");
    }

    // Helper: Escape HTML
    escapeHtml(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Helper: Markdown parser
    formatMarkdown(text) {
      if (!text) return "";
      let html = this.escapeHtml(text);
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      html = html.replace(/^• (.*$)/gim, "<li>$1</li>");
      html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
      html = html.replace(/\n\n/g, "<p></p>").replace(/\n/g, "<br>");
      return html;
    }
  }

  window.TruCortexApp = new TruCortexApp();
})();
