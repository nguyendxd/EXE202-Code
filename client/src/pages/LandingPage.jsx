import React, { useEffect, useState } from 'react';
import landingpageimage from '../assets/landingpageimage.png';

const images = [
    'https://via.placeholder.com/1200x500?text=Pet+1',
    'https://via.placeholder.com/1200x500?text=Pet+2',
    'https://via.placeholder.com/1200x500?text=Pet+3',
    'https://via.placeholder.com/1200x500?text=Pet+4',
    'https://via.placeholder.com/1200x500?text=Pet+5'
];

export default function LandingPage() {
    const [current, setCurrent] = useState(0);
    const [hoveredArrow, setHoveredArrow] = useState(null);
    const [hoveredDot, setHoveredDot] = useState(null);
    const [hoveredButtons, setHoveredButtons] = useState({});
    const [hoveredCards, setHoveredCards] = useState({});

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
        name: 'Luna', story: 'Rescued from the streets, Luna now enjoys a cozy home with her new family.', img: 'https://via.placeholder.com/300x200?text=Luna'
    }, {
        name: 'Max', story: 'Once abandoned, Max is now a loyal companion to a loving couple.', img: 'https://via.placeholder.com/300x200?text=Max'
    }];

    const arrowStyle = (side) => ({
        position: 'absolute',
        top: '50%',
        [side]: '20px',
        transform: 'translateY(-50%)',
        backgroundColor: hoveredArrow === side ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
        color: 'white',
        border: 'none',
        padding: '10px',
        fontSize: '24px',
        cursor: 'pointer',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease'
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

    return (
        <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#FAF3E0' }}>

            {/* Carousel */}
            <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Slide ${idx}`}
                        style={{
                            width: '100%',
                            height: '500px',
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
                padding: '60px 0 0',
                backgroundColor: '#FFF8E7',
                textAlign: 'center',
                color: '#5D4037',
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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

            {/* Hero Section */}
            <section style={{
                backgroundImage: 'url("https://via.placeholder.com/1200x500?text=Happy+Pets")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '120px 20px',
                textAlign: 'center',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
                <h1 style={{ fontSize: '40px', margin: 0 }}>Find Your Furry Friend</h1>
                <p style={{ fontSize: '22px', maxWidth: '700px', margin: '20px auto' }}>
                    Hanoi Pet Adoption rescues stray and abandoned animals, giving them a second chance at a loving home.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {['adopt', 'donate'].map((type, idx) => (
                        <button
                            key={type}
                            style={mainButtonStyle(type, hoveredButtons[idx])}
                            onMouseEnter={() => setHoveredButtons(prev => ({ ...prev, [idx]: true }))}
                            onMouseLeave={() => setHoveredButtons(prev => ({ ...prev, [idx]: false }))}
                        >
                            {type === 'adopt' ? 'Adopt Now' : 'Donate'}
                        </button>
                    ))}
                </div>
            </section>

            {/* Mission Statement */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFF5E1' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Who We Are</h2>
                <p style={{ maxWidth: '800px', margin: '20px auto', fontSize: '18px' }}>
                    Hanoi Pet Adoption is a no-kill shelter dedicated to rescuing stray and abandoned cats and dogs. We provide medical care, shelter, and love while finding them forever homes. Our mission is to promote responsible pet ownership and reduce animal suffering in Hanoi.
                </p>
            </section>

            {/* Featured Pets */}
            <section style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Adoptable Pets</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {pets.map((pet, index) => (
                        <div
                            key={index}
                            style={cardStyle(hoveredCards[`pet${index}`])}
                            onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [`pet${index}`]: true }))}
                            onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [`pet${index}`]: false }))}
                        >
                            <img src={pet.img} alt={pet.name} style={{ width: '100%', borderRadius: '10px' }} />
                            <h3 style={{ fontSize: '22px', margin: '10px 0', color: '#6D4C41' }}>{pet.name}, {pet.age}</h3>
                            <p style={{ fontSize: '16px', color: '#5D4037' }}>{pet.desc}</p>
                            <button
                                style={cardButtonStyle(hoveredCards[`btnPet${index}`])}
                                onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [`btnPet${index}`]: true }))}
                                onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [`btnPet${index}`]: false }))}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Success Stories */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFF5E1' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Success Stories</h2>
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
                            <img src={story.img} alt={story.name} style={{ width: '100%', borderRadius: '10px' }} />
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
                    margin: '20px auto',
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
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

            {/* Location Map Section */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#D7B99A' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Bản đồ</h2>
                <p style={{ maxWidth: '800px', margin: '20px auto', fontSize: '18px' }}>
                    Cửa hàng của chúng tôi nằm tại địa chỉ: FPT University HCM Campus
                </p>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <img
                        src="https://via.placeholder.com/800x400?text=Map+of+HPT+Vietnam+FPT+University+HCM+Campus"
                        alt="Map to HPT Vietnam FPT University HCM Campus"
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </div>
            </section>

            {/* Donation QR Code Section */}
            <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#C8A484' }}>
                <h2 style={{ fontSize: '30px', color: '#A47148' }}>Hỗ trợ chúng tôi donate theo cách của bạn!</h2>
                <div style={{ maxWidth: '300px', margin: '20px auto' }}>
                    <img
                        src="https://via.placeholder.com/200x200?text=QR+Code+for+Donation"
                        alt="Donation QR Code"
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </div>
                <p style={{ fontSize: '16px', color: '#5D4037' }}>
                    Pawmily - Petbank: 0354698035<br />
                    Memo: 0123456799<br />
                    Chúng tôi rất biết ơn nếu bạn donate số tiền dù là nhỏ!
                </p>
            </section>
        </div>
    );
}