import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
    borderRadius: '1.5rem',
    border: '2px solid #d29d49',
    overflow: 'hidden',
    maxWidth: '20rem',
    width: '100%',
    height: '28rem',
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
    height: 'auto',
    objectFit: 'cover',
    maxHeight: '200px',
    '@media (max-width: 640px)': {
        maxHeight: '160px',
    },
};

const bottomSectionStyle = {
    backgroundColor: '#f7e2b8',
    padding: '1rem',
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

export default function PetCard({ pet }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/pet/${pet.name}`);
    };

    return (
        <>
            <style>
                {`
                    .pet-card {
                        transition: transform 0.3s ease;
                        cursor: pointer;
                    }
                    .pet-card:hover {
                        transform: scale(1.05);
                    }
                `}
            </style>
            <div className="pet-card" style={cardStyle} onClick={handleClick}>
                <div style={topSectionStyle}>
                    <img
                        src={pet.image}
                        alt={`A ${pet.breed} named ${pet.name}`}
                        style={imageStyle}
                    />
                </div>
                <div style={bottomSectionStyle}>
                    <p style={boldText}>{pet.name}</p>
                    <p>Tuổi: {pet.age}</p>
                    <p>Giới tính: {pet.gender}</p>
                    <p>Giống: {pet.breed}</p>
                    <p>Tình trạng: {pet.status}</p>
                    <p>Nơi ở: {pet.location}</p>
                </div>
            </div>
        </>
    );
}