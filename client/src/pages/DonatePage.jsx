import React, { useEffect, useState } from 'react';
//import qrCode from '../assets/qr-code.png'; // Đảm bảo bạn có hình ảnh QR code trong thư mục assets
import Footer from '../components/Footer';
import qrCode from '../assets/image 9.png';
// export default function DonatePage() {
//   return (
//     <div style={{ backgroundColor: '#FFF5E1', minHeight: '100vh', paddingBottom: '20px' }}>
//       {/* Nội dung chính */}
//       <div style={{ textAlign: 'center', padding: '50px 20px' }}>
//         {/* Tiêu đề */}
//         <h1
//           style={{
//             fontSize: '36px',
//             fontWeight: '600',
//             color: '#F5A623',
//             marginBottom: '10px',
//             fontFamily: '"Varela Round", sans-serif',
//           }}
//         >
//           Cưu một bé nhỏ, nhận cả bầu trời yêu thương!
//         </h1>

//         {/* Dòng chữ phụ */}
//         <p
//           style={{
//             fontSize: '20px',
//             color: '#6B3A0F',
//             marginBottom: '40px',
//             fontFamily: '"Varela Round", sans-serif',
//           }}
//         >
//           Một lần cứu hộ - Một đời tri kỷ!
//         </p>

//         {/* Thông tin donate */}
//         <div style={{ maxWidth: '600px', margin: '0 auto' }}>
//           <p
//             style={{
//               fontSize: '18px',
//               color: '#333',
//               marginBottom: '20px',
//               fontFamily: '"Varela Round", sans-serif',
//             }}
//           >
//             Hỗ trợ học donate cho chúng mình tại:
//           </p>

//           {/* QR Code */}
//           {/* <img
//             src={qrCode}
//             alt="QR Code Donate"
//             style={{
//               width: '200px',
//               height: '200px',
//               marginBottom: '20px',
//               border: '5px solid #F5A623',
//               borderRadius: '10px',
//             }}
//           /> */}

//           {/* Thông tin tài khoản */}
//           <p
//             style={{
//               fontSize: '16px',
//               color: '#333',
//               marginBottom: '10px',
//               fontFamily: '"Varela Round", sans-serif',
//             }}
//           >
//             <strong>Pawmily</strong> - Petbonk - 83861836
//           </p>
//           <p
//             style={{
//               fontSize: '16px',
//               color: '#333',
//               marginBottom: '20px',
//               fontFamily: '"Varela Round", sans-serif',
//             }}
//           >
//             <strong>Momo</strong> - 0123456789
//           </p>

//           {/* Ghi chú */}
//           <p
//             style={{
//               fontSize: '14px',
//               color: '#666',
//               fontStyle: 'italic',
//               fontFamily: '"Varela Round", sans-serif',
//             }}
//           >
//             Chuyển mình kèm 100% số tiền donate sẽ được sử dụng để duy trì website và hỗ trợ cứu hộ chăm sóc các bé động vật
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

export default function DonatePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleQrScan = () => {
    setIsNotificationOpen(true);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#FFF5E1', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Nội dung chính */}
      <div style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Tiêu đề */}
        <h1
          style={{
            fontSize: '48px', // Increased font size for bigger text
            fontWeight: '600',
            color: '#F5A623',
            marginBottom: '20px',
            fontFamily: '"Varela Round", sans-serif',
            lineHeight: '1.2', // Better spacing for larger text
          }}
        >
          Cưu một bé nhỏ, nhận cả bầu trời yêu thương!
        </h1>

        {/* Dòng chữ phụ */}
        <p
          style={{
            fontSize: '28px', // Increased font size for bigger text
            color: '#6B3A0F',
            marginBottom: '40px',
            fontFamily: '"Varela Round", sans-serif',
            lineHeight: '1.4', // Better readability
          }}
        >
          Một lần cứu hộ - Một đời tri kỷ!
        </p>

        {/* Thông tin donate */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '22px', // Increased font size for bigger text
              color: '#333',
              marginBottom: '30px',
              fontFamily: '"Varela Round", sans-serif',
              textAlign: 'center', // Centered text
            }}
          >
            Hỗ trợ học donate cho chúng mình tại:
          </p>

          {/* QR Code */}
          <img
            src={qrCode}
            alt="QR Code Donate"
            onClick={handleQrScan}
            style={{
              width: '300px', // Increased size to 300px
              height: '300px', // Increased size to 300px
              marginBottom: '30px',
              border: '8px solid #F5A623', // Thicker border for emphasis
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'block', // Ensures centering
              marginLeft: 'auto',
              marginRight: 'auto', // Centers the QR code
            }}
          />

          {/* Thông tin tài khoản */}
          <p
            style={{
              fontSize: '20px', // Increased font size for bigger text
              color: '#333',
              marginBottom: '15px',
              fontFamily: '"Varela Round", sans-serif',
              textAlign: 'center', // Centered text
            }}
          >
            <strong>Pawmily</strong> - Petbonk - 83861836
          </p>
          <p
            style={{
              fontSize: '20px', // Increased font size for bigger text
              color: '#333',
              marginBottom: '30px',
              fontFamily: '"Varela Round", sans-serif',
              textAlign: 'center', // Centered text
            }}
          >
            <strong>Momo</strong> - 0123456789
          </p>

          {/* Ghi chú */}
          <p
            style={{
              fontSize: '18px', // Increased font size for bigger text
              color: '#666',
              fontStyle: 'italic',
              fontFamily: '"Varela Round", sans-serif',
              textAlign: 'center', // Centered text
            }}
          >
            Chuyển mình kèm 100% số tiền donate sẽ được sử dụng để duy trì website và hỗ trợ cứu hộ chăm sóc các bé động vật
          </p>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}