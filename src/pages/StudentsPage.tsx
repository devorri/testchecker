import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Student } from '../utils/mockData';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Pencil,
  Filter,
  GraduationCap,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const StudentsPage: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useApp();

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'student_number' | 'year_level' | 'section'>('name');

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentNumber, setStudentNumber] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('BS Information Technology');
  const [yearLevel, setYearLevel] = useState('3rd Year');
  const [section, setSection] = useState('BSIT-3A');

  // Edit Modal State
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [editStudentNumber, setEditStudentNumber] = useState('');
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editYearLevel, setEditYearLevel] = useState('');
  const [editSection, setEditSection] = useState('');

  // Delete Confirmation State
  const [studentToDelete, setStudentToDelete] = useState<{ id: number; name: string } | null>(null);

  // Available unique sections and year levels
  const availableYears = ['ALL', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const availableSections = ['ALL', ...Array.from(new Set(students.map(s => s.section)))].sort();

  // Filter students based on Year, Section, and Search
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear =
      selectedYear === 'ALL' ||
      student.year_level === selectedYear ||
      (!student.year_level && (
        (selectedYear === '1st Year' && student.section.includes('1')) ||
        (selectedYear === '2nd Year' && student.section.includes('2')) ||
        (selectedYear === '3rd Year' && student.section.includes('3')) ||
        (selectedYear === '4th Year' && student.section.includes('4'))
      ));

    const matchesSection = selectedSection === 'ALL' || student.section === selectedSection;

    return matchesSearch && matchesYear && matchesSection;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'student_number') return a.student_number.localeCompare(b.student_number);
    if (sortBy === 'section') return a.section.localeCompare(b.section);
    if (sortBy === 'year_level') return (a.year_level || '').localeCompare(b.year_level || '');
    return 0;
  });

  // Unique counts for statistics
  const totalStudents = students.length;
  const uniqueSectionsCount = new Set(students.map(s => s.section)).size;
  const uniqueYearsCount = new Set(students.map(s => s.year_level || '3rd Year')).size;

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber || !name || !section) return;

    addStudent({
      student_number: studentNumber.trim(),
      name: name.trim(),
      course,
      year_level: yearLevel,
      section: section.trim().toUpperCase()
    });

    // Reset Form
    setShowAddModal(false);
    setStudentNumber('');
    setName('');
  };

  const handleOpenEditModal = (student: Student) => {
    setStudentToEdit(student);
    setEditStudentNumber(student.student_number);
    setEditName(student.name);
    setEditCourse(student.course);
    setEditYearLevel(student.year_level || '3rd Year');
    setEditSection(student.section);
  };

  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit || !editStudentNumber || !editName || !editSection) return;

    updateStudent(studentToEdit.student_id, {
      student_number: editStudentNumber.trim(),
      name: editName.trim(),
      course: editCourse,
      year_level: editYearLevel,
      section: editSection.trim().toUpperCase()
    });

    setStudentToEdit(null);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5 w-fit">
            <Users className="w-4 h-4 text-cyan-400" /> Class Roster Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Rosters & Sections</h1>
          <p className="text-sm text-slate-400 mt-1">
            Enrolled student registry with high-visibility filters by academic year level and section for automated OMR grading.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-cyan text-sm py-3 px-5 shadow-lg shadow-cyan-500/20 w-full sm:w-auto justify-center font-bold"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Total Enrolled Students</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-white mt-1 block font-mono">{totalStudents}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Active Class Sections</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-300 mt-1 block font-mono">{uniqueSectionsCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Academic Year Levels</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 block font-mono">{uniqueYearsCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Filter className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ENLARGED TOOLBAR & FILTER BAR (Highlighted in flow system NEW.pdf Page 4) */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/30 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center shadow-xl">
        
        {/* Search Bar - Larger Font & Padding */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search student name or student ID number..."
            className="input-dark pl-12 pr-4 py-3 text-sm rounded-xl font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ENLARGED FILTER CONTROLS (All Years, All Sections, Sort: Name A-Z) */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* All Years Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-cyan-500/25 hover:border-cyan-400/50 transition flex-1 sm:flex-none">
            <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <select
              className="bg-transparent text-white font-bold outline-none text-sm cursor-pointer w-full sm:w-auto"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr} className="bg-slate-900 text-white font-medium">
                  {yr === 'ALL' ? 'All Years' : yr}
                </option>
              ))}
            </select>
          </div>

          {/* All Sections Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-cyan-500/25 hover:border-cyan-400/50 transition flex-1 sm:flex-none">
            <Users className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <select
              className="bg-transparent text-white font-bold outline-none text-sm cursor-pointer w-full sm:w-auto"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {availableSections.map(sec => (
                <option key={sec} value={sec} className="bg-slate-900 text-white font-medium">
                  {sec === 'ALL' ? 'All Sections' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-cyan-500/25 hover:border-cyan-400/50 transition flex-1 sm:flex-none">
            <ArrowUpDown className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-slate-400 text-xs font-semibold">Sort:</span>
            <select
              className="bg-transparent text-cyan-300 font-bold outline-none text-sm cursor-pointer w-full sm:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name" className="bg-slate-900 text-white font-medium">Name (A-Z)</option>
              <option value="student_number" className="bg-slate-900 text-white font-medium">Student ID</option>
              <option value="section" className="bg-slate-900 text-white font-medium">Section</option>
              <option value="year_level" className="bg-slate-900 text-white font-medium">Year Level</option>
            </select>
          </div>

        </div>
      </div>

      {/* ENLARGED STUDENT TABLE ROSTER */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="table-custom text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-xs font-bold text-slate-300">Student ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-300">Full Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-300">Course / Degree</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-300">Year Level</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-300">Section</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map(student => (
                  <tr key={student.student_id} className="hover:bg-white/[0.03] transition-colors border-b border-white/5">
                    <td className="py-4 px-6 font-mono text-cyan-300 font-bold text-sm">
                      {student.student_number}
                    </td>
                    <td className="py-4 px-6 font-bold text-white text-base">
                      {student.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-300">
                      {student.course}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {student.year_level || '3rd Year'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="badge-pill font-mono text-xs py-1 px-3">
                        {student.section}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
                          title="Edit Student Information"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete({ id: student.student_id, name: student.name })}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete Student from Roster"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                    No students found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 w-full max-w-lg space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <UserPlus className="w-5 h-5 text-cyan-400" /> Register New Student
            </h2>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Student ID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-0099"
                  className="input-dark font-mono text-sm"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  className="input-dark text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Year Level</label>
                  <select
                    className="input-dark text-sm"
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Section</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSIT-3A"
                    className="input-dark font-mono uppercase text-sm"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Course / Degree Program</label>
                <select
                  className="input-dark text-sm"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="BS Information Technology">BS Information Technology</option>
                  <option value="BS Computer Science">BS Computer Science</option>
                  <option value="BS Information Systems">BS Information Systems</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-cyan text-xs py-2.5 px-5 shadow-lg shadow-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {studentToEdit && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 w-full max-w-lg space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Pencil className="w-5 h-5 text-cyan-400" /> Edit Student Details
            </h2>

            <form onSubmit={handleEditStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Student ID Number</label>
                <input
                  type="text"
                  required
                  className="input-dark font-mono text-sm"
                  value={editStudentNumber}
                  onChange={(e) => setEditStudentNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-dark text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Year Level</label>
                  <select
                    className="input-dark text-sm"
                    value={editYearLevel}
                    onChange={(e) => setEditYearLevel(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Section</label>
                  <input
                    type="text"
                    required
                    className="input-dark font-mono uppercase text-sm"
                    value={editSection}
                    onChange={(e) => setEditSection(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Course / Degree Program</label>
                <select
                  className="input-dark text-sm"
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                >
                  <option value="BS Information Technology">BS Information Technology</option>
                  <option value="BS Computer Science">BS Computer Science</option>
                  <option value="BS Information Systems">BS Information Systems</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStudentToEdit(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-cyan text-xs py-2.5 px-5 shadow-lg shadow-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Student */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 w-full max-w-md space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Delete Student Record?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-cyan-300">{studentToDelete.name}</span> from the active roster?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentsPage;
