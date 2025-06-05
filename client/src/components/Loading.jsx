import React from 'react';

export default function Loading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
            <div style={{
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #E5C299',
                borderRadius: '50%',
                width: 48,
                height: 48,
                animation: 'spin 1s linear infinite',
                marginBottom: 16
            }} />
            <span style={{ color: '#5C4033', fontWeight: 500, fontSize: 18 }}>Đang tải...</span>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
