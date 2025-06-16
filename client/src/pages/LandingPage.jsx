import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingpageimage from '../assets/landingpageimage.png';
import chungminhlaaisection from '../assets/chungminhlaaisection.jpg';
import { getAllPets } from '../services/petService';
import qrCode from '../assets/QRcode.png';

const images = [
    'https://images.pexels.com/photos/46024/pexels-photo-46024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/6821106/pexels-photo-6821106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/20816519/pexels-photo-20816519/free-photo-of-cho-ng-i-v-t-nuoi-con-meo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3071628/pexels-photo-3071628.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [hoveredArrow, setHoveredArrow] = useState(null);
    const [hoveredDot, setHoveredDot] = useState(null);
    const [hoveredButtons, setHoveredButtons] = useState({});
    const [hoveredCards, setHoveredCards] = useState({});
    const [featuredPets, setFeaturedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedPets = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAllPets();
                let petArray = [];
                if (Array.isArray(res.data.data)) {
                    petArray = res.data.data;
                } else if (res.data.data && typeof res.data.data === 'object') {
                    petArray = [res.data.data];
                }
                // Format dữ liệu thú cưng
                const formattedPets = petArray.map(pet => ({
                    _id: pet._id || `temp-id-${Math.random()}`,
                    name: pet.name || 'Chưa có tên',
                    age: pet.age || 'Chưa xác định',
                    gender: pet.gender || 'Chưa xác định',
                    breed: pet.breed || 'Chưa xác định',
                    status: pet.temperament || pet.healthStatus?.join(', ') || 'Chưa xác định',
                    location: pet.address || 'Chưa xác định',
                    images: pet.images || [],

                }));
                // Lấy 5 thú cưng đầu tiên
                setFeaturedPets(formattedPets.slice(0, 5));
            } catch (err) {
                console.error("Lỗi khi fetch thú cưng:", err);
                setError('Không thể tải danh sách thú cưng');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPets();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);
        return () => clearInterval(interval);
    }, [current]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrent(index);
    };

    const pets = [{
        name: 'Bong', age: '2 years', desc: 'A gentle cat who loves cuddles and quiet evenings.', img: 'https://via.placeholder.com/300x200?text=Bong+Cat'
    }, {
        name: 'Nekku', age: '3 years', desc: 'A one-eyed corgi with a big heart and playful spirit.', img: 'https://via.placeholder.com/300x200?text=Nekku+Corgi'
    }, {
        name: 'Momo', age: '1 year', desc: 'A curious kitten ready to explore a new home.', img: 'https://via.placeholder.com/300x200?text=Momo+Kitten'
    }];

    const stories = [{
        name: 'Luna', story: 'Rescued from the streets, Luna now enjoys a cozy home with her new family.', img: 'https://images.pexels.com/photos/31404259/pexels-photo-31404259/free-photo-of-c-n-c-nh-m-t-chu-meo-nha-th-gian-trong-nha.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }, {
        name: 'Max', story: 'Once abandoned, Max is now a loyal companion to a loving couple.', img: 'https://images.pexels.com/photos/8882601/pexels-photo-8882601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }];

    const arrowStyle = (side) => ({
        position: 'absolute',
        top: '50%',
        [side]: '20px',
        transform: 'translateY(-50%)',
        backgroundColor: hoveredArrow === side ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
        color: 'white',
        border: 'none',
        width: '40px', // Fixed width for circular shape
        height: '40px', // Fixed height for circular shape
        borderRadius: '50%', // Ensures circular shape
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px', // Slightly smaller font for better fit
        cursor: 'pointer',
        boxShadow: hoveredArrow === side ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    });

    const dotStyle = (idx) => ({
        height: '12px',
        width: '12px',
        borderRadius: '50%',
        backgroundColor: current === idx ? '#fff' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        display: 'inline-block',
        opacity: hoveredDot === idx ? 1 : (current === idx ? 1 : 0.6),
        transform: hoveredDot === idx ? 'scale(1.4)' : 'scale(1)',
        transition: 'all 0.3s ease'
    });

    const mainButtonStyle = (type, hovered) => ({
        backgroundColor: type === 'adopt' ? (hovered ? '#c69447' : '#D7A86E') : (hovered ? '#855f30' : '#A47148'),
        color: 'white',
        padding: '15px 30px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.3s ease'
    });

    const cardStyle = (hovered) => ({
        backgroundColor: '#FFF8E7',
        borderRadius: '10px',
        boxShadow: hovered ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
        width: '300px',
        padding: '20px',
        textAlign: 'left',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
    });

    const cardButtonStyle = (hovered) => ({
        backgroundColor: '#D7A86E',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.3s ease'
    });

    const handleAdoptClick = () => {
        navigate('/adopt');
    };

    const handleAboutClick = () => {
        navigate('/about');
    };

    const handleDonateClick = () => {
        navigate('/donate');
    };

    const handlePetDetailClick = (pet) => {
        navigate(`/pets/${pet._id}`);
    };

    return (
        <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#FAF3E0' }}>

            {/* Carousel */}
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Slide ${idx}`}
                        style={{
                            width: '100%',
                            height: '800px',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: '0',
                            opacity: idx === current ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out'
                        }}
                    />
                ))}

                <button
                    onClick={prevSlide}
                    style={arrowStyle('left')}
                    onMouseEnter={() => setHoveredArrow('left')}
                    onMouseLeave={() => setHoveredArrow(null)}
                >
                    ❮
                </button>

                <button
                    onClick={nextSlide}
                    style={arrowStyle('right')}
                    onMouseEnter={() => setHoveredArrow('right')}
                    onMouseLeave={() => setHoveredArrow(null)}
                >
                    ❯
                </button>

                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            onMouseEnter={() => setHoveredDot(idx)}
                            onMouseLeave={() => setHoveredDot(null)}
                            style={dotStyle(idx)}
                        />
                    ))}
                </div>
            </div>

            <section style={{
                padding: '10px 0 0',
                backgroundColor: '#FFF8E7',
                textAlign: 'center',
                color: '#5D4037',
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '28px', color: '#A47148', marginBottom: '20px' }}>
                        Cứu một bé nhỏ, nhận cả bầu trời yêu thương!
                    </h2>
                    <p style={{ fontSize: '18px', marginBottom: '40px' }}>
                        Một lần cứu hộ – Một đời tri kỷ!
                    </p>
                </div>
                <div>
                    <img
                        src={landingpageimage}
                        alt="Pet Adoption"
                        style={{
                            maxWidth: '800px',
                            width: '100%',
                            margin: '0',
                        }}
                    />
                </div>
            </section>
            <section
                style={{
                    backgroundImage: 'url("https://cdn.pixabay.com/photo/2022/10/25/04/55/cat-7544821_1280.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed', // Cố định hình nền khi cuộn
                    padding: '70px 20px',
                    textAlign: 'center',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    position: 'relative', // Đảm bảo section không bị ảnh hưởng bởi các thuộc tính khác
                    minHeight: '200px', // Đảm bảo kích thước section được giữ nguyên
                    boxSizing: 'border-box', // Đảm bảo padding không làm thay đổi kích thước tổng thể
                }}
            >
                <h1 style={{ fontSize: '40px', margin: 0 }}>Cùng tìm kiếm bé thú cưng của bạn</h1>
                <p style={{ fontSize: '22px', maxWidth: '700px', margin: '20px auto' }}>
                    Những bé thú cưng đáng yêu cần được sự quan tâm và chăm sóc
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {['adopt', 'donate'].map((type, idx) => (
                        <button
                            key={type}
                            style={mainButtonStyle(type, hoveredButtons[idx])}
                            onMouseEnter={() => setHoveredButtons(prev => ({ ...prev, [idx]: true }))}
                            onMouseLeave={() => setHoveredButtons(prev => ({ ...prev, [idx]: false }))}
                            onClick={type === 'adopt' ? handleAdoptClick : handleDonateClick}
                        >
                            {type === 'adopt' ? 'Nhận nuôi' : 'Quyên góp'}
                        </button>
                    ))}
                </div>
            </section>

            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFF5E1' }}>
                <div
                    className="about-section"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        backgroundColor: '#CEA689',
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')} // Scale up on hover
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Reset scale on leave
                >
                    <div style={{ maxWidth: '450px', textAlign: 'center', flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '30px', color: '#552F0F', marginBottom: '20px' }}>
                            Chúng mình là ai?
                        </h2>
                        <p style={{ fontSize: '18px', margin: '0 0 40px 0' }}>
                            Pawmily là dự án cho môn học Khởi nghiệp do team 117 của Đại học FPT HCM thực hiện. <br />
                            <br />

                            Pawmily - website hỗ trợ các bạn trong việc tìm kiếm trạm cứu hộ, thú y gần bạn bằng tích hợp bản đồ. Ngoài ra, Pawmily còn đóng vai trò là nền tảng kết nối chủ nuôi, trạm cứu hộ và shelter trong việc nhận nuôi các bé chó mèo hoang.
                        </p>
                        <button
                            style={mainButtonStyle('about', hoveredButtons['about'])}
                            onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, about: true }))}
                            onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, about: false }))}
                            onClick={handleAboutClick}
                        >
                            Về chúng tớ
                        </button>
                    </div>

                    {/* Hình ảnh */}
                    <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
                        <img
                            src={chungminhlaaisection} // Thay bằng đường dẫn ảnh thực tế
                            alt="Pawmily Team"
                            style={{
                                width: '100%',
                                maxWidth: 'none', // Loại bỏ giới hạn maxWidth để hình to sát viền
                                height: '100%',
                                borderRadius: '10px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Featured Pets */}
            <section style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Thú cưng đang cần nhà</h2>
                {loading ? (
                    <div style={{ padding: '20px' }}>Đang tải danh sách thú cưng...</div>
                ) : error ? (
                    <div style={{ padding: '20px', color: 'red' }}>{error}</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 10px',
                    }}>
                        {featuredPets.map((pet, index) => (
                            <div
                                key={pet._id}
                                style={{
                                    ...cardStyle(hoveredCards[`pet${index}`]),
                                    width: '100%',
                                    maxWidth: '220px',
                                    margin: '0 auto',
                                    minHeight: '350px', // Đảm bảo chiều cao tối thiểu
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                    padding: '16px',
                                }}
                                onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [`pet${index}`]: true }))}
                                onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [`pet${index}`]: false }))}
                            >
                                <img
                                    src={pet.images?.[0] || 'https://via.placeholder.com/220x160?text=No+Image'}
                                    alt={pet.name}
                                    style={{
                                        width: '100%',
                                        height: '160px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginBottom: '10px',
                                        background: '#eee',
                                    }}
                                />
                                <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontSize: '20px', margin: '8px 0', color: '#6D4C41', textAlign: 'center' }}>
                                        {pet.name}, {pet.age} tuổi
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#5D4037', marginBottom: '10px', textAlign: 'center' }}>
                                        <p style={{ margin: '4px 0' }}>Giới tính: {pet.gender}</p>
                                        <p style={{ margin: '4px 0' }}>Giống: {pet.breed}</p>
                                        <p style={{ margin: '4px 0' }}>Nơi ở: {pet.location}</p>

                                    </div>
                                </div>
                                <button
                                    style={cardButtonStyle(hoveredCards[`btnPet${index}`])}
                                    onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [`btnPet${index}`]: true }))}
                                    onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [`btnPet${index}`]: false }))}
                                    onClick={() => handlePetDetailClick(pet)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ marginTop: '30px' }}>
                    <button
                        style={{
                            backgroundColor: '#A47140',
                            color: 'white',
                            padding: '12px 30px',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            ':hover': {
                                backgroundColor: '#8B5E3C',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#8B5E3C';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#A47148';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => navigate('/adopt')}
                    >
                        Xem thêm thú cưng
                    </button>
                </div>
                <style>
                    {`
            @media (min-width: 1280px) {
                section > div {
                    grid-template-columns: repeat(5, 1fr);
                }
            }
            @media (min-width: 768px) and (max-width: 1279px) {
                section > div {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            @media (min-width: 480px) and (max-width: 767px) {
                section > div {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (max-width: 479px) {
                section > div {
                    grid-template-columns: 1fr;
                }
            }
            @media (max-width: 900px) {
                .about-section {
                    flex-direction: column !important;
                    padding: 16px !important;
                }
                .about-section > div {
                    max-width: 100% !important;
                }
            }
        `}
                </style>
            </section>

            {/* Success Stories */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFF5E1' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Những câu chuyện ở Pawmily</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            style={cardStyle(hoveredCards[`story${index}`])}
                            onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [`story${index}`]: true }))}
                            onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [`story${index}`]: false }))}
                        >
                            <img src={story.img} alt={story.name} style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', height: '180px', maxHeight: '180px' }} />
                            <h3 style={{ fontSize: '22px', margin: '10px 0', color: '#6D4C41' }}>{story.name}</h3>
                            <p style={{ fontSize: '16px', color: '#5D4037' }}>{story.story}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Chatbot Invitation Section */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F5E8C7' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Bạn đang có khó khăn nhận nuôi thú cưng?</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '100px',
                    maxWidth: '1200px',
                    margin: '50px auto',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', color: '#5D4037', fontSize: '18px' }}>
                        <p style={{ fontSize: '19px' }}>Danh sách vật dụng cần thiết cho người nhận nuôi mới</p>
                        <p style={{ fontSize: '16px' }}>Giúp quá trình nhận nuôi trở nên suôn sẻ nhất có thể.</p>
                    </div>
                    <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', color: '#5D4037', fontSize: '18px' }}>
                        <p style={{ fontSize: '19px' }}>Các câu hỏi thường gặp về việc nhận nuôi thú cưng</p>
                        <p style={{ fontSize: '16px' }}>Những câu trả lời cho tất cả những thắc mắc của bạn khi nhận nuôi thú cưng.</p>
                    </div>
                    <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', color: '#5D4037', fontSize: '18px' }}>
                        <p style={{ fontSize: '19px' }}>Trang bị kiến thức cho việc nhận nuôi thú cưng</p>
                        <p style={{ fontSize: '16px' }}>Những kiến thức cần thiết cho việc nuôi thú cưng lần đầu.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '80px' }}>
                    <p style={{ fontSize: '22px', color: '#5D4037', margin: '0' }}>
                        Bạn còn nhiều thắc mắc khác?
                    </p>
                    <button
                        style={mainButtonStyle('chat', hoveredButtons[2])}
                        onMouseEnter={() => setHoveredButtons(prev => ({ ...prev, [2]: true }))}
                        onMouseLeave={() => setHoveredButtons(prev => ({ ...prev, [2]: false }))}
                    >
                        Tìm câu trả lời ở FAQ
                    </button>
                </div>
            </section>


            {/* Donation QR Code Section */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#C8A484' }}>
                <h2 style={{ fontSize: '30px', color: '#fff4e1' }}>Hỗ trợ chúng tôi donate theo cách của bạn!</h2>
                <div style={{ maxWidth: '300px', margin: '20px auto' }}>
                    <img
                        src={qrCode}
                        alt="Donation QR Code"
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </div>
                <p style={{ fontSize: '18px', color: '#5D4037', alignItems: 'center', padding: '1.5em' }}>
                    <strong>Techcombank - 1907 4447 2290 18 - Nguyen Bao Chau</strong><br />
                    <br />
                    Mỗi đóng góp của bạn, dù nhỏ, đều là nguồn động viên to lớn với chúng mình! <br />
                    <br />
                    Chúng mình cam kết sử dụng 100% số tiền quyên góp để duy trì website và chăm sóc, cứu trợ những bé động vật kém may mắn.
                </p>

            </section>
        </div >
    );
}