import React, { useEffect, useState } from 'react';

import qrCode from '../assets/image 9.png';


export default function DonatePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleQrScan = () => {
    setIsNotificationOpen(true);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFF5E1',
        minHeight: '80vh',
        // Có thể thêm backgroundImage ở đây nếu muốn
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '50px 20px',
          flexWrap: 'wrap', // Để hỗ trợ responsive
        }}
      >
        {/* Nội dung chữ bên trái */}
        <div style={{
          flex: 1,
          minWidth: 260,
          maxWidth: 500,
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#F5A623',
            marginBottom: '20px',
            fontFamily: '"Varela Round", sans-serif',
            lineHeight: '1.2',
          }}>
            Cứu một bé nhỏ, nhận cả bầu trời yêu thương!
          </h1>
          <p style={{
            fontSize: '24px',
            color: '#6B3A0F',
            marginBottom: '40px',
            fontFamily: '"Varela Round", sans-serif',
            lineHeight: '1.4',
          }}>
            Một lần cứu hộ - Một đời tri kỷ!
          </p>
          <p style={{
            fontSize: '20px',
            color: '#333',
            marginBottom: '30px',
            fontFamily: '"Varela Round", sans-serif',
          }}>
            Hỗ trợ hoặc donate cho chúng mình tại:
          </p>
          <p style={{
            fontSize: '20px',
            color: '#333',
            marginBottom: '15px',
            fontFamily: '"Varela Round", sans-serif',
          }}>
            <strong>Pawmily</strong> - Petbonk - 83861836
          </p>
          <p style={{
            fontSize: '20px',
            color: '#333',
            marginBottom: '30px',
            fontFamily: '"Varela Round", sans-serif',
          }}>
            <strong>Momo</strong> - 0123456789
          </p>
          <p style={{
            fontSize: '18px',
            color: '#666',
            fontStyle: 'italic',
            fontFamily: '"Varela Round", sans-serif',
          }}>
            Chuyển mình kèm 100% số tiền donate sẽ được sử dụng để duy trì website và hỗ trợ cứu hộ chăm sóc các bé động vật
          </p>
        </div>
        {/* QR code bên phải */}
        <div style={{
          flex: 1,
          minWidth: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img
            src={qrCode}
            alt="QR Code Donate"
            onClick={handleQrScan}
            style={{
              width: '300px',
              height: '300px',
              marginBottom: '30px',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Pop-up thông báo */}
      {isNotificationOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '400px',
              width: '90%',
              position: 'relative',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                color: '#F5A623',
                marginBottom: '10px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              Cảm ơn bạn đã donate!
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#333',
                marginBottom: '20px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              Số tiền của bạn sẽ được sử dụng để cứu hộ và chăm sóc các bé động vật. Chúng mình rất biết ơn sự hỗ trợ của bạn!
            </p>
            <button
              onClick={closeNotification}
              style={{
                backgroundColor: '#F5A623',
                color: '#FFF',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}