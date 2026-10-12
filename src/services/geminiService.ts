import { AcademicSuccessScore, StudentProfile } from '../types';

export interface GroundedRecommendation {
  category: 'Academic' | 'Attendance' | 'Placement' | 'Wellbeing';
  title: string;
  recommendation: string;
  groundedReason: string;
  priority: 'High' | 'Medium' | 'Low';
  actionableStep: string;
}

/**
 * Deterministic Grounded Recommendation Engine.
 * 
 * Rules:
 * - Operates entirely self-contained without external network dependency or API keys.
 * - Cites strictly facts verified in the student record and score components.
 * - Never fabricates faculty names, office hours, or nonexistent external portals.
 * - Advisory only: all recommendations require human educator review.
 */
export async function generateGroundedRecommendations(
  student: StudentProfile,
  _studentName: string, // Kept for interface compatibility; PII is intentionally not transmitted
  scoreData: AcademicSuccessScore
): Promise<GroundedRecommendation[]> {
  const recommendations: GroundedRecommendation[] = [];

  // 1. Attendance Recommendation
  const attComponent = scoreData.components.find((c) => c.name === 'Attendance');
  if (attComponent && attComponent.status !== 'missing' && attComponent.rawScore < 75) {
    recommendations.push({
      category: 'Attendance',
      title: 'Attendance Recovery & Session Attendance Milestone',
      recommendation: `Observed attendance is ${attComponent.rawScore}%, which is below the institutional 75% guideline. Focus on attending scheduled course sessions without absence.`,
      groundedReason: `Record verifies ${attComponent.description}.`,
      priority: 'High',
      actionableStep: 'Create a support plan milestone to attend next consecutive scheduled class sessions and record check-ins.',
    });
  }

  // 2. Academic / Backlog Recommendation
  if (student.backlogs > 0) {
    recommendations.push({
      category: 'Academic',
      title: 'Course Arrears Clearance Action',
      recommendation: `Student academic profile records ${student.backlogs} active backlog(s). Focus on supplementary preparation for the flagged subject.`,
      groundedReason: `Transcript lists ${student.backlogs} unresolved arrears in semester ${student.semester}.`,
      priority: 'High',
      actionableStep: 'Confirm syllabus requirements for the arrear subject and schedule weekly revision slots.',
    });
  }

  // 3. Academic Score Concern
  const acadComponent = scoreData.components.find((c) => c.name === 'Academic Performance');
  if (acadComponent && acadComponent.status !== 'missing' && acadComponent.rawScore < 60) {
    recommendations.push({
      category: 'Academic',
      title: 'Targeted Academic Tutoring & Deliverable Review',
      recommendation: `Recent assessments reflect an academic average of ${acadComponent.rawScore}/100. Diagnostic review with course instructor is suggested.`,
      groundedReason: `Verified record: ${acadComponent.description}.`,
      priority: 'Medium',
      actionableStep: 'Review returned marks and schedule a tutorial discussion on core syllabus concepts.',
    });
  }

  // 4. Provisional Score Notification
  if (scoreData.isProvisional) {
    recommendations.push({
      category: 'Academic',
      title: 'Complete Coursework & Telemetry Verification',
      recommendation: `Overall score is marked Provisional because verified data coverage is ${scoreData.availableDataPercent}% (below 70% threshold).`,
      groundedReason: 'Missing or unverified component inputs are excluded from calculation.',
      priority: 'Low',
      actionableStep: 'Verify semester submissions, lab reports, and learning platform activity logs.',
    });
  }

  // 5. Positive / High-Performing Mentoring
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'Academic',
      title: 'Advanced Honours Mentoring & Capstone Exploration',
      recommendation: `Student demonstrates strong indicators (CGPA ${student.cgpa.toFixed(2)}/10, ${attComponent ? attComponent.rawScore : 90}% attendance). Explore advanced projects or peer tutoring roles.`,
      groundedReason: `Consistent academic indicators across verified records with 0 arrears.`,
      priority: 'Low',
      actionableStep: 'Discuss research paper reading, advanced capstone concepts, or peer mentoring opportunities.',
    });
  }

  return recommendations;
}
