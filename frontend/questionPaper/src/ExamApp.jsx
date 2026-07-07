import { useState, useEffect } from "react";
import "./ExamApp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const api = axios.create({ baseURL: "https://question-paper-app-1.onrender.com/api" });

// ─── Sample data ───────────────────────────────────────────────
const QUESTIONS = [
  {
    text: "What is the capital of France?",
    options: ["Berlin", "Paris", "Rome", "Madrid"],
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Shakespeare", "Dickens", "Tolstoy", "Hemingway"],
  },
  {
    text: "What is the chemical symbol for gold?",
    options: ["Ag", "Gd", "Au", "Go"],
  },
  {
    text: "Which planet has the most known moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
  },
  {
    text: "What is the approximate speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
  },
  {
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Rembrandt", "Da Vinci"],
  },
  {
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Arctic", "Indian", "Pacific"],
  },
  {
    text: "How many bones are in the adult human body?",
    options: ["206", "180", "256", "212"],
  },
  {
    text: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
  },
  {
    text: "What is the tallest mountain on Earth?",
    options: ["K2", "Kangchenjunga", "Everest", "Lhotse"],
  },
];

const TOTAL = QUESTIONS.length;


const OPTION_LABELS = ["A", "B", "C", "D"];
const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

// ─── Icons (inline SVG) ────────────────────────────────────────
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Exam Screen ───────────────────────────────────────────────
// function ExamScreen({ onSubmit }) {
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [seconds, setSeconds] = useState(EXAM_DURATION);
//   const [QUESTIONS,setQuestions]=useState([])
//   const [TOTAL,setTotal] = useState(0)


//   const fetchQuestionPaper = async ()=>{
//     console.log("I am called fetch")
//     try {
//       const res = await api.get("/question-paper/published/");
//       if (res.data){
//         const questions = await api.get(`question-paper/${res.data[0].id}/questions/`)
//         console.log("questions:..",questions.data)
//         setTotal(questions.data.length);
//         setAnswers(new Array(TOTAL).fill(null))
//         setQuestions(Array.isArray(questions.data) ? questions.data : []);
//         console.log("i am called")
//       }

//     } catch (err) {
//       setError(getErrorMessage(err, "Couldn't load published exams."));
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     console.log("lol")
//     fetchQuestionPaper();
//     console.log("questions in user:",QUESTIONS)
//   }, []);

//   useEffect(() => {
//     console.log("hi")
//     if (seconds <= 0) {
//       onSubmit(answers);
//     }
//     const id = setInterval(() => setSeconds((s) => s - 1), 1000);
//     return () => clearInterval(id);

//   }, [seconds, answers, onSubmit]);

//   const formatTime = (s) => {
//     const m = Math.floor(s / 60);
//     const sec = s % 60;
//     return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
//   };

//   const selectOption = (idx) => {
//     const updated = [...answers];
//     updated[current] = idx;
//     setAnswers(updated);
//   };

//   const progressPct = ((current + 1) / TOTAL) * 100;
//   const isLast = current === TOTAL - 1;

//   return (
//     <>
//       {/* Top bar */}
//       <div className="top-bar">
//         <div className="top-row">
//           <span className="exam-title">General Knowledge Test</span>
//           <div className="timer-pill">
//             <ClockIcon />
//             <span>{formatTime(seconds)}</span>
//           </div>
//         </div>
//         <div className="progress-row">
//           <div className="progress-track">
//             <div className="progress-fill" style={{ width: `${progressPct}%` }} />
//           </div>
//           <span className="progress-label">
//             {current + 1} / {TOTAL}
//           </span>
//         </div>
//       </div>

//       {/* Question */}
//       <div className="question-body">
//         <span className="q-badge">Question {current + 1}</span>
//         {console.log("question is:",QUESTIONS,"total:",TOTAL)}
//         <p className="q-text">{QUESTIONS[current].text}</p>

//         {QUESTIONS[current].options.map((opt, i) => (
//           <div
//             key={i}
//             className={`option${answers[current] === i ? " selected" : ""}`}
//             onClick={() => selectOption(i)}
//           >
//             <div className="option-circle">
//               {answers[current] === i ? <CheckIcon /> : OPTION_LABELS[i]}
//             </div>
//             <span className="option-text">{opt}</span>
//           </div>
//         ))}
//       </div>

