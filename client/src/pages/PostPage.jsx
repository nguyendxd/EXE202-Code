import React, { useState } from 'react';

const PostPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const pets = [
    { 
      id: 1, 
      name: 'Trại cún hồ mơ', 
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop', 
      age: '3 tháng', 
      breed: 'Border Collie', 
      location: 'Hà Nội', 
      gender: 'Đực', 
      health: 'Khỏe mạnh', 
      vaccinated: 'Đã được tiêm chủng',
      sterilized: 'Chưa triệt sản',
      description: 'Bé cún Trại cún hồ mơ mèo, 10/5 Bình Quới, Phường 28, Bình Thạnh, Hồ Chí Minh, Việt Nam',
      contact: '0912345678',
      story: 'Cần chuyến: The record travelers had made Sinh Cafe feel that it is necessary to introduce travelers to Vietnam country, its culture, its people with its friendly instinct and hospitality. Sinh Cafe was the first Saigon who has provided travelers with travel information and transport to ease their travel.'
    },
    { 
      id: 2, 
      name: 'pawmily', 
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', 
      age: '4 tháng', 
      breed: 'Border Collie', 
      location: 'Hồ Chí Minh', 
      gender: 'Cái', 
      health: 'Khỏe mạnh', 
      vaccinated: 'Đã được tiêm chủng',
      sterilized: 'Chưa triệt sản',
      description: 'Bé cún Trại cún hồ mơ mèo, 10/5 Bình Quới, Phường 28, Bình Thạnh, Hồ Chí Minh, Việt Nam',
      contact: '0912345678',
      story: 'Cần chuyến: The record travelers had made Sinh Cafe feel that it is necessary to introduce travelers to Vietnam country, its culture, its people with its friendly instinct and hospitality. Sinh Cafe was the first in Saigon who has provided travelers with travel information and transport to ease their travel.'
    },
    { 
      id: 3, 
      name: 'Trại cún hồ mơ', 
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop', 
      age: '5 tháng', 
      breed: 'Border Collie', 
      location: 'Đà Nẵng', 
      gender: 'Đực', 
      health: 'Khỏe mạnh', 
      vaccinated: 'Đã được tiêm chủng',
      sterilized: 'Chưa triệt sản',
      description: 'Bé cún Trại cún hồ mơ mèo, 10/5 Bình Quới, Phường 28, Bình Thạnh, Hồ Chí Minh, Việt Nam',
      contact: '0912345678',
      story: 'Cần chuyến: The record travelers had made Sinh Cafe feel that it is necessary to introduce travelers to Vietnam country, its culture, its people with its friendly instinct and hospitality. Sinh Cafe was the first in Saigon who has provided travelers with travel information and transport to ease their travel.'
    },
  ];

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [wishlistPosts, setWishlistPosts] = useState(new Set());

  const handleCreatePost = () => {
    alert('Chức năng tạo bài đăng đang được phát triển!');
  };

  const handleLike = (petId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(petId)) {
      newLikedPosts.delete(petId);
    } else {
      newLikedPosts.add(petId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleWishlist = (petId) => {
    const newWishlistPosts = new Set(wishlistPosts);
    if (newWishlistPosts.has(petId)) {
      newWishlistPosts.delete(petId);
    } else {
      newWishlistPosts.add(petId);
    }
    setWishlistPosts(newWishlistPosts);
  };

  const totalPosts = pets.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = pets.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6E3', fontFamily: '"Varela Round", Arial, sans-serif' }}>
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleCreatePost}
            className="px-6 py-2 text-sm font-medium text-amber-800 border border-amber-800 rounded-full hover:bg-amber-50 transition-colors"
          >
            Thêm bài đăng
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6 max-w-2xl">
          {currentPosts.map((pet) => (
            <div 
              key={pet.id} 
              className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm"
            >
              {/* Header with avatar and name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span className="font-medium text-amber-900">{pet.name}</span>
              </div>

              {/* Content */}
              <div className="flex gap-4">
                {/* Pet Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                </div>

                {/* Pet Details */}
                <div className="flex-1 text-sm text-amber-800">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-3">
                    <div>
                      <p><span className="font-medium">Tuổi:</span> {pet.age}</p>
                      <p><span className="font-medium">Giống:</span> {pet.breed}</p>
                      <p><span className="font-medium">Tình trạng sức khỏe:</span></p>
                      <p className="ml-4">• {pet.health}</p>
                      <p className="ml-4">• {pet.vaccinated}</p>
                      <p className="ml-4">• {pet.sterilized}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Giới tính:</span> {pet.gender}</p>
                      <p><span className="font-medium">Cần chăm sóc:</span> {pet.location}</p>
                      <p><span className="font-medium">Tình trạng khẩn cấp:</span></p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs">{pet.description}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs">Số liên hệ: {pet.contact}</p>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Câu chuyện:</p>
                    <p className="text-xs leading-relaxed">{pet.story}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-amber-200">
                <button 
                  onClick={() => handleLike(pet.id)}
                  className={`flex items-center gap-1 text-sm ${
                    likedPosts.has(pet.id) ? 'text-red-500' : 'text-amber-700'
                  } hover:text-red-500 transition-colors`}
                >
                  <svg className="w-4 h-4" fill={likedPosts.has(pet.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Thích
                </button>

                <button 
                  onClick={() => handleWishlist(pet.id)}
                  className={`flex items-center gap-1 text-sm ${
                    wishlistPosts.has(pet.id) ? 'text-yellow-600' : 'text-amber-700'
                  } hover:text-yellow-600 transition-colors`}
                >
                  <svg className="w-4 h-4" fill={wishlistPosts.has(pet.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Wishlist
                </button>

                <button className="ml-auto px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-full transition-colors">
                  Thông tin
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  currentPage === index + 1
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
