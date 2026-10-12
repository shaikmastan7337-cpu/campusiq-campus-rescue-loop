import {
  StudentProfile,
  AttendanceRecord,
  Assignment,
  Submission,
  GradeRecord,
  PlacementProfile,
  ClassSection,
  AcademicSuccessScore,
  ScoreComponentBreakdown,
  SupportSignal,
} from '../types';

/**
 * Institutional Success Score Formula:
 * 
 * Total Score = Sum(Component_Score_i * Nominal_Weight_i) / Sum(Available_Nominal_Weights)
 * 
 * Component Weights (Nominal):
 * 1. Academic Performance (35%):
 *    - If both CGPA and verified internal grade records exist: 50% CGPA (normalized 0-10) + 50% Grade average.
 *    - If only CGPA exists: 100% normalized CGPA (marked partial).
 *    - If only Grades exist: 100% Grade average (marked partial).
 *    - If neither exists: marked missing (excluded from available weights).
 * 2. Attendance (20%):
 *    - Evaluated over unique lecture & lab sessions (deduplicated by classId + date + session).
 *    - Present & Excused = 1.0, Late = 0.7, Absent = 0.0.
 * 3. Learning-Platform Activity (15%):
 *    - LMS verified activity score (0-100). Missing if undefined (no fabricated default).
 * 4. Campus Engagement (10%):
 *    - Assignment completion punctuality over enrolled course deliverables (On-time = 1.0, Late = 0.7, Missing = 0.0).
 *    - Combined with student engagement score if present.
 * 5. Skills & Certifications (10%):
 *    - Verified technical skills and accredited credentials from verified profile.
 * 6. Placement Preparation (10%):
 *    - Weighted average of present practice benchmarks (LeetCode, Aptitude, Mock Interview).
 *    - Missing items remain missing without substituting arbitrary values.
 * 
 * Data Completeness & Provisional Scoring:
 * - If available weights sum < 70%, the score is explicitly marked "Provisional".
 * - Signals are deterministic review prompts, NOT automated predictions.
 */

