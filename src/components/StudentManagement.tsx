import React, { useState, useEffect } from 'react'
import { 
  GraduationCap, Plus, Search, Filter, Edit, Trash2, 
  Eye, Download, Upload, Users, BookOpen, Calendar,
  Award, TrendingUp, BarChart3, User, Mail, Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Student {
  id: string
  nis: string
  name: string
  class: string
  grade: number
  birth_date: string
  birth_place: string
  gender: 'L' | 'P'
  address: string
  phone: string
  email: string
  parent_name: string
  parent_phone: string
  parent_email: string
  enrollment_date: string
  status: 'aktif' | 'lulus' | 'pindah' | 'dropout'
  photo_url?: string
  created_at: string
  updated_at: string
}

interface StudentGrade {
  id: string
  student_id: string
  subject: string
  semester: number
  year: number
  grade: number
  description: string
}

const mockStudentData: Student[] = [
  {
    id: '1',
    nis: '2024001',
    name: 'Ahmad Rizki Pratama',
    class: '10A',
    grade: 10,
    birth_date: '2008-05-15',
    birth_place: 'Jakarta',
    gender: 'L',
    address: 'Jl. Merdeka No. 123, Jakarta',
    phone: '081234567890',
    email: 'ahmad.rizki@email.com',
    parent_name: 'Budi Pratama',
    parent_phone: '081234567891',
    parent_email: 'budi.pratama@email.com',
    enrollment_date: '2024-07-15',
    status: 'aktif',
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-15T10:00:00Z'
  },
  {
    id: '2',
    nis: '2024002',
    name: 'Siti Nurhaliza',
    class: '10B',
    grade: 10,
    birth_date: '2008-03-20',
    birth_place: 'Bandung',
    gender: 'P',
    address: 'Jl. Sudirman No. 456, Bandung',
    phone: '081234567892',
    email: 'siti.nurhaliza@email.com',
    parent_name: 'Andi Wijaya',
    parent_phone: '081234567893',
    parent_email: 'andi.wijaya@email.com',
    enrollment_date: '2024-07-15',
    status: 'aktif',
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-15T10:00:00Z'
  },
  {
    id: '3',
    nis: '2021001',
    name: 'Muhammad Fajar',
    class: '12A',
    grade: 12,
    birth_date: '2006-01-10',
    birth_place: 'Surabaya',
    gender: 'L',
    address: 'Jl. Pahlawan No. 789, Surabaya',
    phone: '081234567894',
    email: 'muhammad.fajar@email.com',
    parent_name: 'Hasan Abdullah',
    parent_phone: '081234567895',
    parent_email: 'hasan.abdullah@email.com',
    enrollment_date: '2021-07-15',
    status: 'lulus',
    created_at: '2021-07-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z'
  }
]

const mockGradeData: StudentGrade[] = [
  {
    id: '1',
    student_id: '1',
    subject: 'Matematika',
    semester: 1,
    year: 2024,
    grade: 85,
    description: 'Baik'
  },
  {
    id: '2',
    student_id: '1',
    subject: 'Bahasa Indonesia',
    semester: 1,
    year: 2024,
    grade: 88,
    description: 'Sangat Baik'
  }
]

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudentData)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudentData)
  const [grades, setGrades] = useState<StudentGrade[]>(mockGradeData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({})
  const [activeTab, setActiveTab] = useState<'list' | 'statistics'>('list')

  const classes = ['10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C']
  const gradeOptions = [10, 11, 12]
  const statuses = ['aktif', 'lulus', 'pindah', 'dropout']

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass)
    }

    if (selectedGrade) {
      filtered = filtered.filter(student => student.grade === parseInt(selectedGrade))
    }

    if (selectedStatus) {
      filtered = filtered.filter(student => student.status === selectedStatus)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedClass, selectedGrade, selectedStatus])

  const handleAddStudent = () => {
    if (!formData.name || !formData.nis || !formData.class) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      nis: formData.nis || '',
      name: formData.name || '',
      class: formData.class || '',
      grade: formData.grade || 10,
      birth_date: formData.birth_date || '',
      birth_place: formData.birth_place || '',
      gender: formData.gender || 'L',
      address: formData.address || '',
      phone: formData.phone || '',
      email: formData.email || '',
      parent_name: formData.parent_name || '',
      parent_phone: formData.parent_phone || '',
      parent_email: formData.parent_email || '',
      enrollment_date: formData.enrollment_date || new Date().toISOString().split('T')[0],
      status: formData.status || 'aktif',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setStudents([...students, newStudent])
    setFormData({})
    setShowAddModal(false)
    toast.success('Siswa berhasil ditambahkan')
  }

  const handleEditStudent = () => {
    if (!selectedStudent || !formData.name || !formData.nis || !formData.class) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const updatedStudents = students.map(student =>
      student.id === selectedStudent.id
        ? { ...student, ...formData, updated_at: new Date().toISOString() }
        : student
    )

    setStudents(updatedStudents)
    setFormData({})
    setSelectedStudent(null)
    setShowEditModal(false)
    toast.success('Data siswa berhasil diperbarui')
  }

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      setStudents(students.filter(student => student.id !== id))
      toast.success('Data siswa berhasil dihapus')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif': return 'text-green-600 bg-green-100'
      case 'lulus': return 'text-blue-600 bg-blue-100'
      case 'pindah': return 'text-yellow-600 bg-yellow-100'
      case 'dropout': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const exportToCSV = () => {
    const headers = ['NIS', 'Nama', 'Kelas', 'Tingkat', 'Jenis Kelamin', 'Email', 'Telepon', 'Status']
    const csvData = filteredStudents.map(student => [
      student.nis,
      student.name,
      student.class,
      student.grade,
      student.gender,
      student.email,
      student.phone,
      student.status
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `data_siswa_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Data siswa berhasil diekspor')
  }

  const getStatistics = () => {
    const totalStudents = students.length
    const activeStudents = students.filter(s => s.status === 'aktif').length
    const graduatedStudents = students.filter(s => s.status === 'lulus').length
    const maleStudents = students.filter(s => s.gender === 'L').length
    const femaleStudents = students.filter(s => s.gender === 'P').length

    const gradeDistribution = gradeOptions.reduce((acc, grade) => {
      acc[grade] = students.filter(s => s.grade === grade).length
      return acc
    }, {} as Record<number, number>)

    return {
      totalStudents,
      activeStudents,
      graduatedStudents,
      maleStudents,
      femaleStudents,
      gradeDistribution
    }
  }

  const stats = getStatistics()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Siswa</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola data siswa dan akademik</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Ekspor CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            Daftar Siswa
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'statistics'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="inline-block w-4 h-4 mr-2" />
            Statistik
          </button>
        </nav>
      </div>

      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Semua Kelas</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Semua Tingkat</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>Kelas {grade}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Semua Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <GraduationCap size={16} className="mr-2" />
                Total: {filteredStudents.length} siswa
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              NIS: {student.nis}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          {student.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          {student.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(student.enrollment_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowDetailModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setFormData(student)
                              setShowEditModal(true)
                            }}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowGradeModal(true)
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Award size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Statistics Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Siswa Aktif</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lulus</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.graduatedStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rasio L:P</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.maleStudents}:{stats.femaleStudents}
                </p>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribusi per Tingkat</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kelas {grade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {showAddModal ? 'Tambah Siswa' : 'Edit Data Siswa'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIS *
                </label>
                <input
                  type="text"
                  value={formData.nis || ''}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kelas *
                </label>
                <select
                  value={formData.class || ''}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tingkat
                </label>
                <select
                  value={formData.grade || ''}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Tingkat</option>
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>Kelas {grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  value={formData.parent_name || ''}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alamat
                </label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(false)
                  setFormData({})
                  setSelectedStudent(null)
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Batal
              </button>
              <button
                onClick={showAddModal ? handleAddStudent : handleEditStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAddModal ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Detail Siswa
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIS
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.nis}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kelas
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.class}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kelamin
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telepon
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedStudent.status)}`}>
                  {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Masuk
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedStudent.enrollment_date).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alamat
                </label>
                <p className="text-gray-900 dark:text-white">{selectedStudent.address}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedStudent(null)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}