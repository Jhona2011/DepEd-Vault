import { useState } from "react";

/* ---------------- Mock data (replace with API data) ---------------- */

const LEARNERS = [
  { id: "136452100213", name: "Bianca M. Santos", status: "flagged", statusLabel: "Needs review", updated: "3 days ago" },
  { id: "136452100248", name: "Carlo J. Dizon", status: "flagged", statusLabel: "Address changed", updated: "1 day ago" },
  { id: "136452100301", name: "Ella R. Tan", status: "verified", statusLabel: "Verified", updated: "2 weeks ago" },
  { id: "136452100355", name: "Marco V. Lucero", status: "verified", statusLabel: "Verified", updated: "1 month ago" },
];

const LEARNER_DETAIL = {
  "136452100213": {
    name: "Bianca M. Santos",
    lrn: "136452100213",
    dob: "04/12/2010",
    guardian: "Rosa Santos",
    contact: "09171234567",
    address: "Purok 3, Malaybalay City",
    status: "Active",
    section: "Grade 10 – Aguinaldo",
  },
};

const INITIAL_ATTENDANCE = [
  { id: "136452100213", name: "Bianca M. Santos", status: "present" },
  { id: "136452100248", name: "Carlo J. Dizon", status: "late" },
  { id: "136452100301", name: "Ella R. Tan", status: "absent" },
  { id: "136452100355", name: "Marco V. Lucero", status: "present" },
];

const SUBJECTS = ["Filipino X", "English X", "Mathematics", "Science", "Araling Panlipunan"];

const INITIAL_GRADES = {
  "Filipino X": [
    { id: "136452100213", name: "Bianca M. Santos", ww: 88, pt: 90, exam: 85 },
    { id: "136452100248", name: "Carlo J. Dizon", ww: 74, pt: 70, exam: 68 },
    { id: "136452100301", name: "Ella R. Tan", ww: 92, pt: 95, exam: 91 },
    { id: "136452100355", name: "Marco V. Lucero", ww: 80, pt: 83, exam: 79 },
  ],
};

/* ---------------- Helpers ---------------- */

function quarterGrade(row) {
  return Math.round((row.ww + row.pt + row.exam) / 3);
}