//       {/* Navigator */}
//       <div className="nav-section">
//         <div className="nav-label">Question navigator</div>
//         <div className="q-grid">
//           {QUESTIONS.map((_, i) => {
//             let cls = "q-dot";
//             if (answers[i] !== null) cls += " answered";
//             if (i === current) cls += " current";
//             return (
//               <div key={i} className={cls} onClick={() => setCurrent(i)}>
//                 {i + 1}
//               </div>
//             );
//           })}
//         </div>

//         {!isLast ? (
//           <div className="bottom-row">
//             <button
//               className="btn-prev"
//               onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//               disabled={current === 0}
//             >
//               <ArrowLeftIcon /> Prev
//             </button>
//             <button
//               className="btn-next"
//               onClick={() => setCurrent((c) => Math.min(TOTAL - 1, c + 1))}
//             >
//               Next <ArrowRightIcon />
//             </button>
//           </div>
//         ) : (
//           <button className="btn-submit" onClick={() => onSubmit(answers)}>
//             Submit exam
//           </button>
//         )}
//       </div>
//     </>
//   );
// }

//exam from claud

function ExamScreen({ onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [seconds, setSeconds] = useState(null);
  const [QUESTIONS, setQuestions] = useState([]);
  const [TOTAL, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [notStarted, setNotStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false); // guard against duplicate submits

  const fetchQuestionPaper = async () => {
    try {
      const res = await api.get("/question-paper/published/");

      if (res.data.length <= 0) {
        setNotStarted(true);
        return; // can't return JSX from a data-fetching function — just bail out
      }

      setQuestionPaper(res.data[0].id);
      setSeconds(res.data[0].duration * 60);

      const questions = await api.get(`question-paper/${res.data[0].id}/questions/`);
      const raw = Array.isArray(questions.data) ? questions.data : [];

      const data = raw.map((q) => ({
        id: q.id,
        question: q.question,
        options: [q.a, q.b, q.c, q.d],
        correct_answer: q.correct_answer, // e.g. "C"
      }));

      setTotal(data.length);
      setAnswers(new Array(data.length).fill(null));
      setQuestions(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load published exams."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, []);

  // Timer: only runs once loading is false (i.e. real duration is set)
  useEffect(() => {
    if (loading || seconds === null) return;
    if (seconds <= 0) return; // stop ticking once time's up

    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [loading, seconds]);

  // Auto-submit when time runs out — only fire once
  useEffect(() => {
    if (loading || seconds === null) return;
    if (seconds <= 0 && !submitted) {
      setSubmitted(true);
      onSubmit(questionPaper, answers);
    }
  }, [seconds, loading, submitted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const selectOption = (optionIdx) => {
    const updated = [...answers];
    updated[current] = {
      question: QUESTIONS[current].id,
      selected_option: OPTION_LABELS[optionIdx], // "A" | "B" | "C" | "D"
      option_id: optionIdx,
    };
    setAnswers(updated);
  };

  const handleManualSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmit(questionPaper, answers);
  };

  // Guard: don't render question UI until data has loaded
  if (loading) {
    return <div className="loading-state">Loading exam...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (notStarted) {
    return <div className="empty-state">The exam has not started yet.</div>;
  }

  if (TOTAL === 0) {
    return <div className="empty-state">No questions available for this exam.</div>;
  }

  const progressPct = ((current + 1) / TOTAL) * 100;
  const isLast = current === TOTAL - 1;

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-row">
          <span className="exam-title">General Knowledge Test</span>
          <div className="timer-pill">
            <ClockIcon />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-label">
            {current + 1} / {TOTAL}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="question-body">
        <span className="q-badge">Question {current + 1}</span>
        <p className="q-text">{QUESTIONS[current].question}</p>

        {QUESTIONS[current].options.map((opt, i) => (
          <div
            key={i}
            className={`option${answers[current]?.option_id === i ? " selected" : ""}`}
            onClick={() => selectOption(i)}
          >
            <div className="option-circle">
              {answers[current]?.option_id === i ? <CheckIcon /> : OPTION_LABELS[i]}
            </div>
            <span className="option-text">{opt}</span>
          </div>
        ))}
      </div>

      {/* Navigator */}
      <div className="nav-section">
        <div className="nav-label">Question navigator</div>
        <div className="q-grid">
          {QUESTIONS.map((_, i) => {
            let cls = "q-dot";
            if (answers[i] !== null) cls += " answered";
            if (i === current) cls += " current";
            return (
              <div key={i} className={cls} onClick={() => setCurrent(i)}>
                {i + 1}
              </div>
            );
          })}
        </div>

        {!isLast ? (
          <div className="bottom-row">
            <button
              className="btn-prev"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ArrowLeftIcon /> Prev
            </button>
            <button
              className="btn-next"
              onClick={() => setCurrent((c) => Math.min(TOTAL - 1, c + 1))}
            >
              Next <ArrowRightIcon />
            </button>
          </div>
        ) : (
          <button className="btn-submit" onClick={handleManualSubmit}>
            Submit exam
          </button>
        )}
      </div>
    </>
  );
}
// ─── Redirect Screen ───────────────────────────────────────────
function RedirectScreen({ status, result,onDone,onRetry}) {
  // status: "submitting" | "success" | "error"

  useEffect(() => {
    // Only auto-redirect on success — don't yank the user away from an error
    if (status === "success") {
      const id = setTimeout(onDone,2500);
      return () => clearTimeout(id);
    }
  }, [status,onDone]);

  if (status === "error") {
    return (
      <div className="redirect-overlay">
        <div className="redirect-icon redirect-icon-error">
          <XIcon />
        </div>
        <span className="redirect-text">Couldn't submit your exam</span>
        <span className="redirect-subtext">{error || "Something went wrong. Please try again."}</span>
         {/* <button className="btn-retry" onClick={onRetry}>
          Retry submission
        </button> */}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="redirect-overlay">
        <div className="redirect-icon redirect-icon-success">
          <CheckIcon />
        </div>
        <span className="redirect-text">Exam submitted</span>
        {result && (
          <span className="redirect-subtext">
            You scored {result.score} / {result.total}
          </span>
        )}
        <span className="redirect-subtext">Redirecting…</span>
      </div>
    );
  }

  // status === "submitting" (default)
  return (
    <div className="redirect-overlay">
      <div className="redirect-spinner" />
      <span className="redirect-text">Submitting your exam…</span>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────

// const navigate = useNavigate();

// const handleLogin = async () => {
//   try {
//     const response = await axios.post(
//       "http://localhost:9000/api/login/",
//       {
//         username: email,
//         password: password,
//       }
//     );

//     const role = response.data.role;

//     if (role === "SME") {
//       navigate("/sme");
//     } else {
//       onExam("EXAM")
//       navigate("/exam");
//     }
//   } catch (err) {
//     alert("Invalid credentials");
//   }
// };



// function LoginScreen() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <div className="login-screen">
//       <div className="login-logo">
//         <BookIcon />
//       </div>
//       <h1 className="login-title">Welcome back</h1>
//       <p className="login-sub">Sign in to access your exams</p>

//       <div className="login-form">
//         <div className="input-group">
//           <label className="input-label">Email</label>
//           <input
//             className="input-field"
//             type="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="input-group">
//           <label className="input-label">Password</label>
//           <input
//             className="input-field"
//             type="password" 
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button className="btn-login" onClick={handleLogin}>Sign in</button>
//       </div>

//       <p className="login-footer">
//         Don't have an account? <a href="#">Register</a>
//       </p>
//     </div>
//   );
// }

// ─── App Root ─────────────────────────────────────────────────
export default function ExamApp() {
  // "exam" | "redirecting" | "login"
  const [screen, setScreen] = useState("exam");

  const [submissionStatus, setSubmissionStatus] = useState("submitting");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);


  // const user = async ()=>{
  //   const res = await api.get()
  // }

  const buildSubmission = (questionPaper,answers) => ({
  question_paper: questionPaper, // whatever id you have available (from res.data[0].id)
  user_id:JSON.parse(sessionStorage.getItem("user"))["user id"],
  answers: answers.filter(Boolean), // drops any unanswered (null) slots
  });
  const handleSubmit =async (questionpaper,answer) => {
    setScreen("redirecting")
    console.log("answer:",buildSubmission(questionpaper,answer))
    const res = await api.post("sumbit-question-paper/",buildSubmission(questionpaper,answer))

    console.log("submit res:",res.data)
    setSubmissionResult(res.data)
    setSubmissionStatus("success");

  };
  const handleRedirectDone = () => setScreen("login");

  return (
    <div className="phone-shell">
      {screen === "exam" && <ExamScreen onSubmit={handleSubmit} />}
      {screen === "redirecting" && <RedirectScreen
  status={submissionStatus}
  result={submissionResult}
  // error={submissionError}
  onDone={handleRedirectDone}
  // onRetry={() => submitExam(lastPayload)}
/>}
      {/* {screen === "login" && <LoginScreen onLogin={setScreen}/>} */}
    </div>
  );
}
 