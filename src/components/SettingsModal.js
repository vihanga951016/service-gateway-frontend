import React from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../App.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Settings</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-title">Appearance</span>
                            <span className="setting-desc">Switch between light and dark mode</span>
                        </div>
                        <button
                            className={`theme-toggle ${theme}`}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            <div className="toggle-handle">
                                {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