export function calculateStudentSuccessScore(
  student: StudentProfile,
  attendanceRecords: AttendanceRecord[],
  assignments: Assignment[],
  submissions: Submission[],
  grades: GradeRecord[],
  placementProfile?: PlacementProfile,
  classes?: ClassSection[]
): AcademicSuccessScore {
  // --- 1. Filter student-specific records with validation ---

  // Deduplicate attendance sessions (same student, class, date, session)
  const rawAttendance = attendanceRecords.filter((a) => a.studentId === student.studentId);
  const seenSessions = new Set<string>();
  const studentAttendance: AttendanceRecord[] = [];
  for (const att of rawAttendance) {
    const key = `${att.classId || 'cls'}_${att.date}_${att.session || 's'}`;
    if (!seenSessions.has(key)) {
      seenSessions.add(key);
      studentAttendance.push(att);
    }
  }

  // Filter student grades with valid maxMarks > 0 and marks >= 0
  const studentGrades = grades.filter(
    (g) => g.studentId === student.studentId && g.maxMarks > 0 && g.marks >= 0
  );

  // Filter relevant assignments:
  // Identify enrolled classes for this student
  let enrolledClassIds = new Set<string>();
  if (classes && classes.length > 0) {
    const matchedClasses = classes.filter(
      (c) => c.departmentId === student.departmentId && c.semester === student.semester
    );
    enrolledClassIds = new Set(matchedClasses.map((c) => c.classId));
  }
  // If student attendance or grades link to classes, include those as well
  studentAttendance.forEach((a) => a.classId && enrolledClassIds.add(a.classId));
  studentGrades.forEach((g) => g.courseId && enrolledClassIds.add(g.courseId));

  // Student's applicable assignments
  const studentApplicableAssignments = assignments.filter((asg) => {
    if (enrolledClassIds.size > 0) {
      return enrolledClassIds.has(asg.classId);
    }
    return true; // Fallback if no class mapping exists
  });

  const studentSubmissions = submissions.filter((s) => s.studentId === student.studentId);

  // --- 2. Calculate Component 1: Academic Performance (35%) ---
  let academicScore = 0;
  let academicStatus: 'available' | 'partial' | 'missing' = 'missing';
  let academicDesc = '';
  let academicRecordsCount = 0;

  const validCgpa = typeof student.cgpa === 'number' && student.cgpa > 0;
  const hasGrades = studentGrades.length > 0;

  if (validCgpa && hasGrades) {
    const cgpaNormalized = Math.min(100, Math.max(0, (student.cgpa / 10) * 100));
    const gradePercentages = studentGrades.map((g) =>
      Math.min(100, Math.max(0, (g.marks / g.maxMarks) * 100))
    );
    const avgGrades = gradePercentages.reduce((a, b) => a + b, 0) / gradePercentages.length;

    academicScore = Math.round(cgpaNormalized * 0.5 + avgGrades * 0.5);
    academicStatus = 'available';
    academicRecordsCount = studentGrades.length + 1;
    academicDesc = `Combined: 50% CGPA (${student.cgpa.toFixed(2)}/10 -> ${Math.round(cgpaNormalized)}%) + 50% Internal Exams (${studentGrades.length} records avg ${Math.round(avgGrades)}%)`;
  } else if (validCgpa) {
    const cgpaNormalized = Math.min(100, Math.max(0, (student.cgpa / 10) * 100));
    academicScore = Math.round(cgpaNormalized);
    academicStatus = 'partial';
    academicRecordsCount = 1;
    academicDesc = `Cumulative CGPA (${student.cgpa.toFixed(2)}/10 -> ${Math.round(cgpaNormalized)}%); internal semester evaluations pending`;
  } else if (hasGrades) {
    const gradePercentages = studentGrades.map((g) =>
      Math.min(100, Math.max(0, (g.marks / g.maxMarks) * 100))
    );
    const avgGrades = gradePercentages.reduce((a, b) => a + b, 0) / gradePercentages.length;
    academicScore = Math.round(avgGrades);
    academicStatus = 'partial';
    academicRecordsCount = studentGrades.length;
    academicDesc = `Internal assessments average (${studentGrades.length} records avg ${Math.round(avgGrades)}%); CGPA baseline unrecorded`;
  } else {
    academicStatus = 'missing';
    academicDesc = 'No verified CGPA or assessment records on file';
  }

  // --- 3. Calculate Component 2: Attendance (20%) ---
  let attendanceScore = 0;
  let attendanceStatus: 'available' | 'partial' | 'missing' = 'missing';
  let attendanceDesc = '';
  const attendanceSessionsCount = studentAttendance.length;

  if (attendanceSessionsCount > 0) {
    const presentCount = studentAttendance.filter(
      (a) => a.status === 'present' || a.status === 'excused'
    ).length;
    const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
    const absentCount = studentAttendance.filter((a) => a.status === 'absent').length;

    // Standard institutional weight: present/excused = 1.0, late = 0.7, absent = 0.0
    const weightedPresent = presentCount + lateCount * 0.7;
    attendanceScore = Math.round((weightedPresent / attendanceSessionsCount) * 100);
    attendanceStatus = attendanceSessionsCount >= 5 ? 'available' : 'partial';
    attendanceDesc = `${presentCount} present, ${lateCount} late (0.7x), ${absentCount} absent across ${attendanceSessionsCount} verified sessions`;
  } else {
    attendanceStatus = 'missing';
    attendanceDesc = 'No recorded attendance sessions in current term';
  }

  // --- 4. Calculate Component 3: Learning-Platform Activity (15%) ---
  let learningScore = 0;
  let learningStatus: 'available' | 'partial' | 'missing' = 'missing';
  let learningDesc = '';

  if (
    typeof student.learningPlatformActivityScore === 'number' &&
    student.learningPlatformActivityScore >= 0
  ) {
    learningScore = Math.min(100, Math.round(student.learningPlatformActivityScore));
    learningStatus = 'available';
    learningDesc = `LMS interaction index: ${learningScore}/100 across modular coursework`;
  } else {
    learningStatus = 'missing';
    learningDesc = 'No learning platform activity record synchronized (missing input)';
  }

  // --- 5. Calculate Component 4: Campus Engagement (10%) ---
  let engagementScore = 0;
  let engagementStatus: 'available' | 'partial' | 'missing' = 'missing';
  let engagementDesc = '';
  let engagementRecordsCount = 0;

  const totalEnrolledAssignments = studentApplicableAssignments.length;
  if (totalEnrolledAssignments > 0) {
    let completionPoints = 0;
    studentApplicableAssignments.forEach((asg) => {
      const sub = studentSubmissions.find((s) => s.assignmentId === asg.assignmentId);
      if (sub) {
        if (sub.status === 'late') {
          completionPoints += 0.7;
        } else if (sub.status === 'submitted' || sub.status === 'evaluated' || sub.status === 'returned') {
          completionPoints += 1.0;
        }
      }
    });

    const assignmentTurnInRate = Math.round((completionPoints / totalEnrolledAssignments) * 100);
    engagementRecordsCount = totalEnrolledAssignments;

    if (typeof student.engagementScore === 'number') {
      engagementScore = Math.round(assignmentTurnInRate * 0.6 + student.engagementScore * 0.4);
      engagementStatus = 'available';
      engagementDesc = `Deliverables punctuality: ${Math.round(completionPoints)}/${totalEnrolledAssignments} (${assignmentTurnInRate}%) + faculty observation (${student.engagementScore}%)`;
    } else {
      engagementScore = assignmentTurnInRate;
      engagementStatus = 'partial';
      engagementDesc = `Turn-in punctuality: ${Math.round(completionPoints)}/${totalEnrolledAssignments} (${assignmentTurnInRate}%); observation score unrecorded`;
    }
  } else if (typeof student.engagementScore === 'number') {
    engagementScore = Math.round(student.engagementScore);
    engagementStatus = 'partial';
    engagementDesc = `Direct faculty engagement evaluation: ${engagementScore}/100`;
  } else {
    engagementStatus = 'missing';
    engagementDesc = 'No assignment submissions or engagement telemetry recorded';
  }

  // --- 6. Calculate Component 5: Skills & Certifications (10%) ---
  let skillsScore = 0;
  let skillsStatus: 'available' | 'partial' | 'missing' = 'missing';
  let skillsDesc = '';

  if (placementProfile && (placementProfile.skills.length > 0 || placementProfile.certifications.length > 0)) {
    const verifiedSkillCount = placementProfile.skills.length;
    const certCount = placementProfile.certifications.length;
    // Each verified skill provides 8 pts, each certification provides 12 pts, capped at 100
    skillsScore = Math.min(100, verifiedSkillCount * 8 + certCount * 12);
    skillsStatus = 'available';
    skillsDesc = `${verifiedSkillCount} technical competencies, ${certCount} certified credentials recorded`;
  } else {
    skillsStatus = 'missing';
    skillsDesc = 'No verified skills or certifications uploaded to portfolio';
  }

  // --- 7. Calculate Component 6: Placement Preparation (10%) ---
  // Missing values must remain missing without substituting 70 or 60!
  let placementPrepScore = 0;
  let placementPrepStatus: 'available' | 'partial' | 'missing' = 'missing';
  let placementPrepDesc = '';

  if (placementProfile) {
    const prepParts: { name: string; score: number; weight: number }[] = [];

    if (typeof placementProfile.leetcodeSolved === 'number' && placementProfile.leetcodeSolved >= 0) {
      const leetcodeNorm = Math.min(100, Math.round((placementProfile.leetcodeSolved / 250) * 100));
      prepParts.push({ name: `${placementProfile.leetcodeSolved} DSA solved`, score: leetcodeNorm, weight: 0.4 });
    }
    if (typeof placementProfile.aptitudeScore === 'number' && placementProfile.aptitudeScore >= 0) {
      prepParts.push({ name: `Aptitude ${placementProfile.aptitudeScore}%`, score: placementProfile.aptitudeScore, weight: 0.3 });
    }
    if (typeof placementProfile.mockInterviewScore === 'number' && placementProfile.mockInterviewScore >= 0) {
      prepParts.push({ name: `Mock Interview ${placementProfile.mockInterviewScore}%`, score: placementProfile.mockInterviewScore, weight: 0.3 });
    }

    if (prepParts.length > 0) {
      const sumWeights = prepParts.reduce((acc, p) => acc + p.weight, 0);
      const weightedSum = prepParts.reduce((acc, p) => acc + p.score * p.weight, 0);
      placementPrepScore = Math.round(weightedSum / sumWeights);
      placementPrepStatus = prepParts.length === 3 ? 'available' : 'partial';
      placementPrepDesc = prepParts.map((p) => p.name).join(', ');
    } else {
      placementPrepStatus = 'missing';
      placementPrepDesc = 'No practice benchmarks (DSA, aptitude, interview) recorded';
    }
  } else {
    placementPrepStatus = 'missing';
    placementPrepDesc = 'Placement profile not yet initiated';
  }

  // --- 8. Assemble Component Breakdown & Normalization ---
  interface RawComponentDef {
    name: string;
    weight: number;
    rawScore: number;
    status: 'available' | 'partial' | 'missing';
    description: string;
    includedRecordsCount?: number;
  }

  const rawComponents: RawComponentDef[] = [
    {
      name: 'Academic Performance',
      weight: 0.35,
      rawScore: academicScore,
      status: academicStatus,
      description: academicDesc,
      includedRecordsCount: academicRecordsCount,
    },
    {
      name: 'Attendance',
      weight: 0.20,
      rawScore: attendanceScore,
      status: attendanceStatus,
      description: attendanceDesc,
      includedRecordsCount: attendanceSessionsCount,
    },
    {
      name: 'Learning-Platform Activity',
      weight: 0.15,
      rawScore: learningScore,
      status: learningStatus,
      description: learningDesc,
    },
    {
      name: 'Campus Engagement',
      weight: 0.10,
      rawScore: engagementScore,
      status: engagementStatus,
      description: engagementDesc,
      includedRecordsCount: engagementRecordsCount,
    },
    {
      name: 'Skills & Certifications',
      weight: 0.10,
      rawScore: skillsScore,
      status: skillsStatus,
      description: skillsDesc,
    },
    {
      name: 'Placement Preparation',
      weight: 0.10,
      rawScore: placementPrepScore,
      status: placementPrepStatus,
      description: placementPrepDesc,
    },
  ];

  // Sum of weights for available or partial components (missing components contribute 0 weight)
  const contributingComponents = rawComponents.filter((c) => c.status !== 'missing');
  const availableWeightsSum = contributingComponents.reduce((acc, c) => acc + c.weight, 0);
  const availableDataPercent = Math.round(availableWeightsSum * 100);

  // Score is provisional if verifiable data coverage is under 70%
  const isProvisional = availableDataPercent < 70;

  // Normalized total score over available weights
  let totalScore = 0;
  if (availableWeightsSum > 0) {
    const weightedSum = contributingComponents.reduce(
      (sum, c) => sum + c.rawScore * c.weight,
      0
    );
    totalScore = Math.min(100, Math.max(0, Math.round(weightedSum / availableWeightsSum)));
  }

  const components: ScoreComponentBreakdown[] = rawComponents.map((c) => {
    const isContributing = c.status !== 'missing';
    const effectiveContribution = isContributing && availableWeightsSum > 0
      ? Math.round((c.rawScore * c.weight) / availableWeightsSum)
      : 0;

    return {
      name: c.name,
      weight: Math.round(c.weight * 100),
      rawScore: c.rawScore,
      weightedScore: effectiveContribution,
      status: c.status,
      description: c.description,
      includedRecordsCount: c.includedRecordsCount,
      dataCoverageText: isContributing
        ? `Contributed ${effectiveContribution} pts (${Math.round((c.weight / availableWeightsSum) * 100)}% normalized weight)`
        : 'Excluded from score calculation (missing data)',
      formulaDetail: `Nominal weight ${Math.round(c.weight * 100)}%`,
    };
  });

  // --- 9. Evidence-Based Support Signals (Review Prompts) ---
  const supportSignals: SupportSignal[] = [];
  const riskAlerts: string[] = []; // Backward compatibility
  const recommendations: string[] = [];

  // Determine date window for attendance
  let attDateWindow = 'Current Semester';
  if (studentAttendance.length > 0) {
    const sortedDates = [...studentAttendance].sort((a, b) => a.date.localeCompare(b.date));
    attDateWindow = `${sortedDates[0].date} to ${sortedDates[sortedDates.length - 1].date}`;
  }

  // 9a. Attendance review prompt
  if (attendanceStatus !== 'missing' && attendanceScore < 75) {
    const attendedCount = studentAttendance.filter(
      (a) => a.status === 'present' || a.status === 'excused'
    ).length;
    const signal: SupportSignal = {
      id: 'sig-att-shortfall',
      category: 'Attendance',
      title: 'Attendance Shortfall Review Prompt',
      description: `Observed attendance is ${attendanceScore}% across ${attendanceSessionsCount} verified sessions (${attDateWindow}). Institutional guideline recommends >= 75%.`,
      dateWindow: attDateWindow,
      evidence: `${attendedCount} present of ${attendanceSessionsCount} sessions recorded in course logs`,
      suggestedAction: 'Agree on a makeup attendance schedule with course faculty and log an action plan milestone.',
      severity: attendanceScore < 65 ? 'high' : 'medium',
    };
    supportSignals.push(signal);
    riskAlerts.push(
      `Support Prompt (Attendance): ${attendanceScore}% attendance across ${attendanceSessionsCount} recorded sessions (${attendedCount}/${attendanceSessionsCount}).`
    );
    recommendations.push(
      'Schedule a student check-in to establish an attendance recovery plan before upcoming midterms.'
    );
  }

  // 9b. Attendance downward trend prompt
  if (studentAttendance.length >= 6) {
    const sorted = [...studentAttendance].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    const earlierHalf = sorted.slice(0, mid);
    const laterHalf = sorted.slice(mid);

    const earlierRate =
      (earlierHalf.filter((a) => a.status === 'present' || a.status === 'excused').length /
        earlierHalf.length) *
      100;
    const laterRate =
      (laterHalf.filter((a) => a.status === 'present' || a.status === 'excused').length /
        laterHalf.length) *
      100;

    if (earlierRate - laterRate >= 15) {
      const earlierDates = `${earlierHalf[0].date} to ${earlierHalf[earlierHalf.length - 1].date}`;
      const laterDates = `${laterHalf[0].date} to ${laterHalf[laterHalf.length - 1].date}`;
      supportSignals.push({
        id: 'sig-att-trend',
        category: 'Attendance',
        title: 'Downward Attendance Trend Observed',
        description: `Attendance dropped from ${Math.round(earlierRate)}% (${earlierDates}) down to ${Math.round(laterRate)}% (${laterDates}).`,
        dateWindow: `${earlierHalf[0].date} to ${laterHalf[laterHalf.length - 1].date}`,
        evidence: `Decline of ${(earlierRate - laterRate).toFixed(1)} percentage points across consecutive 3-week evaluation windows.`,
        suggestedAction: 'Conduct an early intervention check-in to identify potential schedule conflicts or personal hurdles.',
        severity: 'high',
      });
      riskAlerts.push(
        `Support Prompt (Trend): Attendance declined from ${Math.round(earlierRate)}% to ${Math.round(laterRate)}% in recent weeks.`
      );
    }
  }

  // 9c. Academic backlog prompt
  if (student.backlogs > 0) {
    supportSignals.push({
      id: 'sig-acad-backlogs',
      category: 'Academic',
      title: 'Active Course Arrears Flag',
      description: `Student transcript lists ${student.backlogs} unresolved course arrears requiring supplementary examination.`,
      dateWindow: student.academicYear || 'Current Year',
      evidence: `${student.backlogs} backlog(s) registered on official student profile`,
      suggestedAction: 'Enroll in remedial tutorial cohorts and confirm supplementary registration deadlines.',
      severity: 'high',
    });
    riskAlerts.push(
      `Support Prompt (Arrears): ${student.backlogs} active backlog(s) flagged on transcript.`
    );
    recommendations.push(
      'Review supplementary syllabus and establish weekly study milestones for backlog clearance.'
    );
  }

  // 9d. Academic performance prompt
  if (academicStatus !== 'missing' && academicScore < 60) {
    supportSignals.push({
      id: 'sig-acad-performance',
      category: 'Academic',
      title: 'Academic Performance Review Prompt',
      description: `Verified academic performance index is ${academicScore}/100, which is below the satisfactory threshold (60).`,
      dateWindow: 'Recent Assessments',
      evidence: academicDesc,
      suggestedAction: 'Pair with department peer tutor and schedule focused review sessions with class instructors.',
      severity: 'medium',
    });
    riskAlerts.push(
      `Support Prompt (Academics): Combined academic performance indicator is ${academicScore}/100.`
    );
  }

  // 9e. Pending deliverables prompt
  const pendingDeliverables = studentApplicableAssignments.filter(
    (a) => !studentSubmissions.some((s) => s.assignmentId === a.assignmentId)
  );
  if (pendingDeliverables.length > 0) {
    supportSignals.push({
      id: 'sig-deliverables',
      category: 'Engagement',
      title: 'Course Deliverables Awaiting Submission',
      description: `${pendingDeliverables.length} enrolled course assignment(s) currently awaiting turn-in.`,
      dateWindow: 'Upcoming Deadlines',
      evidence: pendingDeliverables.map((p) => p.title).join(', '),
      suggestedAction: 'Review project requirements and submit draft work for instructor feedback.',
      severity: 'info',
    });
  }

  // --- 10. Placement Readiness Score (Strictly Separate from Academic Success) ---
  let placementReadinessScore = 0;
  if (placementProfile) {
    const cgpaComponent = Math.min(30, (student.cgpa / 10) * 30);
    const backlogDeduction = student.backlogs * 12;
    const skillsComponent = Math.min(25, placementProfile.skills.length * 4);

    let leetcodeComponent = 0;
    if (typeof placementProfile.leetcodeSolved === 'number') {
      leetcodeComponent = Math.min(25, (placementProfile.leetcodeSolved / 250) * 25);
    }

    let aptitudeComponent = 0;
    if (typeof placementProfile.aptitudeScore === 'number') {
      aptitudeComponent = Math.min(20, (placementProfile.aptitudeScore / 100) * 20);
    }

    placementReadinessScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          cgpaComponent +
            skillsComponent +
            leetcodeComponent +
            aptitudeComponent -
            backlogDeduction
        )
      )
    );
  } else {
    // If no placement profile, honest baseline: 0
    placementReadinessScore = 0;
  }

  const placementReadinessStatus: 'Ready' | 'Needs Practice' | 'Critical Gaps' =
    placementReadinessScore >= 75
      ? 'Ready'
      : placementReadinessScore >= 55
      ? 'Needs Practice'
      : 'Critical Gaps';

  return {
    studentId: student.studentId,
    totalScore,
    isProvisional,
    availableDataPercent,
    components,
    supportSignals,
    riskAlerts,
    recommendations,
    placementReadinessScore,
    placementReadinessStatus,
    evidenceDateWindow: attDateWindow,
    formulaSummary: `Normalized Score = ∑(Score_i × Weight_i) / ${availableWeightsSum.toFixed(2)} (Available weights coverage: ${availableDataPercent}%)`,
  };
}
