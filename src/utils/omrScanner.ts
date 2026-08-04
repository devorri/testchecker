/**
 * Optical Mark Recognition (OMR) Simulation & Canvas Analysis Utility
 * Aligned with the methodology described in Chapter III of the thesis paper.
 */

export interface OMRScanResult {
  detectedAnswers: Record<number, string>;
  score: number;
  total: number;
  percentage: number;
  remarks: 'PASSED' | 'FAILED';
  itemDetails: {
    questionNumber: number;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

/**
 * Analyzes student response bubble matrix against the exam answer key.
 */
export function evaluateOMRResponse(
  studentAnswers: Record<number, string>,
  correctKey: Record<number, string>,
  totalQuestions: number
): OMRScanResult {
  let score = 0;
  const itemDetails: OMRScanResult['itemDetails'] = [];

  for (let q = 1; q <= totalQuestions; q++) {
    const studentAns = studentAnswers[q] || 'OMITTED';
    const correctAns = correctKey[q] || 'A';
    const isCorrect = studentAns === correctAns;

    if (isCorrect) {
      score++;
    }

    itemDetails.push({
      questionNumber: q,
      studentAnswer: studentAns,
      correctAnswer: correctAns,
      isCorrect
    });
  }

  const percentage = Math.round((score / totalQuestions) * 1000) / 10;
  const remarks = percentage >= 60 ? 'PASSED' : 'FAILED';

  return {
    detectedAnswers: studentAnswers,
    score,
    total: totalQuestions,
    percentage,
    remarks,
    itemDetails
  };
}

/**
 * Generates a mock shaded scan dataset for testing/demo scanner uploads
 */
export function generateMockScanData(
  totalQuestions: number,
  correctKey: Record<number, string>,
  accuracyRate: number = 0.85
): Record<number, string> {
  const options = ['A', 'B', 'C', 'D'];
  const mockAnswers: Record<number, string> = {};

  for (let q = 1; q <= totalQuestions; q++) {
    const correctOption = correctKey[q] || options[Math.floor(Math.random() * options.length)];
    if (Math.random() <= accuracyRate) {
      mockAnswers[q] = correctOption;
    } else {
      const wrongOptions = options.filter(o => o !== correctOption);
      mockAnswers[q] = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }
  }

  return mockAnswers;
}
