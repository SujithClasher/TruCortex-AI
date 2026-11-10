/**
 * TruCortex AI - Change Impact Radar & Conflict Radar Interactive Visualizer
 * Team Credit Cortex | TransUnion CIBIL
 *
 * NOTE: Ultra-smooth GPU-accelerated vector radar (zero SVG filter lag)
 */

class TruCortexRadar {
  constructor() {
    this.impactData = null;
    this.conflictsData = null;
    this.activeDiff = false;
    this.selectedDocId = null;
  }

  init(impactData, conflictsData) {
    this.impactData = impactData || window.SEED_IMPACT_RADAR;
    this.conflictsData = conflictsData || window.SEED_CONFLICT_RADAR;
  }

  // Render High-Performance GPU-Accelerated SVG Impact Radar
  renderImpactSvg(containerId, currentUser) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 480;
    const height = 440;
    const cx = 240;
    const cy = 220;

    const source = this.impactData;
    const affected = source.affectedDocs;

    let svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" class="radar-svg" width="100%" height="100%">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00A6CA" stop-opacity="0.35"/>
            <stop offset="70%" stop-color="#00A6CA" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#00A6CA" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="sweepGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#00A6CA" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#00A6CA" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="sweepSectorGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#00A6CA" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#00A6CA" stop-opacity="0.02"/>
          </linearGradient>
        </defs>

        <!-- Solid Opaque SVG Background Canvas (transparent, inherits wrapper theme) -->
        <rect width="${width}" height="${height}" rx="10" class="radar-canvas-bg" fill="none"/>

        <!-- Concentric Distance Rings -->
        <circle cx="${cx}" cy="${cy}" r="75" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
        <circle cx="${cx}" cy="${cy}" r="130" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="6 6" fill="none" />
        <circle cx="${cx}" cy="${cy}" r="185" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="8 8" fill="none" />

        <!-- GPU-Accelerated Hardware Sweep Line & Sector (Silky 60fps Native Compositor) -->
        <g>
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 ${cx} ${cy}" 
            to="360 ${cx} ${cy}" 
            dur="6s" 
            repeatCount="indefinite" />
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="35" stroke="url(#sweepGrad)" stroke-width="2" stroke-linecap="round" />
          <polygon points="${cx},${cy} ${cx - 24},38 ${cx},35" fill="url(#sweepSectorGrad)" />
        </g>

        <!-- Connecting Dependency Rays from Center to Affected Nodes -->
        ${affected.map(doc => {
          const rad = (doc.angle * Math.PI) / 180;
          const nx = cx + doc.distance * Math.cos(rad);
          const ny = cy + doc.distance * Math.sin(rad);
          return `
            <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" 
                  stroke="${doc.severityColor}" 
                  stroke-width="1.6" 
                  stroke-dasharray="3 3" 
                  class="radar-connector-line" 
                  data-doc-id="${doc.docId}" />
          `;
        }).join("")}

        <!-- Center Source Document Node (SHG CIR Spec v5.0) -->
        <circle cx="${cx}" cy="${cy}" r="46" fill="url(#centerGlow)" />
        <circle cx="${cx}" cy="${cy}" r="32" fill="#063B5C" stroke="#FFD800" stroke-width="2.5" />
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="'Mulish', sans-serif" font-size="9" font-weight="700" fill="#FFD800">SOURCE</text>
        <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="'Mulish', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">${source.sourceDocVersion}</text>
        <text x="${cx}" y="${cy + 19}" text-anchor="middle" font-family="'Mulish', sans-serif" font-size="8.5" fill="#DCEFF9">SHG Spec</text>

