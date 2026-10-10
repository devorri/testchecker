/**
 * Printable & Exportable Scantron Sheet Renderer
 * Generates standardized Optical Mark Recognition answer sheets for CCIT examinations.
 * Includes shadeable Student ID Digits grid and Course/Section bubbles for 100% automated identification.
 * Supports up to 100 questions in 5 columns (blocks of 5) with options A–E matching the thesis layout specification.
 */

export function printScantronSheet(
  title: string,
  subject: string,
  section: string,
  totalQuestions: number = 30,
  examDate?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export/print the Scantron sheet.');
    return;
  }

  const options = ['A', 'B', 'C', 'D', 'E'];
  const formattedDate = examDate || new Date().toISOString().split('T')[0];

  // Determine column count and items per column
  // For 100 questions: 5 columns x 20 items (matching Page 3 of PDF)
  // For 80 questions: 4 columns x 20 items (or 5 columns with up to 80)
  // For 50 questions: 3 columns (17, 17, 16) or 2 columns x 25
  let numCols = 2;
  if (totalQuestions >= 75) {
    numCols = 5;
  } else if (totalQuestions >= 40) {
    numCols = 3;
  } else {
    numCols = 2;
  }

  const questionsPerCol = Math.ceil(totalQuestions / numCols);

  // Generate Column HTML blocks
  const columnsHtml: string[] = [];
  for (let c = 0; c < numCols; c++) {
    const startQ = c * questionsPerCol + 1;
    const endQ = Math.min((c + 1) * questionsPerCol, totalQuestions);

    if (startQ > totalQuestions) break;

    let colHtml = `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    for (let q = startQ; q <= endQ; q++) {
      // Group in blocks of 5 with extra margin/border (as shown on Page 3)
      const isEndOfBlock = q % 5 === 0 && q !== endQ;
      const blockBottomMargin = isEndOfBlock ? 'margin-bottom: 7px; padding-bottom: 5px; border-bottom: 1.5px solid #cbd5e1;' : 'border-bottom: 1px dashed #e2e8f0;';

      colHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5px 2px; ${blockBottomMargin}">
          <span style="font-weight: 700; width: 22px; font-size: ${totalQuestions > 50 ? '10px' : '11px'}; font-family: monospace;">${q}.</span>
          <div style="display: flex; gap: ${totalQuestions > 50 ? '3px' : '6px'};">
            ${options.map(opt => `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="font-size: 7px; color: #64748b; line-height: 8px;">${opt}</span>
                <div style="width: ${totalQuestions > 50 ? '13px' : '15px'}; height: ${totalQuestions > 50 ? '13px' : '15px'}; border: 1.2px solid #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700;"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    colHtml += `</div>`;
    columnsHtml.push(colHtml);
  }

  // Student ID Digit Shading Columns (6 Digit columns 0-9)
  const idDigits = [1, 2, 3, 4, 5, 6];
  const digitsRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Common sections for bubble shading
  const knownSections = ['BSIT-3A', 'BSIT-3B', 'BSIT-4A'];
  const activeSectionClean = section.split(' ')[0];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scantron Sheet - ${title}</title>
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .alignment-target { width: 16px; height: 16px; background-color: #000000; position: absolute; }
          .top-left { top: 0; left: 0; }
          .top-right { top: 0; right: 0; }
          .bottom-left { bottom: 0; left: 0; }
          .bottom-right { bottom: 0; right: 0; }
        </style>
      </head>
      <body>
        <div style="position: relative; border: 2px solid #0f172a; padding: 14px; box-sizing: border-box; min-height: 98vh;">
          <!-- Corner Alignment Markers for OMR Camera Recognition -->
          <div class="alignment-target top-left"></div>
          <div class="alignment-target top-right"></div>
          <div class="alignment-target bottom-left"></div>
          <div class="alignment-target bottom-right"></div>

          <!-- Institutional Header -->
          <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 10px;">
            <h2 style="margin: 0; font-size: 15px; letter-spacing: 0.5px; text-transform: uppercase;">NORTH VALLEY COLLEGE FOUNDATION INC.</h2>
            <h3 style="margin: 2px 0 0 0; font-size: 12px; font-weight: 600; color: #334155;">College of Computing & Information Technology (CCIT)</h3>
            <p style="margin: 2px 0 0 0; font-size: 10px; font-style: italic; color: #64748b;">
              Standardized OMR Answer Sheet • ${totalQuestions} Questions (Options A–E)
            </p>
          </div>

          <!-- Top Metadata & Shadeable ID Matrix Grid -->
          <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 12px; margin-bottom: 10px; background: #f8fafc; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            
            <div style="font-size: 10.5px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="margin-bottom: 4px;"><strong>STUDENT NAME:</strong> ___________________________________</div>
                <div style="margin-bottom: 4px;"><strong>EXAM:</strong> <span style="font-weight: 600; border-bottom: 1px solid #000;">${title} (${subject})</span></div>
                <div style="margin-bottom: 4px;"><strong>DATE:</strong> <u>${formattedDate}</u></div>
              </div>
              
              <!-- Shadeable Section Grid -->
              <div style="margin-top: 6px; border-top: 1px dashed #cbd5e1; padding-top: 5px;">
                <span style="font-size: 9.5px; font-weight: 700; color: #334155; display: block; margin-bottom: 3px;">SHADE CLASS SECTION:</span>
                <div style="display: flex; gap: 10px; font-size: 9.5px; flex-wrap: wrap;">
                  ${knownSections.map(sec => `
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <div style="width: 12px; height: 12px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${activeSectionClean.includes(sec) ? '<div style="width: 8px; height: 8px; background: #000; border-radius: 50%;"></div>' : ''}
                      </div>
                      <span>${sec}</span>
                    </div>
                  `).join('')}
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 12px; height: 12px; border: 1.5px solid #000; border-radius: 50%;"></div>
                    <span>OTHER: <u>${!knownSections.some(s => activeSectionClean.includes(s)) ? section : '____'}</u></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Shadeable Student ID Digits Grid (6 Columns) -->
            <div style="border-left: 1px solid #cbd5e1; padding-left: 10px;">
              <span style="font-size: 9px; font-weight: 700; color: #0f172a; display: block; text-align: center; margin-bottom: 2px;">
                SHADE STUDENT ID NUMBER
              </span>
              
              <!-- Boxes for writing digits -->
              <div style="display: flex; justify-content: center; gap: 4px; margin-bottom: 3px;">
                ${idDigits.map(() => `
                  <div style="width: 14px; height: 15px; border: 1px solid #0f172a; background: #fff; text-align: center;"></div>
                `).join('')}
              </div>

              <!-- Bubble Grid 0-9 for each digit -->
              <div style="display: flex; justify-content: center; gap: 4px;">
                ${idDigits.map(() => `
                  <div style="display: flex; flex-direction: column; gap: 1.5px; align-items: center;">
                    ${digitsRows.map(d => `
                      <div style="width: 11px; height: 11px; border: 1px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 6.5px; font-weight: 700;">${d}</div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Shading Instructions -->
          <div style="border: 1px solid #94a3b8; padding: 4px 8px; margin-bottom: 8px; font-size: 9px; display: flex; align-items: center; justify-content: space-between; background: #fff;">
            <div>
              <strong>INSTRUCTIONS:</strong> Fill circle completely with dark black pen or pencil. Do not make stray marks.
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <div>CORRECT: <span style="display: inline-block; width: 10px; height: 10px; background-color: #000; border-radius: 50%;"></span></div>
              <div>WRONG: <span style="display: inline-block; width: 10px; height: 10px; border: 1px solid #000; border-radius: 50%; line-height: 8px; text-align: center; font-size: 8px;">✗</span></div>
            </div>
          </div>

          <!-- Question Bubble Matrix Grid (Columns with 5-Question Clusters) -->
          <div style="display: grid; grid-template-columns: repeat(${numCols}, 1fr); gap: ${totalQuestions >= 80 ? '10px' : '18px'};">
            ${columnsHtml.join('')}
          </div>

          <div style="margin-top: 14px; border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8.5px; text-align: center; color: #64748b;">
            System Generated Scantron Sheet • CCIT Test Checker Automated Evaluation Platform • North Valley College Foundation Inc.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