/* ---------------- Component ---------------- */

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("profiles");
  const [selectedLearnerId, setSelectedLearnerId] = useState("136452100213");
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [activeSubject, setActiveSubject] = useState("Filipino X");
  const [grades, setGrades] = useState(INITIAL_GRADES);

  const selectedLearner = LEARNER_DETAIL[selectedLearnerId];
  const subjectRows = grades[activeSubject] || [];

  const attendanceCounts = attendance.reduce(
    (acc, r) => {
      acc[r.status] += 1;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  );

  function setAttendanceStatus(id, status) {
    setAttendance((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function updateGradeField(id, field, value) {
    setGrades((prev) => ({
      ...prev,
      [activeSubject]: (prev[activeSubject] || []).map((row) =>
        row.id === id ? { ...row, [field]: Number(value) || 0 } : row
      ),
    }));
  }

  return (
    <div style={styles.app}>
      <TopBar />

      <div style={styles.shell}>
        <SideBar activeTab={activeTab} onNavigate={setActiveTab} />

        <main style={styles.main}>
          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "profiles" && (
            <ProfilesScreen
              learners={LEARNERS}
              selected={selectedLearner}
              onSelect={setSelectedLearnerId}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceScreen
              rows={attendance}
              counts={attendanceCounts}
              onSetStatus={setAttendanceStatus}
            />
          )}

          {activeTab === "grades" && (
            <GradesScreen
              subjects={SUBJECTS}
              activeSubject={activeSubject}
              onSubjectChange={setActiveSubject}
              rows={subjectRows}
              onFieldChange={updateGradeField}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Layout pieces ---------------- */

function TopBar() {
  return (
    <div style={styles.topbar}>
      <div style={styles.brand}>
        <div style={styles.badge}>DE</div>
        <div>
          School Forms Management System
          <br />
          <small style={{ fontWeight: 400, opacity: 0.65, fontSize: 10 }}>
            DepEd — Teacher Portal
          </small>
        </div>
      </div>
      <div style={styles.who}>
        <div style={styles.avatar} />
        Ms. Reyes
      </div>
    </div>
  );
}

function SideBar({ activeTab, onNavigate }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "profiles", label: "Learner Profiles" },
    { key: "attendance", label: "Attendance" },
    { key: "grades", label: "Grades" },
    { key: "settings", label: "Settings" },
  ];
  return (
    <aside style={styles.sidebar}>
      <div style={styles.navLabel}>NAVIGATION</div>
      {items.map((item) => (
        <div
          key={item.key}
          onClick={() => item.key !== "dashboard" && item.key !== "settings" && onNavigate(item.key)}
          style={{
            ...styles.navItem,
            ...(activeTab === item.key ? styles.navItemActive : {}),
          }}
        >
          <span style={styles.navDot} />
          {item.label}
        </div>
      ))}

      <div style={styles.classCard}>
        <div style={{ fontSize: 9, color: "#8fa0bd" }}>CURRENT CLASS</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 }}>
          Grade 10 – Aguinaldo
        </div>
        <div style={{ fontSize: 11, color: "#a9b6cb", marginTop: 2 }}>Subject: Filipino X</div>
      </div>
    </aside>
  );
}

function Tabs({ activeTab, onChange }) {
  const tabs = [
    { key: "profiles", label: "Update Learner Profiles" },
    { key: "attendance", label: "Record Daily Attendance" },
    { key: "grades", label: "Record Grades & Learning Progress" },
  ];
  return (
    <div style={styles.tabs}>
      {tabs.map((t) => (
        <div
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            ...styles.tab,
            ...(activeTab === t.key ? styles.tabActive : {}),
          }}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Screen 1: Learner Profiles ---------------- */

function ProfilesScreen({ learners, selected, onSelect }) {
  return (
    <section>
      <h1 style={styles.h1}>Update Learner Profiles</h1>
      <p style={styles.sub}>
        Maintain accurate personal and enrollment information for Grade 10 – Aguinaldo · 42 learners
      </p>

      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <h3 style={styles.panelTitle}>Class roster</h3>
          <input style={styles.searchInput} placeholder="Search learner name or LRN…" />
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Learner</th>
              <th style={styles.th}>LRN</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Last updated</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {learners.map((l) => (
              <tr key={l.id}>
                <td style={styles.td}>
                  <b>{l.name}</b>
                </td>
                <td style={{ ...styles.td, ...styles.lrn }}>{l.id}</td>
                <td style={styles.td}>
                  <span style={l.status === "verified" ? styles.tagVerified : styles.tagFlagged}>
                    {l.statusLabel}
                  </span>
                </td>
                <td style={{ ...styles.td, ...styles.lrn }}>{l.updated}</td>
                <td style={styles.td}>
                  <span style={styles.linkBtn} onClick={() => onSelect(l.id)}>
                    Edit
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Edit — {selected.name}</h3>
          <div style={styles.formGrid}>
            <Field label="Full name" defaultValue={selected.name} />
            <Field label="LRN" defaultValue={selected.lrn} />
            <Field label="Date of birth" defaultValue={selected.dob} />
            <Field label="Guardian name" defaultValue={selected.guardian} />
            <Field label="Contact number" defaultValue={selected.contact} />
            <Field label="Home address" defaultValue={selected.address} />
            <div style={styles.field}>
              <label style={styles.label}>Enrollment status</label>
              <select style={styles.input} defaultValue={selected.status}>
                <option>Active</option>
                <option>Transferred</option>
                <option>Dropped</option>
              </select>
            </div>
            <Field label="Grade & Section" defaultValue={selected.section} disabled />
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button style={styles.btnPrimary}>Save changes</button>
            <button style={styles.btnOutline}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, defaultValue, disabled }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} defaultValue={defaultValue} disabled={disabled} />
    </div>
  );
}

/* ---------------- Screen 2: Attendance ---------------- */

function AttendanceScreen({ rows, counts, onSetStatus }) {
  return (
    <section>
      <h1 style={styles.h1}>Record Daily Attendance</h1>
      <p style={styles.sub}>Grade 10 – Aguinaldo · Filipino X · Today</p>

      <div style={styles.attSummary}>
        <Summary value={counts.present} label="Present" />
        <Summary value={counts.late} label="Late" />
        <Summary value={counts.absent} label="Absent" />
        <Summary value={rows.length} label="Total learners" />
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <h3 style={styles.panelTitle}>Mark attendance</h3>
          <input style={styles.searchInput} placeholder="Search learner…" />
        </div>

        {rows.map((r) => (
          <div key={r.id} style={styles.attRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#5c6b7f", fontSize: 11 }}>LRN {r.id}</div>
            </div>
            <div style={styles.seg}>
              {["present", "late", "absent"].map((status, i, arr) => (
                <button
                  key={status}
                  onClick={() => onSetStatus(r.id, status)}
                  style={{
                    ...styles.segBtn,
                    ...(i < arr.length - 1 ? styles.segBtnBorder : {}),
                    ...(r.status === status ? styles.segBtnOn[status] : {}),
                  }}
                >
                  {status[0].toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button style={styles.btnPrimary}>Submit attendance</button>
          <button style={styles.btnOutline}>Save as draft</button>
        </div>
      </div>
    </section>
  );
}

function Summary({ value, label }) {
  return (
    <div style={{ fontSize: 12, color: "#5c6b7f" }}>
      <b style={{ color: "#16202e", fontSize: 16, display: "block" }}>{value}</b>
      {label}
    </div>
  );
}

/* ---------------- Screen 3: Grades ---------------- */

function GradesScreen({ subjects, activeSubject, onSubjectChange, rows, onFieldChange }) {
  return (
    <section>
      <h1 style={styles.h1}>Record Grades and Learning Progress</h1>
      <p style={styles.sub}>Grade 10 – Aguinaldo · Quarter 2</p>

      <div style={styles.subjectPill}>
        {subjects.map((s) => (
          <span
            key={s}
            onClick={() => onSubjectChange(s)}
            style={{
              ...styles.pill,
              ...(activeSubject === s ? styles.pillActive : {}),
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <h3 style={styles.panelTitle}>Quarter 2 grades — {activeSubject}</h3>
          <span style={styles.tagVerified}>Auto-saved</span>
        </div>

        {rows.length === 0 ? (
          <p style={{ color: "#5c6b7f", fontSize: 13 }}>No grade records yet for this subject.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Learner</th>
                <th style={styles.th}>Written Work</th>
                <th style={styles.th}>Perf. Task</th>
                <th style={styles.th}>Exam</th>
                <th style={styles.th}>Quarter Grade</th>
                <th style={styles.th}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const q = quarterGrade(row);
                const atRisk = q < 75;
                return (
                  <tr key={row.id}>
                    <td style={styles.td}>
                      <b>{row.name}</b>
                    </td>
                    <td style={styles.td}>
                      <input
                        style={styles.gradeInput}
                        type="number"
                        value={row.ww}
                        onChange={(e) => onFieldChange(row.id, "ww", e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        style={styles.gradeInput}
                        type="number"
                        value={row.pt}
                        onChange={(e) => onFieldChange(row.id, "pt", e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        style={styles.gradeInput}
                        type="number"
                        value={row.exam}
                        onChange={(e) => onFieldChange(row.id, "exam", e.target.value)}
                      />
                    </td>
                    <td style={styles.td}>
                      <span style={atRisk ? styles.badgeRisk : styles.badgePass}>{q}</span>
                    </td>
                    <td style={styles.td}>
                      {atRisk ? "At risk" : "On track"}
                      <span style={styles.progressBar}>
                        <span style={{ ...styles.progressFill, width: `${Math.min(q, 100)}%` }} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button style={styles.btnPrimary}>Save grades</button>
          <button style={styles.btnOutline}>Lock quarter</button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Styles ---------------- */

const navy = "#12233f";
const blue = "#2f5fa8";
const blueLight = "#eaf1fb";
const green = "#1f8a52";
const greenBg = "#e7f6ee";
const amber = "#b8790a";
const amberBg = "#fdf1de";
const red = "#c0392b";
const redBg = "#fbeceb";
const ink = "#16202e";
const sub = "#5c6b7f";
const line = "#e6e9ef";
const bg = "#f5f6f8";
const card = "#ffffff";

const styles = {
  app: { background: bg, color: ink, fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif", minHeight: "100vh" },
  topbar: { position: "sticky", top: 0, zIndex: 20, background: navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 56 },
  brand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 14 },
  badge: { width: 30, height: 30, borderRadius: "50%", background: "#fff", color: navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 },
  who: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  avatar: { width: 26, height: 26, borderRadius: "50%", background: blue },

  shell: { display: "flex", minHeight: "calc(100vh - 56px)" },
  sidebar: { width: 200, flexShrink: 0, background: navy, color: "#cdd6e4", padding: "18px 12px" },
  navLabel: { fontSize: 10, letterSpacing: ".04em", color: "#7c8aa3", padding: "0 10px 8px" },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, fontSize: 13, marginBottom: 2, color: "#cdd6e4", cursor: "pointer" },
  navItemActive: { background: blue, color: "#fff", fontWeight: 600 },
  navDot: { width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.5 },
  classCard: { marginTop: 18, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: 12 },

  main: { flex: 1, padding: "28px 32px 56px", maxWidth: 1150 },

  tabs: { display: "flex", gap: 6, marginBottom: 22, borderBottom: `1px solid ${line}`, overflowX: "auto" },
  tab: { padding: "10px 16px", fontSize: 13, fontWeight: 600, color: sub, cursor: "pointer", borderBottom: "2px solid transparent", whiteSpace: "nowrap" },
  tabActive: { color: navy, borderBottom: `2px solid ${blue}` },

  h1: { fontSize: 22, margin: "0 0 4px", letterSpacing: "-.01em" },
  sub: { color: sub, fontSize: 13, margin: "0 0 22px" },

  panel: { background: card, border: `1px solid ${line}`, borderRadius: 14, padding: 20, marginBottom: 16 },
  panelHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 },
  panelTitle: { fontSize: 14, margin: 0 },

  searchInput: { border: `1px solid ${line}`, borderRadius: 8, padding: "8px 12px", fontSize: 12.5, width: 220, color: ink },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", color: sub, fontWeight: 600, fontSize: 11, letterSpacing: ".02em", padding: "8px 10px", borderBottom: `1px solid ${line}` },
  td: { padding: 10, borderBottom: `1px solid ${line}`, verticalAlign: "middle" },
  lrn: { color: sub, fontSize: 11.5 },

  tagVerified: { fontSize: 10.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: greenBg, color: green },
  tagFlagged: { fontSize: 10.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: amberBg, color: amber },
  linkBtn: { color: blue, fontSize: 12, fontWeight: 600, cursor: "pointer" },

  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: {},
  label: { display: "block", fontSize: 11.5, color: sub, marginBottom: 6, fontWeight: 600 },
  input: { width: "100%", border: `1px solid ${line}`, borderRadius: 8, padding: "9px 11px", fontSize: 13, color: ink, background: "#fff" },

  btnPrimary: { border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: blue, color: "#fff" },
  btnOutline: { border: `1px solid ${line}`, borderRadius: 8, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: "#fff", color: ink },

  attSummary: { display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" },
  attRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 4px", borderBottom: `1px solid ${line}`, fontSize: 13 },
  seg: { display: "flex", border: `1px solid ${line}`, borderRadius: 8, overflow: "hidden" },
  segBtn: { border: "none", background: "#fff", padding: "6px 12px", fontSize: 11.5, fontWeight: 600, color: sub, cursor: "pointer" },
  segBtnBorder: { borderRight: `1px solid ${line}` },
  segBtnOn: {
    present: { background: greenBg, color: green },
    late: { background: amberBg, color: amber },
    absent: { background: redBg, color: red },
  },

  subjectPill: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  pill: { padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${line}`, color: sub, cursor: "pointer" },
  pillActive: { background: navy, color: "#fff", borderColor: navy },

  gradeInput: { width: 54, border: `1px solid ${line}`, borderRadius: 6, padding: "6px 7px", fontSize: 12.5, textAlign: "center" },
  badgePass: { fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: greenBg, color: green },
  badgeRisk: { fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: amberBg, color: amber },
  progressBar: { width: 80, height: 6, borderRadius: 4, background: line, overflow: "hidden", display: "inline-block", verticalAlign: "middle", marginLeft: 8 },
  progressFill: { display: "block", height: "100%", background: blue },
};