        <!-- Orbiting Affected Document Nodes -->
        ${affected.map((doc) => {
          const rad = (doc.angle * Math.PI) / 180;
          const nx = cx + doc.distance * Math.cos(rad);
          const ny = cy + doc.distance * Math.sin(rad);
          const isSelected = this.selectedDocId === doc.docId;
          const nodeRadius = 18;

          return `
            <g class="radar-node ${isSelected ? 'is-selected' : ''}" 
               id="node-${doc.docId}"
               data-doc-id="${doc.docId}"
               transform="translate(${nx}, ${ny})"
               onclick="window.TruCortexRadarInstance.selectNode('${doc.docId}')"
               onmouseenter="window.TruCortexRadarInstance.showTooltip(event, '${doc.docId}')"
               onmouseleave="window.TruCortexRadarInstance.hideTooltip()">
              
              <!-- Clean Radar Pulse Wave for High Severity (No heavy CPU blur) -->
              ${doc.severity === 'High' ? `
                <circle cx="0" cy="0" r="18" fill="none" stroke="${doc.severityColor}" stroke-width="1.5" opacity="0.6">
                  <animate attributeName="r" values="18;30" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
                </circle>
              ` : ''}

              <!-- Main crisp node circle -->
              <circle cx="0" cy="0" r="${nodeRadius}" fill="#FFFFFF" stroke="${doc.severityColor}" stroke-width="2.5" class="node-main-circle" />
              
              <!-- Department code text -->
              <text x="0" y="4" text-anchor="middle" font-family="'Mulish', sans-serif" font-size="9" font-weight="800" fill="${doc.severityColor}">
                ${doc.department.substring(0, 3).toUpperCase()}
              </text>

              <!-- Node label -->
              <text x="0" y="${nodeRadius + 14}" text-anchor="middle" font-family="'Mulish', sans-serif" font-size="9" font-weight="700" fill="#1F2D3A" class="radar-node-label">
                ${doc.shortTitle || doc.docTitle.split(" ")[0]}
              </text>
            </g>
          `;
        }).join("")}
      </svg>
    `;

    container.innerHTML = svgHtml;
  }

  // Render Table of Affected Documents
  renderImpactTable(containerId, currentUser) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const affected = this.impactData.affectedDocs;
    const canApprove = currentUser && (currentUser.canApprove || currentUser.accessLevels.includes("Approver"));

    let html = `
      <div class="impact-table-wrap">
        <table class="impact-table">
          <thead>
            <tr>
              <th>AFFECTED DOCUMENT</th>
              <th>OWNER / DEPT</th>
              <th>IMPACT RATIONALE</th>
              <th>SEVERITY</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${affected.map(doc => {
              const isSelected = this.selectedDocId === doc.docId;
              const sevBadgeClass = doc.severity === "High" ? "badge-high" : (doc.severity === "Medium" ? "badge-med" : "badge-low");
              const statusClass = doc.status === "Confirmed" ? "status-confirmed" : (doc.status === "Dismissed" ? "status-dismissed" : "status-pending");

              return `
                <tr class="impact-row ${isSelected ? 'row-selected' : ''}" id="row-${doc.docId}" onclick="window.TruCortexRadarInstance.selectNode('${doc.docId}')">
                  <td class="col-doc">
                    <span class="doc-title-link">${doc.docTitle}</span>
                    <span class="doc-code-sub">${doc.docId}</span>
                  </td>
                  <td class="col-owner">
                    <span class="owner-pill">${doc.owner}</span>
                  </td>
                  <td class="col-reason">
                    <span class="reason-text">${doc.reason}</span>
                  </td>
                  <td class="col-sev">
                    <span class="sev-badge ${sevBadgeClass}">${doc.severity}</span>
                  </td>
                  <td class="col-status">
                    <span class="status-pill ${statusClass}">${doc.status}</span>
                  </td>
                  <td class="col-action">
                    ${canApprove ? `
                      <div class="action-btn-group">
                        <button class="btn-micro btn-confirm ${doc.status === 'Confirmed' ? 'active' : ''}" 
                                onclick="event.stopPropagation(); window.TruCortexRadarInstance.setStatus('${doc.docId}', 'Confirmed')">
                          Confirm
                        </button>
                        <button class="btn-micro btn-dismiss ${doc.status === 'Dismissed' ? 'active' : ''}" 
                                onclick="event.stopPropagation(); window.TruCortexRadarInstance.setStatus('${doc.docId}', 'Dismissed')">
                          Dismiss
                        </button>
                      </div>
                    ` : `
                      <span class="readonly-hint" title="Approver clearance required">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Read-only
                      </span>
                    `}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  // Render Diff View
  renderDiffView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const diffLines = this.impactData.diffLines;
    let html = `
      <div class="diff-viewer">
        <div class="diff-header">
          <div class="diff-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A6CA" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>SHG CIR Technical Spec: <strong>v4.0</strong> (Production Baseline) vs <strong>v5.0</strong> (Pending RFC)</span>
          </div>
          <div class="diff-legend">
            <span class="diff-leg-ins">+ Added / Modified</span>
            <span class="diff-leg-del">- Removed / Replaced</span>
          </div>
        </div>
        <div class="diff-code-body">
          ${diffLines.map(line => {
            const cls = line.type === "insert" ? "diff-ins" : (line.type === "delete" ? "diff-del" : "diff-norm");
            return `
              <div class="diff-line ${cls}">
                <span class="diff-num">${line.line}</span>
                <span class="diff-content">${this.escapeHtml(line.text)}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // Render Conflict Radar Cards
  renderConflictCards(containerId, currentUser) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const conflicts = this.conflictsData;
    const canApprove = currentUser && (currentUser.canApprove || currentUser.accessLevels.includes("Approver"));

    let html = `
      <div class="conflicts-grid">
        ${conflicts.map(conf => {
          const isResolved = conf.status === "Resolved" || conf.status === "Dismissed";
          return `
            <div class="conflict-card ${isResolved ? 'card-resolved' : ''}" id="conf-${conf.id}">
              <div class="conflict-header">
                <div class="conflict-title-wrap">
                  <span class="conflict-cat">${conf.category}</span>
                  <h3 class="conflict-key">${conf.key}</h3>
                </div>
                <div class="conflict-badges">
                  <span class="conflict-badge-warn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    ${conf.status === 'Active' ? 'Active Discrepancy' : conf.status}
                  </span>
                </div>
              </div>

              <!-- Side by side comparison -->
              <div class="conflict-comparison">
                <div class="conflict-side side-a">
                  <div class="side-head">
                    <span class="doc-name">${conf.docA.title}</span>
                    <span class="version-tag">${conf.docA.version} · ${conf.docA.slide}</span>
                  </div>
                  <div class="side-body">
                    <div class="spec-value">"${conf.docA.value}"</div>
                    <div class="side-meta">
                      <span>Owner: <strong>${conf.docA.owner}</strong></span>
                      <span class="meta-tag current">${conf.docA.badge}</span>
                    </div>
                  </div>
                </div>

                <div class="conflict-vs">
                  <span>VS</span>
                </div>

                <div class="conflict-side side-b">
                  <div class="side-head">
                    <span class="doc-name">${conf.docB.title}</span>
                    <span class="version-tag">${conf.docB.version} · ${conf.docB.slide}</span>
                  </div>
                  <div class="side-body">
                    <div class="spec-value">"${conf.docB.value}"</div>
                    <div class="side-meta">
                      <span>Owner: <strong>${conf.docB.owner}</strong></span>
                      <span class="meta-tag outdated">${conf.docB.badge}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Context Explanation -->
              <div class="conflict-rationale">
                <strong>Analysis:</strong> ${conf.explanation}
              </div>

              <!-- Action Bar -->
              <div class="conflict-actions">
                <button class="btn-conflict-ai" onclick="window.TruCortexApp.explainConflictWithAI('${conf.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Explain with AI
                </button>

                <div class="conflict-btn-group">
                  ${canApprove ? `
                    <button class="btn-micro btn-confirm ${conf.status === 'Resolved' ? 'active' : ''}" 
                            onclick="window.TruCortexRadarInstance.setConflictStatus('${conf.id}', 'Resolved')">
                      Resolve & Archive Old
                    </button>
                    <button class="btn-micro btn-dismiss ${conf.status === 'Dismissed' ? 'active' : ''}" 
                            onclick="window.TruCortexRadarInstance.setConflictStatus('${conf.id}', 'Dismissed')">
                      Dismiss
                    </button>
                  ` : ''}
                  <button class="btn-micro btn-assign" 
                          onclick="window.TruCortexRadarInstance.assignConflict('${conf.id}', '${conf.docA.owner}')">
                    Assign to Owner (${conf.docA.owner.split(' ')[0]})
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    container.innerHTML = html;
  }

  // In-Place Node Selection & Highlighting (Zero SVG re-creation lag!)
  selectNode(docId) {
    this.selectedDocId = docId;

    // Toggle selected node class in-place
    const allNodes = document.querySelectorAll(".radar-node");
    allNodes.forEach(n => {
      if (n.getAttribute("data-doc-id") === docId) {
        n.classList.add("is-selected");
      } else {
        n.classList.remove("is-selected");
      }
    });

    // Toggle table row selection in-place
    const allRows = document.querySelectorAll(".impact-row");
    allRows.forEach(r => {
      if (r.id === `row-${docId}`) {
        r.classList.add("row-selected");
        r.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        r.classList.remove("row-selected");
      }
    });
  }

  showTooltip(event, docId) {
    const doc = this.impactData.affectedDocs.find(d => d.docId === docId);
    if (!doc) return;

    let tooltip = document.getElementById("radarTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "radarTooltip";
      tooltip.className = "radar-tooltip";
      document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-sev badge-${doc.severity.toLowerCase()}">${doc.severity}</span>
        <strong>${doc.docTitle}</strong>
      </div>
      <div class="tooltip-owner">Department: ${doc.department} · Owner: ${doc.owner}</div>
      <div class="tooltip-reason">${doc.reason}</div>
      <div class="tooltip-sub">Click node to inspect table row</div>
    `;

    tooltip.style.left = `${event.pageX + 15}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.classList.add("visible");
  }

  hideTooltip() {
    const tooltip = document.getElementById("radarTooltip");
    if (tooltip) {
      tooltip.classList.remove("visible");
    }
  }

  setStatus(docId, newStatus) {
    const doc = this.impactData.affectedDocs.find(d => d.docId === docId);
    if (!doc) return;

    doc.status = newStatus;
    if (window.TruCortexApp) {
      window.TruCortexApp.log("RADAR", `Impact item for '${doc.docTitle}' updated to status [${newStatus}] by ${window.TruCortexApp.currentUser.name}.`);
      window.TruCortexApp.addAuditLog("RADAR", `Status Changed: ${doc.docTitle} -> ${newStatus}`, "INFO");
      window.TruCortexApp.showToast(`Updated '${doc.docTitle}' to ${newStatus}`);
      window.TruCortexApp.saveState();
      this.renderImpactTable("impactRadarTable", window.TruCortexApp.currentUser);
    }
  }

  setConflictStatus(conflictId, newStatus) {
    const conf = this.conflictsData.find(c => c.id === conflictId);
    if (!conf) return;

    conf.status = newStatus;
    if (window.TruCortexApp) {
      window.TruCortexApp.log("CONFLICT", `Conflict '${conf.key}' resolved as [${newStatus}] by ${window.TruCortexApp.currentUser.name}.`);
      window.TruCortexApp.addAuditLog("CONFLICT", `Conflict '${conf.key}' set to ${newStatus}`, "INFO");
      window.TruCortexApp.showToast(`Conflict marked as ${newStatus}`);
      window.TruCortexApp.saveState();
      this.renderConflictCards("conflictCardsContainer", window.TruCortexApp.currentUser);
    }
  }

  assignConflict(conflictId, owner) {
    const conf = this.conflictsData.find(c => c.id === conflictId);
    if (!conf) return;

    if (window.TruCortexApp) {
      window.TruCortexApp.log("NOTIFY", `Dispatched automated review assignment for conflict '${conf.key}' to document owner ${owner}.`);
      window.TruCortexApp.addAuditLog("NOTIFY", `Assignment sent to ${owner} for conflict ${conf.key}`, "INFO");
      window.TruCortexApp.showToast(`Assigned review ticket to ${owner}`);
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

window.TruCortexRadarInstance = new TruCortexRadar();
