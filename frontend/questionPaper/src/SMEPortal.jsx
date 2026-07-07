import { useState, useEffect, useCallback } from "react";
import "./SMEPortal.css";
import axios from "axios";

// ─── Axios instance ───────────────────────────────────────────
const api = axios.create({ baseURL: "https://question-paper-app-1.onrender.com/api" });

function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (data) {
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) return `${firstKey}: ${data[firstKey][0]}`;
  }
  if (err?.message === "Network Error") return "Network error — check your connection.";
  return fallback;
}

// ─── SVG Icons ────────────────────────────────────────────────
const Icon = {
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  List: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Inbox: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
};

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_KEYS = ["a", "b", "c", "d"];

// ─── Toast ────────────────────────────────────────────────────
function Toast({ message }) {
  return <div className="toast">{message}</div>;
}
function useToast(duration = 2500) {
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), duration);
    return () => clearTimeout(t);
  }, [toast, duration]);
  return [toast, setToast];
}

// ─── Loading / Error helpers ────────────────────────────────────
function LoadingBlock({ label = "Loading…" }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-secondary)" }}>
      {label}
    </div>
  );
}
function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="publish-warning" style={{ marginBottom: 16 }}>
      <Icon.Alert />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar({ view, setView }) {
  const navItems = [
    { label: "Draft Exams",     icon: <Icon.List />,     key: "drafts" },
    { label: "Create Exam",     icon: <Icon.Plus />,     key: "create" },
    { label: "Published Exams", icon: <Icon.Send />,     key: "published" },
    // {label:"All Exams",key:"Exams"},
    {label:"Result",key:"result"}
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><Icon.Book /></div>
        <div>
          <div className="brand-name">ExamPortal</div>
          <div className="brand-role">SME Dashboard</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-item ${view === item.key ? "active" : ""}`}
            onClick={() => setView(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Icon.LogOut /> Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── Draft Exams list ───────────────────────────────────────────
function DraftExamList({ onOpenExam, onCreateNew }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/question-paper-list/");
      setDrafts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load draft exams."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  return (
    <div className="card">
      <div className="card-title"><Icon.List /> Draft exams</div>

      {loading && <LoadingBlock label="Loading draft exams…" />}
      {!loading && error && <ErrorBanner message={error} onRetry={fetchDrafts} />}

      {!loading && !error && drafts.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No draft exams yet.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <Icon.Plus /> Create exam
          </button>
        </div>
      )}

      {!loading && !error && drafts.length > 0 && (
        <div className="q-list">
          {drafts.map(d => (
            <div className="q-list-item" key={d.id}>
              <div className="q-num-badge"><Icon.Book /></div>
              <div className="q-list-body">
                <div className="q-list-text">{d.exam_name}</div>
                <div className="q-options-preview">
                  <span className="opt-chip">{d.duration} min</span>
                  <span className="opt-chip">Draft</span>
                </div>
              </div>
              <div className="q-list-actions">
                <button className="btn btn-primary btn-sm" onClick={() => onOpenExam(d.id)}>
                  <Icon.Edit /> Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Exam (saves QuestionPaper immediately) ───────────────
function CreateExam({ onCreated }) {
  const [examName, setExamName] = useState("");
  const [duration, setDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valid = examName.trim() && duration && Number(duration) > 0;

  const handleCreate = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/question-paper/", {
        exam_name: examName.trim(),
        duration: Number(duration),
      });
      const questionPaperId = res.data?.question_paper_id;
      if (!questionPaperId) throw new Error("Server did not return a question_paper_id.");
      onCreated(questionPaperId); // navigate to question management
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create the exam."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title"><Icon.Settings /> Create exam</div>

      <ErrorBanner message={error} />

      <div className="form-group">
        <label className="form-label">Exam title *</label>
        <input
          className="form-input"
          placeholder="e.g. General Knowledge Test — Batch A"
          value={examName}
          onChange={e => setExamName(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Duration (minutes) *</label>
        <input
          className="form-input"
          type="number"
          min="5"
          placeholder="e.g. 30"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          disabled={submitting}
        />
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={handleCreate}
        disabled={!valid || submitting}
        style={{ opacity: valid && !submitting ? 1 : 0.5 }}
      >
        <Icon.Plus /> {submitting ? "Creating…" : "Create exam & add questions"}
      </button>
    </div>
  );
}

// ─── Question Manager (backend is source of truth) ───────────────
const BLANK_FORM = () => ({ text: "", options: ["", "", "", ""], correct: null });

function QuestionManager({ questionPaperId, onGoToReview, onBack,userId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(BLANK_FORM());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();
  

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/question-paper/${questionPaperId}/questions/`);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load questions for this exam."));
    } finally {
      setLoading(false);
    }
  }, [questionPaperId]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const updateOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm(p => ({ ...p, options: opts }));
  };

  const toPayload = (f) => ({
    user_id:userId,
    question_paper_id: questionPaperId,
    question_text: f.text.trim(),
    option_a: f.options[0],
    option_b: f.options[1],
    option_c: f.options[2],
    option_d: f.options[3],
    correct_answer: OPTION_LABELS[f.correct],
  });

  const saveQuestion = async () => {
    if (!form.text.trim()) return showToast("Please enter the question text.");
    if (form.options.some(o => !o.trim())) return showToast("Please fill all 4 options.");
    if (form.correct === null) return showToast("Please select the correct answer.");

    setSaving(true);
    try {
      if (editingId !== null) {
        await api.put(`/questions/${editingId}/`, toPayload(form));
        showToast("Question updated.");
      } else {
        console.log(userId)
        await api.post("/questions/", toPayload(form));
        showToast("Question saved!");
      }
      setForm(BLANK_FORM());
      setEditingId(null);
      await fetchQuestions();
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't save the question."));
    } finally {
      setSaving(false);
    }
  };

  const editQuestion = (q) => {
    setForm({
      text: q.question_text,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correct: OPTION_LABELS.indexOf(q.correct_answer),
    });
    setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteQuestion = async (id) => {
    try {
      await api.delete(`/questions/${id}/`);
      setQuestions(qs => qs.filter(q => q.id !== id));
      showToast("Question deleted.");
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't delete the question."));
    }
  };

  const cancelEdit = () => {
    setForm(BLANK_FORM());
    setEditingId(null);
  };

  return (
    <>
      <div className="card">
        <div className="card-title">
          <Icon.Plus /> {editingId !== null ? "Edit question" : "Add a question"}
        </div>

        <div className="form-group">
          <label className="form-label">Question text *</label>
          <textarea
            className="form-textarea"
            placeholder="Type your question here…"
            value={form.text}
            onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
            disabled={saving}
          />
        </div>

        <div className="form-label" style={{ marginBottom: 10 }}>Options *</div>
        <div className="options-grid">
          {form.options.map((opt, i) => (
            <div className="option-input-row" key={i}>
              <div className={`option-label-badge ${form.correct === i ? "correct" : ""}`}>
                {OPTION_LABELS[i]}
              </div>
              <input
                className="form-input"
                placeholder={`Option ${OPTION_LABELS[i]}`}
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                disabled={saving}
              />
            </div>
          ))}
        </div>

        <div className="correct-answer-row">
          <span className="correct-answer-label">Correct answer:</span>
          {OPTION_LABELS.map((lbl, i) => (
            <button
              key={i}
              className={`correct-btn ${form.correct === i ? "selected" : ""}`}
              onClick={() => setForm(p => ({ ...p, correct: i }))}
              disabled={saving}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={saveQuestion} disabled={saving} style={{ flex: 2 }}>
            {editingId !== null
              ? <><Icon.Check /> {saving ? "Updating…" : "Update question"}</>
              : <><Icon.Plus /> {saving ? "Saving…" : "Save question"}</>}
          </button>
          {editingId !== null && (
            <button className="btn btn-outline" onClick={cancelEdit} disabled={saving} style={{ flex: 1 }}>Cancel</button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><Icon.List /> Saved questions {!loading && `(${questions.length})`}</div>

        {loading && <LoadingBlock label="Loading questions…" />}
        {!loading && error && <ErrorBanner message={error} onRetry={fetchQuestions} />}

        {!loading && !error && questions.length === 0 && (
          <p style={{ color: "var(--text-secondary)" }}>No questions added yet.</p>
        )}

        {!loading && !error && questions.length > 0 && (
          <div className="q-list">
            {questions.map((q, idx) => (
              <div className="q-list-item" key={q.id}>
                <div className="q-num-badge">{idx + 1}</div>
                <div className="q-list-body">
                  <div className="q-list-text">{q.question}</div>
                  <div className="q-options-preview">
                    {OPTION_KEYS.map((key, i) => (
                      
                      <span key={key} className={`opt-chip ${q.correct_answer === OPTION_LABELS[i]? "correct" : ""}`}>
                        {OPTION_LABELS[i]}: {q[key]}
                        
                      </span>
                    ))}
                  </div>
                </div>
                <div className="q-list-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => editQuestion(q)} title="Edit">
                    <Icon.Edit />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteQuestion(q.id)} title="Delete">
                    <Icon.Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="btn btn-outline" onClick={onBack} style={{ flex: 1 }}>Back to drafts</button>
        <button
          className="btn btn-primary"
          onClick={() => onGoToReview(questionPaperId)}
          disabled={questions.length === 0}
          style={{ flex: 2, opacity: questions.length === 0 ? 0.5 : 1 }}
        >
          <Icon.List /> Review {questions.length} question{questions.length !== 1 ? "s" : ""}
        </button>
      </div>

      {toast && <Toast message={toast} />}
    </>
  );
}

// ─── Review (fetches from backend) ───────────────────────────────
function ReviewExam({ questionPaperId, onBack, onPublished }) {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [questionsRes, draftsRes] = await Promise.all([
        api.get(`/question-paper/${questionPaperId}/questions/`),
        api.get("/question-paper-list/"),
      ]);
      console.log("lol",questionsRes)
      setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : []);
      const found = (draftsRes.data || []).find(d => d.id === questionPaperId);
      setExam(found || null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load exam details."));
    } finally {
      setLoading(false);
    }
  }, [questionPaperId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handlePublish = async () => {
    setPublishing(true);
    setError("");
    try {
      // await api.put(`/question-paper/${questionPaperId}/publish/`);
      await api.post("/start-exam/",{question_paper_id:questionPaperId})
      onPublished();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't publish the exam."));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="card"><LoadingBlock label="Loading review…" /></div>;

  return (
    <>
      <div className="card">
        <div className="card-title"><Icon.Settings /> Exam summary</div>
        <ErrorBanner message={error} onRetry={fetchAll} />
        <div className="summary-grid">
          <div className="summary-stat">
            <div className="summary-val">{questions.length}</div>
            <div className="summary-lbl">Questions</div>
          </div>
          <div className="summary-stat">
            <div className="summary-val">{exam?.duration ?? "—"}</div>
            <div className="summary-lbl">Minutes</div>
          </div>
          <div className="summary-stat">
            <div className="summary-val">{questions.length}</div>
            <div className="summary-lbl">Total marks</div>
          </div>
        </div>
        {exam?.exam_name && (
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Title:</strong> {exam.exam_name}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title"><Icon.List /> All questions</div>
        <div className="q-list">
          {questions.map((q, idx) => (
            <div className="q-list-item" key={q.id}>
              <div className="q-num-badge">{idx + 1}</div>
              <div className="q-list-body">
                <div className="q-list-text">{q.question}</div>
                <div className="q-options-preview">
                  {OPTION_KEYS.map((key, i) => (
                    <span key={key} className={`opt-chip ${q.correct_answer === OPTION_LABELS[i] ? "correct" : ""}`}>
                      {OPTION_LABELS[i]}: {q[key]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="btn btn-outline" onClick={onBack} style={{ flex: 1 }}>Back & edit</button>
        <button className="btn btn-success" onClick={handlePublish} disabled={publishing} style={{ flex: 2 }}>
          <Icon.Send /> {publishing ? "Publishing…" : "publish"}
        </button>
      </div>
    </>
  );
}

// ─── Published Exams list ───────────────────────────────────────
function PublishedExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPublished = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/question-paper/published/");
      setExams(Array.isArray(res.data) ? res.data : []);
      console.log("i am called")
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load published exams."));
    } finally {
      setLoading(false);
    }
  }, []);


  const stopExam = async (id)=>{
   const res = await api.post("stop-exam/",{question_paper_id:id})
   fetchPublished()
  }

  useEffect(() => { fetchPublished(); }, [fetchPublished]);

  return (
    <div className="card">
      <div className="card-title"><Icon.Send /> Published exams</div>

      {loading && <LoadingBlock label="Loading published exams…" />}
      {!loading && error && <ErrorBanner message={error} onRetry={fetchPublished} />}

      {!loading && !error && exams.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>No exams published yet.</p>
      )}

      {!loading && !error && exams.length > 0 && (
        <div className="q-list">
          {exams.map(e => (
            <div className="q-list-item" key={e.id}>
              <div className="q-num-badge"><Icon.Check /></div>
              <div className="q-list-body">
                <div className="q-list-text">{e.exam_name}</div>
                <div className="q-options-preview">
                  <span className="opt-chip correct">Published</span>
                  <button className="opt-chip" onClick={()=>stopExam(e.id)}>stop</button>
                  {e.duration && <span className="opt-chip">{e.duration} min</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function ExamResultsScreen({ questionPaperId }) {
  const [results, setResults] = useState([]);
  const [paperTitle, setPaperTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("score"); // "score" | "submitted_at" | "user"

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`results/`);
      setPaperTitle(res.data.title || "");
      setResults(Array.isArray(res.data.attempts) ? res.data.attempts : []);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load results."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [questionPaperId]);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "submitted_at") return new Date(b.submitted_at) - new Date(a.submitted_at);
    if (sortBy === "user") return a.user_name.localeCompare(b.user_name);
    return 0;
  });

  const average =
    results.length > 0
      ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
      : null;

  if (loading) {
    return <div className="results-loading">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="results-error">
        <span>{error}</span>
        <button onClick={fetchResults}>Retry</button>
      </div>
    );
  }

  if (results.length === 0) {
    return <div className="results-empty">No submissions yet for this exam.</div>;
  }

  return (
    <div className="results-screen">
      <div className="results-header">
        <h2 className="results-title">{paperTitle || "Exam results"}</h2>
        <span className="results-summary">
          {results.length} submission{results.length !== 1 ? "s" : ""}
          {average !== null && ` · avg score ${average}`}
        </span>
      </div>

      <div className="results-sort">
        <label htmlFor="sortBy">Sort by:</label>
        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score">Score</option>
          <option value="submitted_at">Submission time</option>
          <option value="user">Name</option>
        </select>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Submitted at</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((r) => (
            <tr key={r.attempt_id}>
              <td>{r.user_name}</td>
              <td>
                {r.score} 
                {/* / {r.total} */}
              </td>
              <td>{new Date(r.submitted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// ─── App Root ─────────────────────────────────────────────────
export default function SMEPortal() {
  const [view, setView] = useState("drafts"); // "drafts" | "create" | "manage" | "review" | "published"
  const [activeQuestionPaperId, setActiveQuestionPaperId] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user["user id"]

  const openExam = (id) => {
    setActiveQuestionPaperId(id);
    setView("manage");
  };
  const openPublish = (id) => {
    setActiveQuestionPaperId(id);
    // setView("manage");
  };
  console.log(userId)

  const handleCreated = (questionPaperId) => {
    setActiveQuestionPaperId(questionPaperId);
    setView("manage"); // auto-navigate to question management
  };

  const headerCopy = {
    drafts:    { title: "Draft exams",  sub: "Resume work on an exam that hasn't been published yet." },
    create:    { title: "Create exam",  sub: "Set the title and duration to get started." },
    manage:    { title: "Manage questions", sub: "Add, edit, or remove questions for this exam." },
    review:    { title: "Review",       sub: "Check all questions before publishing." },
    published: { title: "Published exams", sub: "Exams currently live for students." },
    result:    {title:"Result",sub:"Exam Results"}
  }[view];

  return (
    <div className="sme-layout">
      <Sidebar view={view} setView={setView} />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">{headerCopy.title}</h1>
          <p className="page-sub">{headerCopy.sub}</p>
        </div>

        {view === "drafts" && (
          <DraftExamList
            onOpenExam={openExam}
            onCreateNew={() => setView("create")}
          />
        )}

        {view === "create" && (
          <CreateExam onCreated={handleCreated} />
        )}

        {view === "manage" && activeQuestionPaperId && (
          <QuestionManager
            questionPaperId={activeQuestionPaperId}
            onGoToReview={() => setView("review")}
            onBack={() => setView("drafts")}
            userId={userId}
          />
        )}

        {view === "review" && activeQuestionPaperId && (
          <ReviewExam
            questionPaperId={activeQuestionPaperId}
            onBack={() => setView("manage")}
            onPublished={() => setView("published")}
          />
        )}

        {view === "published" && (
          
          <PublishedExamList 
            // questionPaperId={activeQuestionPaperId}

          />
        )}

        {view === "result" && (
          
          <ExamResultsScreen
            questionPaperId={activeQuestionPaperId}
          />
        )}
      </main>
    </div>
  );
}
