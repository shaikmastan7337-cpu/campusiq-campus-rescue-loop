import {
  StudentProfile,
  PlacementDrive,
  PlacementEligibilityResult,
  PlacementEligibilityCriterion,
} from '../types';

/**
 * Shared deterministic placement eligibility evaluator.
 * Evaluates a student against a specific PlacementDrive's criteria.
 * 
 * Rules:
 * 1. CGPA cutoff: student.cgpa >= drive.eligibility.minCgpa
 * 2. Backlogs limit: student.backlogs <= drive.eligibility.maxBacklogs
 * 3. Department match: drive.eligibility.departments.includes(student.departmentId)
 */
export function checkPlacementEligibility(
  student: StudentProfile,
  drive: PlacementDrive
): PlacementEligibilityResult {
  const criteriaDetails: PlacementEligibilityCriterion[] = [];
  const unmetCriteria: string[] = [];

  // 1. CGPA evaluation
  const minCgpa = drive.eligibility.minCgpa ?? 0;
  const studentCgpa = typeof student.cgpa === 'number' ? student.cgpa : 0;
  const cgpaMet = studentCgpa >= minCgpa;
  criteriaDetails.push({
    name: 'Minimum CGPA',
    required: `>= ${minCgpa.toFixed(2)}`,
    actual: studentCgpa.toFixed(2),
    met: cgpaMet,
  });
  if (!cgpaMet) {
    unmetCriteria.push(
      `CGPA (${studentCgpa.toFixed(2)}) is below the required cutoff of ${minCgpa.toFixed(2)}`
    );
  }

  // 2. Backlogs evaluation
  const maxBacklogs = drive.eligibility.maxBacklogs ?? 0;
  const studentBacklogs = typeof student.backlogs === 'number' ? student.backlogs : 0;
  const backlogsMet = studentBacklogs <= maxBacklogs;
  criteriaDetails.push({
    name: 'Active Backlogs',
    required: `<= ${maxBacklogs}`,
    actual: `${studentBacklogs}`,
    met: backlogsMet,
  });
  if (!backlogsMet) {
    unmetCriteria.push(
      `Active arrears count (${studentBacklogs}) exceeds allowed limit of ${maxBacklogs}`
    );
  }

  // 3. Department eligibility
  const allowedDepts = drive.eligibility.departments || [];
  if (allowedDepts.length > 0) {
    const deptMet = allowedDepts.includes(student.departmentId);
    criteriaDetails.push({
      name: 'Eligible Departments',
      required: allowedDepts.map(d => d.replace('dept-', '').toUpperCase()).join(', '),
      actual: (student.departmentName || student.departmentId || 'Unknown').replace('dept-', '').toUpperCase(),
      met: deptMet,
    });
    if (!deptMet) {
      unmetCriteria.push(
        `Department (${student.departmentName || student.departmentId}) is not in the eligible department list`
      );
    }
  }

  const isEligible = unmetCriteria.length === 0;

  return {
    isEligible,
    status: isEligible ? 'eligible' : 'ineligible',
    unmetCriteria,
    criteriaDetails,
    evaluatedAt: new Date().toISOString(),
  };
}
