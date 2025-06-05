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

        {/* Who We Are Section */}
        <div
          style={{
            backgroundColor: '#FFF',
            color: '#6B3A0F',
            padding: '20px',
            marginBottom: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '500px', textAlign: 'left' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '10px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              CHÚNG MÌNH LÀ AI?
            </h2>
            <p
              style={{
                fontSize: '16px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              Tới Pawmily, chúng mình tin rằng mọi động vật đều xứng đáng được yêu thương và chăm sóc. Với tình yêu và sự tận tâm, chúng mình đã và đang cố gắng mang đến một cuộc sống tốt đẹp hơn cho các bé động vật hoang dã và bị bỏ rơi. Cùng chúng mình lan tỏa tình yêu thương, để thế giới của các bé thêm hạnh phúc!
            </p>
          </div>
          <img
            src="https://via.placeholder.com/400x200" // Replace with actual team image URL
            alt="Team Photo"
            style={{ width: '400px', height: '200px', borderRadius: '10px' }}
          />
        </div>

        {/* Pawmily Up Section */}
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
            PAWMILY LÀ GÌ?
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
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  margin: '0 auto 10px',
                }}
              >
                {/* Placeholder for circular image */}
                <img
                  src="https://via.placeholder.com/100" // Replace with actual image URL
                  alt="Icon 1"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                }}
              >
                Hỗ trợ nhận nuôi các bé không nhà
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Gặp gỡ bạn thân mới tại trung tâm nhận nuôi của chúng mình.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#F5C07A',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  margin: '0 auto 10px',
                }}
              >
                <img
                  src="https://via.placeholder.com/100" // Replace with actual image URL
                  alt="Icon 2"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                }}
              >
                Trao gửi khám chữa bệnh và yêu thương
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Hỗ trợ bác sĩ và các bé có hoàn cảnh đặc biệt.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#F5C07A',
                width: '250px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  margin: '0 auto 10px',
                }}
              >
                <img
                  src="https://via.placeholder.com/100" // Replace with actual image URL
                  alt="Icon 3"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                }}
              >
                Kết nối cộng đồng yêu thú cưng
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Tham gia tri ân, quyên góp và các sự kiện của chúng mình.
              </p>
            </div>
          </div>
        </div>

        {/* Pet Adoption Stories */}
        <div style={{ marginBottom: '40px', backgroundColor: '#E8D7A3', padding: '20px', borderRadius: '10px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6B3A0F',
              marginBottom: '20px',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            NHỮNG CÂU CHUYỆN CỦA PAWMILY
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
                backgroundColor: '#FFF',
                width: '300px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                }}
              >
                Cậu bé 1 tuổi
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <img
                  src="https://via.placeholder.com/100x100" // Replace with actual pet image URL
                  alt="Pet 1 Before"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
                <img
                  src="https://via.placeholder.com/100x100" // Replace with actual pet image URL
                  alt="Pet 1 After"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
              </div>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                The need of travelers has made Sinh Cafe feel that it is necessary to introduce travelers its friendly culture, its people with its friendly instinct. Sinh Cafe hospitality suggest who has provided travelers with travel and transport to ease their travel!
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#FFF',
                width: '300px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                }}
              >
                Cậu bé 6 tháng
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <img
                  src="https://via.placeholder.com/100x100" // Replace with actual pet image URL
                  alt="Pet 2 Before"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
                <img
                  src="https://via.placeholder.com/100x100" // Replace with actual pet image URL
                  alt="Pet 2 After"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
              </div>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                The need of travelers has made Sinh Cafe feel that it is necessary to introduce travelers its friendly culture, its people with its friendly instinct. Sinh Cafe hospitality suggest who has provided travelers with travel and transport to ease their travel!
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Pawmily Section */}
        <div
          style={{
            position: 'relative',
            backgroundImage: 'url("https://via.placeholder.com/1200x400")', // Replace with actual background image URL
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            padding: '40px 20px',
            marginBottom: '40px',
            color: '#FFF',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for readability
              borderRadius: '10px',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '20px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              VÌ SAO CHỌN PAWMILY
            </h2>
            <p
              style={{
                fontSize: '16px',
                fontFamily: '"Varela Round", sans-serif',
                marginBottom: '20px',
              }}
            >
              Chúng mình luôn nỗ lực để yêu thương động vật: các tình nguyện viên, chuyên gia đều có lòng nhân ái và sẵn sàng giúp đỡ. Đưa bạn tới gần hơn với các bé động vật hoang dã, để bạn hiểu và yêu thương các bé, cùng chung tay giúp đỡ chúng mình nhé!
            </p>
            <button
              style={{
                backgroundColor: '#FFF',
                color: '#6B3A0F',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontFamily: '"Varela Round", sans-serif',
                cursor: 'pointer',
              }}
            >
              Đọc thêm
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
                fontSize: '14px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                📧 <a href="mailto:chungminh@pawmily.com" style={{ color: '#FFF', textDecoration: 'none' }}>chungminh@pawmily.com</a>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                📞 <a href="tel:1900xxxx" style={{ color: '#FFF', textDecoration: 'none' }}>1900xxxx</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}