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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Class Roster Management
          </span>
          <h1 className="text-3xl font-extrabold text-white">Student Rosters & Sections</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, edit, manage, and filter enrolled students by academic year level and section for automated OMR grading.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-cyan text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Enrolled Students</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{totalStudents}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Class Sections</span>
            <span className="text-3xl font-extrabold text-cyan-300 mt-1 block">{uniqueSectionsCount}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Academic Year Levels</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{uniqueYearsCount}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Sorting */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name or ID number..."
            className="input-dark pl-9 py-2 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          
          {/* Year Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <select
              className="bg-transparent text-white font-medium outline-none text-xs"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr} className="bg-slate-900 text-white">
                  {yr === 'ALL' ? 'All Years' : yr}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <select
              className="bg-transparent text-white font-medium outline-none text-xs"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {availableSections.map(sec => (
                <option key={sec} value={sec} className="bg-slate-900 text-white">
                  {sec === 'ALL' ? 'All Sections' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px]">Sort:</span>
            <select
              className="bg-transparent text-cyan-300 font-medium outline-none text-xs"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
              <option value="student_number" className="bg-slate-900 text-white">Student ID</option>
              <option value="section" className="bg-slate-900 text-white">Section</option>
              <option value="year_level" className="bg-slate-900 text-white">Year Level</option>
            </select>
          </div>

        </div>
      </div>

      {/* Student Table Roster */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Course / Degree</th>
                <th>Year Level</th>
                <th>Section</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map(student => (
                  <tr key={student.student_id}>
                    <td className="font-mono text-cyan-300 font-semibold text-xs">
                      {student.student_number}
                    </td>
                    <td className="font-semibold text-white">
                      {student.name}
                    </td>
                    <td className="text-xs text-slate-300">
                      {student.course}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {student.year_level || '3rd Year'}
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill">
                        {student.section}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
                          title="Edit Student Information"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete({ id: student.student_id, name: student.name })}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
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
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 w-full max-w-lg space-y-6">
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
                  className="input-dark font-mono"
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
                  className="input-dark"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Year Level</label>
                  <select
                    className="input-dark"
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
                    className="input-dark font-mono uppercase"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Course / Degree Program</label>
                <select
                  className="input-dark"
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
                <button type="submit" className="btn-cyan text-xs py-2 px-4 shadow-lg shadow-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {studentToEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 w-full max-w-lg space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Pencil className="w-5 h-5 text-cyan-400" /> Edit Student Details
            </h2>

            <form onSubmit={handleEditStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Student ID Number</label>
                <input
                  type="text"
                  required
                  className="input-dark font-mono"
                  value={editStudentNumber}
                  onChange={(e) => setEditStudentNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-dark"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Year Level</label>
                  <select
                    className="input-dark"
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
                    className="input-dark font-mono uppercase"
                    value={editSection}
                    onChange={(e) => setEditSection(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Course / Degree Program</label>
                <select
                  className="input-dark"
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
                <button type="submit" className="btn-cyan text-xs py-2 px-4 shadow-lg shadow-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Student */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 w-full max-w-md space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Delete Student Record?</h3>
              <p className="text-xs text-slate-300 mt-1">
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
