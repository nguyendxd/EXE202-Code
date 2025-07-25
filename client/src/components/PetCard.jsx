import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
    borderRadius: '1.5rem',
    border: '2px solid #d29d49',
    overflow: 'hidden',
    maxWidth: '20rem',
    width: '100%',
    height: '29rem',
    margin: 'auto',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fffdf9',
    '@media (max-width: 640px)': {
        maxWidth: '16rem',
    },
};

const topSectionStyle = {
    backgroundColor: '#fcebd4',
    padding: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
};

const imageStyle = {
    borderRadius: '1.25rem',
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    maxHeight: '200px',
    '@media (max-width: 640px)': {
        maxHeight: '160px',
    },
};

const bottomSectionStyle = {
    backgroundColor: '#f7e2b8',
    padding: '1rem',
    paddingBottom: '4rem',
    textAlign: 'center',
    color: '#4e2d14',
    fontSize: '0.9rem',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    lineHeight: '1',
    '@media (max-width: 640px)': {
        padding: '0.75rem',
        fontSize: '0.85rem',
    },
};

const boldText = {
    fontWeight: '700',
    fontSize: '1.1rem',
    marginBottom: '0.4rem',
    color: '#3a1f0f',
    '@media (max-width: 640px)': {
        fontSize: '1rem',
    },
};

export default function PetCard({ pet, showUpdate = false, onUpdate }) {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log('PetCard clicked:', pet._id, pet.name);
        console.log('Navigating to:', `/pets/${pet._id}`);
        navigate(`/pets/${pet._id}`);
    };

    console.log('PetCard rendering:', pet._id, pet.name);

    return (
        <>
            <style>
                {`
                    .pet-card {
                        transition: transform 0.3s ease;
                        cursor: pointer;
                        position: relative;
                    }
                    .pet-card:hover {
                        transform: scale(1.05);
                    }
                    .update-btn {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #fff;
                        border: 2px solid #E5C299;
                        border-radius: 50%;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 8px rgba(229,194,153,0.12);
                        cursor: pointer;
                        z-index: 2;
                        transition: background 0.2s;
                    }
                    .update-btn:hover {
                        background: #E5C299;
                    }
                `}
            </style>
            <div className="pet-card" style={cardStyle} onClick={handleClick}>
                <div style={{ ...topSectionStyle, position: 'relative' }}>
                    <img
                        src={pet?.image}
                        alt={`A ${pet.breed} named ${pet.name}`}
                        style={imageStyle}
                    />
                    {showUpdate && (
                        <button
                            className="update-btn"
                            type="button"
                            title="Cập nhật thông tin"
                            onClick={e => { e.stopPropagation(); onUpdate && onUpdate(pet); }}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.3 9.3-2.12.71.71-2.12 9.3-9.3zM3 17h14v2H3v-2z" fill="#A47148" />
                            </svg>
                        </button>
                    )}
                </div>
                <div style={bottomSectionStyle}>
                    <p style={boldText}>{pet.name}</p>
                    <p>Tuổi: {pet.age}</p>
                    <p>Giới tính: {pet.gender === 'male' ? 'Đực' : pet.gender === 'female' ? 'Cái' : pet.gender}</p>
                    <p>Màu lông: {pet.color}</p>
                    <p>Giống: {pet.breed}</p>
                    <p>Nơi ở: {pet.location}</p>
                </div>
            </div>
        </>
    );
}