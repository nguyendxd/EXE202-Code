import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import pawLogo from '../assets/paw-logo.png'; // Ensure this image exists in assets
import Loading from '../components/Loading';
import { useLocation } from 'react-router-dom';

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll tới đúng mục nếu có hash
  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, location]);

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
            fontSize: '26px',
            fontWeight: '600',
            color: '#F5A623',
            marginBottom: '30px',
            fontFamily: '"Varela Round", sans-serif',
          }}
        >
          VỀ CHÚNG MÌNH
        </h1>


        {/* Who We Are Section */}
        <div
          id="ve-pawmily"
          style={{
            backgroundColor: '#fff',
            border: '2px solid #FFF5E1',
            borderRadius: '20px',
            padding: '40px 30px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            boxShadow: '0 2px 12px rgba(245,166,35,0.07)',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 280, maxWidth: 500, textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '18px',
                fontFamily: '"Varela Round", sans-serif',
                color: '#6B3A0F',
                textAlign: 'center',
              }}
            >
              CHÚNG MÌNH LÀ AI?
            </h2>
            <p
              style={{
                fontSize: '16px',
                fontFamily: '"Varela Round", sans-serif',
                color: '#6B3A0F',
                lineHeight: 1.7,
                textAlign: 'center',
                padding: '0 10px',
              }}
            >
              Pawmily là dự án cho môn học Khởi nghiệp do team 117 của Đại học FPT HCM thực hiện.<br /><br />
              Pawmily - website hỗ trợ các bạn trong việc tìm kiếm trạm cứu hộ, thú y gần bạn bằng tích hợp bản đồ. Ngoài ra, Pawmily còn đóng vai trò là nền tảng kết nối chủ nuôi, trạm cứu hộ và shelter trong việc nhận nuôi các bé chó mèo hoang.
            </p>
          </div>
          <img
            src={pawLogo}
            alt="Chó mèo trong dấu chân"
            style={{
              width: '230px',
              height: 'auto',
              borderRadius: '16px',
              objectFit: 'contain',
              background: '#fff',
              display: 'block',
              margin: '0 auto',

            }}
          />
        </div>

        {/* Pawmily Up Section */}
        <div id="su-menh-tam-nhin-gia-tri" style={{ marginBottom: '40px' }}>
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
              id="su-menh"
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
                  src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Icon 1"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', background: '#fff', display: 'block', margin: '0 auto' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                  marginTop: '32px',
                }}
              >
                Sứ mệnh:
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Là cầu nối của cộng đồng những người yêu động vật nhằm cứu trợ, chăm sóc và tìm mái ấm cho chó mèo hoang. Đồng thời nâng cao nhận thức và trách nhiệm với bảo vệ động vật.

              </p>
            </div>
            <div
              id="tam-nhin"
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
                  src="https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Icon 2"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', background: '#fff', display: 'block', margin: '0 auto' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                  marginTop: '32px',
                }}
              >
                Tầm nhìn:
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Chúng mình sẽ là website đầu tiên và tốt nhất xây dựng được cộng đồng yêu thương và bảo vệ động vật, để mọi  bé chó mèo hoang có cho mình một mái ấm riêng cùng tình yêu thương trọn đời.
              </p>
            </div>
            <div
              id="gia-tri-cot-loi"
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
                  src="https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Icon 3"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', background: '#fff', display: 'block', margin: '0 auto' }}
                />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Varela Round", sans-serif',
                  marginTop: '32px',
                }}
              >
                Giá trị cốt lõi:
              </h3>
              <p style={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                Trắc ẩn <br />
                <br />
                Cộng đồng <br />
                <br />
                Trách nhiệm <br />
                <br />
                Minh bạch
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
              gap: '32px',
              flexWrap: 'wrap',
              marginTop: '32px'
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(164,113,72,0.10)',
                padding: '28px 20px',
                width: '340px',
                transition: 'box-shadow 0.3s, transform 0.3s',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(164,113,72,0.18)';
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(164,113,72,0.10)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                <img
                  src="https://images.pexels.com/photos/31404259/pexels-photo-31404259/free-photo-of-c-n-c-nh-m-t-chu-meo-nha-th-gian-trong-nha.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Trước"
                  style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #E5C299' }}
                />
                <img
                  src="https://images.pexels.com/photos/31108762/pexels-photo-31108762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Sau"
                  style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #E5C299' }}
                />
              </div>
              <h3 style={{ color: '#A47148', fontSize: '20px', fontWeight: 700, margin: '10px 0 8px 0' }}>🐱 Bé Miu – "Từ đống rác đến chiếc giường êm"</h3>
              <p style={{ color: '#5D4037', fontSize: '15px', fontFamily: '"Varela Round", sans-serif', margin: 0, textAlign: 'center' }}>
                Miu được tìm thấy trong cơn mưa, lấm lem, yếu ớt nằm co ro bên đống rác. Sau nhiều ngày điều trị và chăm sóc, bé đã dần khỏe lại, mắt sáng hơn, ăn ngon miệng và biết kêu "meo" mỗi khi được gọi tên. Giờ đây, Miu nằm ngủ yên bình bên khung cửa sổ ngập nắng – nơi bắt đầu cuộc sống mới.

              </p>
            </div>
            {/* Card 2 */}
            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(164,113,72,0.10)',
                padding: '28px 20px',
                width: '340px',
                transition: 'box-shadow 0.3s, transform 0.3s',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(164,113,72,0.18)';
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(164,113,72,0.10)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                <img
                  src="https://images.pexels.com/photos/31216021/pexels-photo-31216021/free-photo-of-c-n-c-nh-chu-meo-g-ng-th-gian-v-i-doi-m-t-xanh-la-cay.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Trước"
                  style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #E5C299' }}
                />
                <img
                  src="https://images.pexels.com/photos/8882601/pexels-photo-8882601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Sau"
                  style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #E5C299' }}
                />
              </div>
              <h3 style={{ color: '#A47148', fontSize: '20px', fontWeight: 700, margin: '10px 0 8px 0' }}>🐾 Bé Xám – "Chú mèo chiến binh nhỏ"</h3>
              <p style={{ color: '#5D4037', fontSize: '15px', fontFamily: '"Varela Round", sans-serif', margin: 0, textAlign: 'center' }}>
                Xám bị gãy chân do tai nạn, nằm run rẩy dưới gầm xe. Ai cũng nghĩ bé không qua nổi. Nhưng sau phẫu thuật và nhiều tuần phục hồi, Xám đã đi lại được, dù hơi khập khiễng. Giờ bé là "anh cả" trong nhà chung, luôn đón các bạn mèo mới bằng những cái dụi đầu đầy thân thương.
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
              {/* Đã chuyển liên hệ xuống footer */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}