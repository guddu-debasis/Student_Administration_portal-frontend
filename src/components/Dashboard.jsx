import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import StudentForm from './StudentForm';
import { FaPlus, FaSignOutAlt, FaEdit, FaTrash, FaSearch, FaUserGraduate } from 'react-icons/fa';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const response = await api.get('/users');
            setStudents(response.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (regdNo) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/users/${regdNo}`);
                fetchStudents();
            } catch (err) {
                alert('Failed to delete student');
            }
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setShowModal(true);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.regdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="glass-card flex-between" style={{ marginBottom: '2rem' }}>
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}>
                        <FaUserGraduate size={24} color="white" />
                    </div>
                    <div>
                        <h2 className="text-gradient">Student Management</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Admin Dashboard</p>
                    </div>
                </div>
                <button className="btn btn-secondary" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Controls */}
            <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0, width: '300px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <FaPlus /> Add Student
                </button>
            </div>

            {/* Table */}
            <div className="glass-card table-container animate-fade-in">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No students found.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Regd No</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Grade</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.regdNo}>
                                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                                    <td><span className="badge badge-blue">{student.regdNo}</span></td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{student.email}</td>
                                    <td>{student.age}</td>
                                    <td>{student.grade}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn"
                                            style={{ padding: '0.5rem', marginRight: '0.5rem', color: 'var(--accent-color)' }}
                                            onClick={() => handleEdit(student)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ padding: '0.5rem', color: 'var(--danger-color)' }}
                                            onClick={() => handleDelete(student.regdNo)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <StudentForm
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchStudents}
                    initialData={editingStudent}
                />
            )}
        </div>
    );
};

export default Dashboard;
