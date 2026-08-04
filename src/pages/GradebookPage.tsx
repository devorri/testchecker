import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, FileSpreadsheet } from 'lucide-react';

const GradebookPage: React.FC = () => {
  const { scannedAnswers, exams, students } = useApp();
  
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredScans = scannedAnswers.filter(scan => {
    const student = students.find(s => s.student_id === scan.student_id);
    const matchesSection = selectedSection === 'ALL' || student?.section === selectedSection;
    const matchesExam = selectedExamId === 'ALL' || scan.exam_id === Number(selectedExamId);
    const matchesStatus = selectedStatus === 'ALL' || scan.remarks === selectedStatus;
    const matchesSearch = scan.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scan.student_number.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSection && matchesExam && matchesStatus && matchesSearch;
  });

  const totalFiltered = filteredScans.length;
  const passedFiltered = filteredScans.filter(s => s.remarks === 'PASSED').length;
  const failedFiltered = totalFiltered - passedFiltered;
  const avgScore = totalFiltered > 0
    ? Math.round((filteredScans.reduce((sum, s) => sum + s.percentage, 0) / totalFiltered) * 10) / 10
    : 0;

  const handleExportCSV = () => {
    const headers = ['Scan ID', 'Student Number', 'Student Name', 'Section', 'Exam Title', 'Score', 'Total', 'Percentage', 'Remarks', 'Date Generated'];
    const rows = filteredScans.map(scan => {
      const exam = exams.find(e => e.exam_id === scan.exam_id);
      const student = students.find(s => s.student_id === scan.student_id);
      return [
        scan.scan_id,
        scan.student_number,
        `"${scan.student_name}"`,
        student?.section || 'BSIT-3A',
        `"${exam?.title || 'Midterm Examination'}"`,
        scan.score,
        scan.total,
        `${scan.percentage}%`,
        scan.remarks,
        `"${scan.date_generated}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gradebook_Export_${selectedSection}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2">Central Database</span>
          <h1 className="text-3xl font-extrabold text-white">Class Gradebook & Assessment Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review auto-graded student examination scores, filter by class section, and export grade reports.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-cyan text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20">
          <FileSpreadsheet className="w-4 h-4" /> Export Gradebook to CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-medium block">Total Evaluated Papers</span>
          <span className="text-3xl font-extrabold text-white mt-1 block">{totalFiltered}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-medium block">Class Average</span>
          <span className="text-3xl font-extrabold text-cyan-300 mt-1 block">{avgScore}%</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-medium block">Passed Students</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{passedFiltered}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-medium block">Failed / Below Threshold</span>
          <span className="text-3xl font-extrabold text-red-400 mt-1 block">{failedFiltered}</span>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name or ID..."
            className="input-dark pl-9 py-2 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <select
            className="input-dark py-2 text-xs w-full sm:w-auto"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="ALL">All Sections</option>
            <option value="BSIT-3A">BSIT-3A</option>
            <option value="BSIT-3B">BSIT-3B</option>
            <option value="BSIT-4A">BSIT-4A</option>
          </select>

          <select
            className="input-dark py-2 text-xs w-full sm:w-auto"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            <option value="ALL">All Assessments</option>
            {exams.map(e => (
              <option key={e.exam_id} value={e.exam_id}>{e.title}</option>
            ))}
          </select>

          <select
            className="input-dark py-2 text-xs w-full sm:w-auto"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PASSED">✅ Passed Only</option>
            <option value="FAILED">❌ Failed Only</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Section</th>
                <th>Assessment Title</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Scan Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.length > 0 ? (
                filteredScans.map(scan => {
                  const exam = exams.find(e => e.exam_id === scan.exam_id);
                  const student = students.find(s => s.student_id === scan.student_id);
                  return (
                    <tr key={scan.scan_id}>
                      <td className="font-mono text-cyan-300 font-semibold text-xs">{scan.student_number}</td>
                      <td className="font-semibold text-white">{scan.student_name}</td>
                      <td>
                        <span className="badge-pill">{student?.section || 'BSIT-3A'}</span>
                      </td>
                      <td className="text-slate-300 text-xs">{exam?.title || 'Midterm Examination'}</td>
                      <td className="font-extrabold text-white font-mono">{scan.score} / {scan.total}</td>
                      <td className="font-mono text-cyan-300">{scan.percentage}%</td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${scan.remarks === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>
                          {scan.remarks}
                        </span>
                      </td>
                      <td className="text-xs text-slate-400 font-mono">{scan.date_generated}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No graded examination records found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default GradebookPage;
