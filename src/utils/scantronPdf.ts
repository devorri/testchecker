/**
 * Printable & Exportable Scantron Sheet Renderer
 * Generates standardized Optical Mark Recognition answer sheets for CCIT examinations.
 * Includes shadeable Student ID Digits grid and Course/Section bubbles for 100% automated identification.
 */

export function printScantronSheet(title: string, subject: string, section: string, totalQuestions: number = 30) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export/print the Scantron sheet.');
    return;
  }

  const options = ['A', 'B', 'C', 'D'];
  const questionsPerCol = Math.ceil(totalQuestions / 2);

  let leftColHtml = '';
  let rightColHtml = '';

  for (let i = 1; i <= questionsPerCol; i++) {
    leftColHtml += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 6px; border-bottom: 1px dashed #cbd5e1;">
        <span style="font-weight: 700; width: 26px; font-size: 12px;">${i}.</span>
        <div style="display: flex; gap: 10px;">
          ${options.map(opt => `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="font-size: 8px; color: #64748b;">${opt}</span>
              <div style="width: 16px; height: 16px; border: 1.5px solid #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600;"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  for (let i = questionsPerCol + 1; i <= totalQuestions; i++) {
    rightColHtml += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 6px; border-bottom: 1px dashed #cbd5e1;">
        <span style="font-weight: 700; width: 26px; font-size: 12px;">${i}.</span>
        <div style="display: flex; gap: 10px;">
          ${options.map(opt => `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="font-size: 8px; color: #64748b;">${opt}</span>
              <div style="width: 16px; height: 16px; border: 1.5px solid #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600;"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Student ID Digit Shading Columns (6 Digit columns 0-9)
  const idDigits = [1, 2, 3, 4, 5, 6];
  const digitsRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scantron Sheet - ${title}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #0f172a; }
          .alignment-target { width: 18px; height: 18px; background-color: #000000; position: absolute; }
          .top-left { top: 0; left: 0; }
          .top-right { top: 0; right: 0; }
          .bottom-left { bottom: 0; left: 0; }
          .bottom-right { bottom: 0; right: 0; }
        </style>
      </head>
      <body>
        <div style="position: relative; border: 2px solid #0f172a; padding: 18px; box-sizing: border-box; min-height: 96vh;">
          <!-- Corner Alignment Markers for OMR Camera Recognition -->
          <div class="alignment-target top-left"></div>
          <div class="alignment-target top-right"></div>
          <div class="alignment-target bottom-left"></div>
          <div class="alignment-target bottom-right"></div>

          <!-- Institutional Header -->
          <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px;">
            <h2 style="margin: 0; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">NORTH VALLEY COLLEGE FOUNDATION INC.</h2>
            <h3 style="margin: 3px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">College of Computing & Information Technology (CCIT)</h3>
            <p style="margin: 2px 0 0 0; font-size: 11px; font-style: italic; color: #64748b;">Automated OMR Answer Sheet with Shadeable Student ID & Section Grid</p>
          </div>

          <!-- Top Metadata & Shadeable ID Matrix Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; background: #f8fafc; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            
            <div>
              <div style="margin-bottom: 6px; font-size: 11px;"><strong>STUDENT NAME:</strong> ___________________________________</div>
              <div style="margin-bottom: 6px; font-size: 11px;"><strong>EXAM TITLE:</strong> <span style="border-bottom: 1px solid #000;">${title} (${subject})</span></div>
              <div style="margin-bottom: 6px; font-size: 11px;"><strong>DATE:</strong> ________________________</div>
              
              <!-- Shadeable Section Grid -->
              <div style="margin-top: 10px; border-top: 1px dashed #cbd5e1; pt-6px;">
                <span style="font-size: 10px; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">SHADE CLASS SECTION:</span>
                <div style="display: flex; gap: 14px; font-size: 10px;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      ${section === 'BSIT-3A' ? '<div style="width: 10px; height: 10px; background: #000; border-radius: 50%;"></div>' : ''}
                    </div>
                    <span>BSIT-3A</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      ${section === 'BSIT-3B' ? '<div style="width: 10px; height: 10px; background: #000; border-radius: 50%;"></div>' : ''}
                    </div>
                    <span>BSIT-3B</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      ${section === 'BSIT-4A' ? '<div style="width: 10px; height: 10px; background: #000; border-radius: 50%;"></div>' : ''}
                    </div>
                    <span>BSIT-4A</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Shadeable Student ID Digits Grid (6 Columns) -->
            <div style="border-left: 1px solid #cbd5e1; padding-left: 12px;">
              <span style="font-size: 10px; font-weight: 700; color: #0f172a; display: block; text-align: center; margin-bottom: 4px;">
                SHADE STUDENT ID NUMBER
              </span>
              
              <!-- Boxes for writing digits -->
              <div style="display: flex; justify-content: center; gap: 6px; margin-bottom: 4px;">
                ${idDigits.map(() => `
                  <div style="width: 16px; height: 18px; border: 1px solid #0f172a; background: #fff; text-align: center;"></div>
                `).join('')}
              </div>

              <!-- Bubble Grid 0-9 for each digit -->
              <div style="display: flex; justify-content: center; gap: 6px;">
                ${idDigits.map(() => `
                  <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
                    ${digitsRows.map(d => `
                      <div style="width: 13px; height: 13px; border: 1px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700;">${d}</div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Shading Instructions -->
          <div style="border: 1px solid #94a3b8; padding: 6px 10px; margin-bottom: 12px; font-size: 10px; display: flex; align-items: center; justify-content: space-between; background: #fff;">
            <div>
              <strong>INSTRUCTIONS:</strong> Shade completely with dark black pen/pencil. Do not make stray marks.
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <div>CORRECT: <span style="display: inline-block; width: 12px; height: 12px; background-color: #000; border-radius: 50%;"></span></div>
              <div>WRONG: <span style="display: inline-block; width: 12px; height: 12px; border: 1px solid #000; border-radius: 50%; line-height: 10px; text-align: center;">✗</span></div>
            </div>
          </div>

          <!-- Question Bubble Matrix Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>${leftColHtml}</div>
            <div>${rightColHtml}</div>
          </div>

          <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; pt-6px; font-size: 9px; text-align: center; color: #64748b;">
            System Generated Scantron Sheet • CCIT Test Checker Automated Evaluation Platform
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
