import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-container">
                <div className="loading-spinner-group">
                    <div className="loading-spinner-outer"></div>
                    <div className="loading-spinner-inner"></div>
                </div>
                <div className="loading-text">Đang tải...</div>
            </div>
        </div>
    );
};

export default Loading;
