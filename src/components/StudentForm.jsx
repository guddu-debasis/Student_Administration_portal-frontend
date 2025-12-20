import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaUser, FaEnvelope, FaIdCard, FaGraduationCap, FaSave, FaTimes } from 'react-icons/fa';

const StudentForm = ({ onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        regdNo: '',
        age: '',
        grade: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                // Update
                await api.put(`/users/${initialData.regdNo}`, formData);
            } else {
                // Create
                await api.post('/users', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="text-gradient">{initialData ? 'Edit Student' : 'Add New Student'}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="name"
                                className="input-field"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={!!initialData} // Email usually unique/immutable or handled carefully
                                style={{ paddingLeft: '2.5rem', opacity: initialData ? 0.7 : 1 }}
                            />
                            <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Registration Number</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="regdNo"
                                className="input-field"
                                value={formData.regdNo}
                                onChange={handleChange}
                                required
                                disabled={!!initialData} // ID cannot be changed
                                style={{ paddingLeft: '2.5rem', opacity: initialData ? 0.7 : 1 }}
                            />
                            <FaIdCard style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                className="input-field"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Grade</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    name="grade"
                                    className="input-field"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                                <FaGraduationCap style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-between" style={{ marginTop: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (
                                <>
                                    <FaSave /> Save Student
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
