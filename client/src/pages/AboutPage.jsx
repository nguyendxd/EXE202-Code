import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import pawLogo from '../assets/paw-logo.png'; // Ensure this image exists in assets

export default function AboutUsPage() {
  return (
    <div style={{ backgroundColor: '#FFF5E1', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Main Content */}
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        {/* Header Section */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#F5A623',
            marginBottom: '10px',
            fontFamily: '"Varela Round", sans-serif',
          }}
        >
          VỀ CHÚNG MÌNH
        </h1>
        <img
          src={pawLogo}
          alt="Pawmily Logo"
          style={{ height: '80px', marginBottom: '40px' }}
        />

        {/* Team Section */}
        <div
          style={{
            backgroundColor: '#6B3A0F',
            color: '#FFF',
            padding: '20px',
            marginBottom: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="https://via.placeholder.com/400x200" // Replace with actual team image URL
            alt="Team Photo"
            style={{ width: '400px', height: '200px', marginRight: '20px' }}
          />
          <p
            style={{
              fontSize: '16px',
              maxWidth: '500px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            ĐỘI NGŨ MLAAP - Chúng mình là những người trẻ đam mê với việc bảo vệ và chăm sóc động vật. Với tình yêu và sự tận tâm, chúng mình luôn nỗ lực để mang đến một cuộc sống tốt đẹp hơn cho các bé động vật hoang dã và bị bỏ rơi. Hãy cùng chúng mình tạo nên sự khác biệt!
          </p>
        </div>

        {/* Family Up Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6B3A0F',
              marginBottom: '20px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            FAMILY UP
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                backgroundColor: '#F5C07A',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                Tình bạn tuyệt vời - Chúng mình gặp nhau qua những lần cứu hộ và cùng nhau xây dựng một cộng đồng yêu thương.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#F5C07A',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                Tình yêu với thú cưng - Mỗi ngày là một hành trình mới để chăm sóc và bảo vệ các bé.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#F5C07A',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                Tương lai bền vững - Cùng nhau làm việc để xây dựng một thế giới tốt đẹp hơn cho thú cưng.
              </p>
            </div>
          </div>
        </div>

        {/* Pet Adoption Stories */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6B3A0F',
              marginBottom: '20px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            NHỮNG CHÚ BÉ ĐƯỢC CỨU HỘ
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                backgroundColor: '#E8D7A3',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <img
                src="https://via.placeholder.com/200x150" // Replace with actual pet image URL
                alt="Pet 1"
                style={{ width: '200px', height: '150px', marginBottom: '10px' }}
              />
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Cậu bé này 1 tuổi - Hiện tại đã được nhận nuôi tại Huế. Cậu bé này là một chiến binh mạnh mẽ vượt qua bệnh tật.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#E8D7A3',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <img
                src="https://via.placeholder.com/200x150" // Replace with actual pet image URL
                alt="Pet 2"
                style={{ width: '200px', height: '150px', marginBottom: '10px' }}
              />
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Cậu bé này 6 tháng - Hiện đang chờ nhận nuôi tại Đà Nẵng. Cậu bé này rất đáng yêu và năng động.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            backgroundColor: '#6B3A0F',
            color: '#FFF',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '20px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            VỚI CHÚNG MÌNH!
          </h2>
          <p
            style={{
              fontSize: '16px',
              maxWidth: '600px',
              margin: '0 auto 20px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            Cùng chung tay góp phần mang lại hy vọng và một cuộc sống tốt đẹp hơn cho các bé động vật. Hãy tham gia cùng chúng mình trong hành trình tuyệt vời này!
          </p>
          <button
            style={{
              backgroundColor: '#F5A623',
              color: '#FFF',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            ĐÓNG GÓP
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}