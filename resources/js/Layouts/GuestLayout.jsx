import React from 'react';

export default function Guest({ children }) {
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f3f4f6'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '0 16px'
            }}>
                {children}
            </div>
        </div>
    );
}
