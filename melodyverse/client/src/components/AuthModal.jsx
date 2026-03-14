import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                toast.success('Welcome back! 🎵');
            } else {
                await register(formData.name, formData.email, formData.password);
                toast.success('Account created! Welcome to MelodyVerse! 🎉');
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><FiX /></button>

                <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '40px' }}>🎵</div>
                <h2 className="modal-title">
                    {mode === 'login' ? 'Welcome Back' : 'Join MelodyVerse'}
                </h2>
                <p className="modal-subtitle">
                    {mode === 'login' ? 'Stream the greatest musical legends' : 'Create your free account'}
                </p>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="form-footer">
                    {mode === 'login' ? (
                        <>Don't have an account? <span onClick={() => onSwitchMode('register')}>Sign Up</span></>
                    ) : (
                        <>Already have an account? <span onClick={() => onSwitchMode('login')}>Sign In</span></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
