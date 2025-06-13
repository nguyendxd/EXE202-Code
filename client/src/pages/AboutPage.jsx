import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import pawLogo from '../assets/paw-logo.png'; // Ensure this image exists in assets
import Loading from '../components/Loading';

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

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
              Pawmily là dự án cho môn học Khởi nghiệp do team 117 của Đại học FPT HCM thực hiện.

              Pawmily - website hỗ trợ các bạn trong việc tìm kiếm trạm cứu hộ, thú y gần bạn bằng tích hợp bản đồ. Ngoài ra, Pawmily còn đóng vai trò là nền tảng kết nối chủ nuôi, trạm cứu hộ và shelter trong việc nhận nuôi các bé chó mèo hoang.
            </p>
          </div>
          <img
            src="https://images.pexels.com/photos/1963622/pexels-photo-1963622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual team image URL
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
                  src="https://images.pexels.com/photos/5998829/pexels-photo-5998829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual image URL
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
                  src="https://images.pexels.com/photos/5998829/pexels-photo-5998829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual image URL
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
                  src="https://images.pexels.com/photos/5998829/pexels-photo-5998829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual image URL
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
                  src="https://images.pexels.com/photos/31404259/pexels-photo-31404259/free-photo-of-c-n-c-nh-m-t-chu-meo-nha-th-gian-trong-nha.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual pet image URL
                  alt="Pet 1 Before"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
                <img
                  src="https://images.pexels.com/photos/31108762/pexels-photo-31108762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual pet image URL
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
                  src="https://images.pexels.com/photos/31216021/pexels-photo-31216021/free-photo-of-c-n-c-nh-chu-meo-g-ng-th-gian-v-i-doi-m-t-xanh-la-cay.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual pet image URL
                  alt="Pet 2 Before"
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
                <img
                  src="https://images.pexels.com/photos/8882601/pexels-photo-8882601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace with actual pet image URL
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
            backgroundImage: 'url("https://images.pexels.com/photos/15364527/pexels-photo-15364527/free-photo-of-thu-v-t-d-ng-v-t-con-v-t-loai-v-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            borderRadius: '10px',
            padding: '100px 20px',
            marginBottom: '40px',
            color: '#FFF',
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              margin: '0 auto',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-10px)'
              }
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '20px',
                fontFamily: '"Varela Round", sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              VÌ SAO CHỌN PAWMILY
            </h2>
            <p
              style={{
                fontSize: '20px',
                fontFamily: '"Varela Round", sans-serif',
                marginBottom: '30px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Chúng mình luôn nỗ lực để yêu thương động vật: các tình nguyện viên, chuyên gia đều có lòng nhân ái và sẵn sàng giúp đỡ. Đưa bạn tới gần hơn với các bé động vật hoang dã, để bạn hiểu và yêu thương các bé, cùng chung tay giúp đỡ chúng mình nhé!
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '40px',
                fontSize: '16px',
                fontFamily: '"Varela Round", sans-serif',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                📧 <a href="mailto:chungminh@pawmily.com" style={{ color: '#FFF', textDecoration: 'none', transition: 'color 0.3s ease', ':hover': { color: '#F5A623' } }}>Liên Hệ Chúng Mình:  pawmily@gmail.com</a>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '50px' }}>
                📞 <a href="tel:1900xxxx" style={{ color: '#FFF', textDecoration: 'none', transition: 'color 0.3s ease', ':hover': { color: '#F5A623' } }}>1900xxxx</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}