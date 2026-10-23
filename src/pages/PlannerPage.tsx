import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { 
  Calculator, Award, Sparkles, TrendingUp, 
  BookOpen, CheckCircle2, AlertTriangle, ArrowRight, 
  RotateCcw, Sliders, GraduationCap, Download, Check
} from 'lucide-react';
import { 
  RevealOnScroll, 
  InteractiveCard, 
  InteractiveCTAButton,
  AnimatedProgressBar 
} from '../components/common/MotionComponents';

export const PlannerPage: React.FC = () => {
  const { currentUser, students, courses, settings } = useEduTrack();

  // Active sub-tool tab
  const [plannerTab, setPlannerTab] = useState<'target-gpa' | 'final-exam' | 'scale'>('target-gpa');

  // Student matching
  const matchingStudent = currentUser?.role === 'student'
    ? students.find(s => s.id === currentUser.id || s.email === currentUser.email)
    : null;

  // Tool 1: Cumulative GPA Projector State
  const [currentGpa, setCurrentGpa] = useState<number>(3.45);
  const [completedCredits, setCompletedCredits] = useState<number>(45);
  const [upcomingCredits, setUpcomingCredits] = useState<number>(15);
  const [targetGpa, setTargetGpa] = useState<number>(3.70);

  // Tool 2: Final Exam Needed State
  const [courseTitle, setCourseTitle] = useState<string>('Data Structures & Algorithms');
  const [currentCourseScore, setCurrentCourseScore] = useState<number>(84);
  const [desiredTargetScore, setDesiredTargetScore] = useState<number>(90);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(35);

  // Calculations for Tool 1: Target GPA
  const totalCreditsAfter = completedCredits + upcomingCredits;
  const currentTotalQualityPoints = currentGpa * completedCredits;
  const targetTotalQualityPoints = targetGpa * totalCreditsAfter;
  const neededSemesterQualityPoints = targetTotalQualityPoints - currentTotalQualityPoints;
  const neededSemesterGpa = upcomingCredits > 0 ? neededSemesterQualityPoints / upcomingCredits : 0;

  const isAttainable = neededSemesterGpa <= 4.0 && neededSemesterGpa >= 0;
  const isAlreadyAchieved = neededSemesterGpa <= currentGpa && targetGpa <= currentGpa;

  // Additional credits needed if unattainable in 1 term
  const additionalCreditsNeededAt4_0 = Math.ceil(
    (targetTotalQualityPoints - (currentTotalQualityPoints + 4.0 * upcomingCredits)) / (4.0 - targetGpa)
  );

  // Calculations for Tool 2: Final Exam Score Needed
  // Formula: Desired = (Current * (1 - Weight)) + (Final * Weight)
  // Final = (Desired - (Current * (1 - Weight))) / Weight
  const weightDecimal = finalExamWeight / 100;
  const existingWeightDecimal = 1 - weightDecimal;
  const examScoreNeeded = (desiredTargetScore - (currentCourseScore * existingWeightDecimal)) / weightDecimal;

  // Populate from logged in student
  const handleLoadStudentData = () => {
    if (matchingStudent) {
      setCurrentGpa(matchingStudent.gpa);
      setCompletedCredits(42);
      setUpcomingCredits(16);
      setTargetGpa(3.90);
    } else {
      // Demo fallback
      setCurrentGpa(3.84);
      setCompletedCredits(48);
      setUpcomingCredits(15);
      setTargetGpa(3.90);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* Page Header */}
      <section className="relative pt-10 pb-8 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <RevealOnScroll direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Academic Intelligence & Graduation Planning</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  GPA Target Planner & Degree Scenario Simulator
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-2">
                  Project target cumulative GPAs, calculate minimum exam scores needed to lock in course letter grades, and map honors milestones.
                </p>
              </div>

              {currentUser && (
                <button
                  onClick={handleLoadStudentData}
                  className="px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 self-start md:self-auto shrink-0 shadow-xs cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Load My Scholar Profile Data</span>
                </button>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 pt-6">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs">
                <button
                  onClick={() => setPlannerTab('target-gpa')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    plannerTab === 'target-gpa'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cumulative GPA Projector
                </button>
                <button
                  onClick={() => setPlannerTab('final-exam')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    plannerTab === 'final-exam'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Final Exam Grade Needed
                </button>
                <button
                  onClick={() => setPlannerTab('scale')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    plannerTab === 'scale'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Grading Scale Matrix
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TAB 1: CUMULATIVE GPA TARGET PROJECTOR */}
        {plannerTab === 'target-gpa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Cumulative Academic Inputs</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust current credentials and semester credits to forecast necessary semester academic performance.
                </p>
              </div>

              {/* Input 1: Current GPA */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label className="text-slate-700 dark:text-slate-300">Current Cumulative GPA</label>
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {currentGpa.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.01"
                  value={currentGpa}
                  onChange={(e) => setCurrentGpa(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1.0 (Probation)</span>
                  <span>3.0 (Satisfactory)</span>
                  <span>4.0 (Flawless)</span>
                </div>
              </div>

              {/* Input 2: Completed Credits */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label className="text-slate-700 dark:text-slate-300">Completed Credit Hours</label>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {completedCredits} Credits
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="1"
                  value={completedCredits}
                  onChange={(e) => setCompletedCredits(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 (Freshman)</span>
                  <span>60 (Junior)</span>
                  <span>120 (Graduation)</span>
                </div>
              </div>

              {/* Input 3: Upcoming Semester Credits */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label className="text-slate-700 dark:text-slate-300">Upcoming Term Credit Load</label>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {upcomingCredits} Credits
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 15, 18, 20].map(cred => (
                    <button
                      key={cred}
                      onClick={() => setUpcomingCredits(cred)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        upcomingCredits === cred
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {cred} cr
                    </button>
                  ))}
                </div>
              </div>

              {/* Input 4: Target Graduation GPA */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label className="text-slate-700 dark:text-slate-300">Target Cumulative GPA</label>
                  <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                    {targetGpa.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.0"
                  step="0.01"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentGpa(3.45);
                    setCompletedCredits(45);
                    setUpcomingCredits(15);
                    setTargetGpa(3.70);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Baseline</span>
                </button>
              </div>

            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Primary Required GPA Card */}
              <InteractiveCard className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
                    Calculated Required Semester GPA
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    Next {upcomingCredits} Credits
                  </span>
                </div>

                <div className="text-center py-2 space-y-2">
                  <span className={`text-6xl font-black font-mono tracking-tight block ${
                    isAttainable 
                      ? 'text-white' 
                      : 'text-rose-400'
                  }`}>
                    {neededSemesterGpa > 4.0 ? '> 4.00' : neededSemesterGpa < 0 ? '0.00' : neededSemesterGpa.toFixed(2)}
                  </span>

                  <div className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700">
                    {isAttainable ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Target is Attainable this term
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Unattainable in single {upcomingCredits}-credit term
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                  {isAttainable ? (
                    <p>
                      To lift your cumulative standing from <strong className="text-white font-mono">{currentGpa.toFixed(2)}</strong> to <strong className="text-white font-mono">{targetGpa.toFixed(2)}</strong> across the next {upcomingCredits} credit hours, you must achieve a term GPA of at least <strong className="text-indigo-400 font-mono">{neededSemesterGpa.toFixed(2)}</strong> (approx. {neededSemesterGpa >= 3.7 ? 'straight A grades' : 'a mix of A and B grades'}).
                    </p>
                  ) : (
                    <p>
                      Mathematically, a 4.0 GPA across {upcomingCredits} credits would raise your cumulative standing to a maximum of <strong className="text-indigo-400 font-mono">{((currentTotalQualityPoints + 4.0 * upcomingCredits) / totalCreditsAfter).toFixed(2)}</strong>. You will need approximately <strong className="text-white font-mono">{additionalCreditsNeededAt4_0} additional credit hours</strong> of consecutive 4.0 performance to attain {targetGpa.toFixed(2)}.
                    </p>
                  )}
                </div>

                {/* Milestone Progress Indicators */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider font-mono">
                    Graduation Honors Roadmap
                  </span>

                  <div className="space-y-2 text-xs">
                    {[
                      { label: "Dean's Honor Roll", minGpa: 3.50, color: 'bg-emerald-500' },
                      { label: "Cum Laude Honors", minGpa: 3.65, color: 'bg-indigo-500' },
                      { label: "Magna Cum Laude", minGpa: 3.80, color: 'bg-purple-500' },
                      { label: "Summa Cum Laude", minGpa: 3.90, color: 'bg-amber-500' },
                    ].map(h => {
                      const reached = targetGpa >= h.minGpa;
                      const pct = Math.min(100, Math.max(0, (targetGpa / 4.0) * 100));

                      return (
                        <div key={h.label} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-200">{h.label} ({h.minGpa.toFixed(2)}+)</span>
                            <span className={reached ? 'text-emerald-400 font-bold' : 'text-slate-500 font-mono'}>
                              {reached ? 'Target Meets Milestone ✓' : `Requires +${(h.minGpa - targetGpa).toFixed(2)} GPA`}
                            </span>
                          </div>
                          <AnimatedProgressBar
                            value={pct}
                            color={reached ? h.color : 'bg-slate-600'}
                            height="h-1.5"
                            trackColor="bg-slate-800"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </InteractiveCard>

            </div>

          </div>
        )}

        {/* TAB 2: FINAL EXAM SCORE NEEDED CALCULATOR */}
        {plannerTab === 'final-exam' && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                Course Assessment Calculus
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Calculate Exact Final Exam Score Needed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Enter your current coursework grade and final exam weighting to know the minimum score required on the final paper.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Form Controls */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Current Course Average Before Final</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{currentCourseScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={currentCourseScore}
                    onChange={(e) => setCurrentCourseScore(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Desired Target Grade for Course</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                      {desiredTargetScore}% ({desiredTargetScore >= 90 ? 'Grade A' : desiredTargetScore >= 80 ? 'Grade B' : 'Grade C'})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Grade A (90%)', score: 90 },
                      { label: 'Grade B (80%)', score: 80 },
                      { label: 'Passing C (70%)', score: 70 },
                    ].map(tier => (
                      <button
                        key={tier.score}
                        onClick={() => setDesiredTargetScore(tier.score)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          desiredTargetScore === tier.score
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Final Exam Weight Percentage</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{finalExamWeight}% of Total</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={finalExamWeight}
                    onChange={(e) => setFinalExamWeight(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>15% (Light)</span>
                    <span>35% (Standard)</span>
                    <span>60% (Heavy Final)</span>
                  </div>
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 text-center space-y-4">
                <span className="text-xs uppercase font-mono text-slate-400 tracking-wider block">
                  Required Final Exam Score
                </span>

                <div className="py-2 space-y-2">
                  <span className={`text-6xl font-black font-mono tracking-tight block ${
                    examScoreNeeded > 100 
                      ? 'text-rose-400' 
                      : examScoreNeeded <= 0 
                      ? 'text-emerald-400' 
                      : 'text-white'
                  }`}>
                    {examScoreNeeded <= 0 ? '0%' : examScoreNeeded > 100 ? `${examScoreNeeded.toFixed(1)}%` : `${examScoreNeeded.toFixed(1)}%`}
                  </span>

                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700">
                    {examScoreNeeded <= 0 ? (
                      <span className="text-emerald-400">Guaranteed! You already secured this grade even with a 0 on final.</span>
                    ) : examScoreNeeded <= 75 ? (
                      <span className="text-emerald-400">Comfortable Target: Score {examScoreNeeded.toFixed(1)}% or higher.</span>
                    ) : examScoreNeeded <= 95 ? (
                      <span className="text-amber-400">Achievable with focused review: Score {examScoreNeeded.toFixed(1)}%.</span>
                    ) : (
                      <span className="text-rose-400">Statistically challenging: Requires {examScoreNeeded.toFixed(1)}% (over 100% with extra credit).</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-4 leading-relaxed">
                  Formula applied: ({desiredTargetScore}% target - ({currentCourseScore}% current × {(1 - finalExamWeight/100).toFixed(2)} coursework weight)) / {(finalExamWeight/100).toFixed(2)} final weight.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: GRADING SCALE MATRIX */}
        {plannerTab === 'scale' && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                Standard Academic Reference
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Institutional 4.0 Grading & GPA Scale Matrix
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official letter grade percentage boundaries, GPA weightings, and academic standing definitions for {settings.institutionName}.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold">Letter Grade</th>
                    <th className="py-3.5 px-6 font-semibold">Percentage Range</th>
                    <th className="py-3.5 px-6 font-semibold">4.0 GPA Value</th>
                    <th className="py-3.5 px-6 font-semibold">Academic Evaluation</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {[
                    { letter: 'A', range: '90.0% – 100.0%', gpa: '4.0', eval: 'Excellent & Comprehensive Mastery', standing: 'Dean\'s List Honor', color: 'text-emerald-600 dark:text-emerald-400' },
                    { letter: 'B', range: '80.0% – 89.9%', gpa: '3.0', eval: 'Above Average Understanding & Synthesis', standing: 'Good Academic Standing', color: 'text-indigo-600 dark:text-indigo-400' },
                    { letter: 'C', range: '70.0% – 79.9%', gpa: '2.0', eval: 'Satisfactory Core Competency', standing: 'Normal Progression', color: 'text-slate-700 dark:text-slate-300' },
                    { letter: 'D', range: '60.0% – 69.9%', gpa: '1.0', eval: 'Deficient / Minimal Passing', standing: 'Academic Warning', color: 'text-amber-600 dark:text-amber-400' },
                    { letter: 'F', range: '0.0% – 59.9%', gpa: '0.0', eval: 'Failing / Course Credit Denied', standing: 'Academic Probation', color: 'text-rose-600 dark:text-rose-400' },
                  ].map(row => (
                    <tr key={row.letter} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className={`py-4 px-6 font-mono font-bold text-base ${row.color}`}>
                        {row.letter}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-900 dark:text-white">
                        {row.range}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                        {row.gpa}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                        {row.eval}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[11px]">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {row.standing}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>Standard Policy: Courses with attendance under {settings.attendanceThreshold}% are subject to academic penalty review.</span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                Print Grading Policy
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
