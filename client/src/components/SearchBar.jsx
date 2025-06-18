import "../styles/index.css";
import { useEffect } from "react";
import { searchPets } from "../services/petService";

export default function SearchBar({ search, setSearch, filter, setFilter, onSearchResults }) {
    const sharedInputStyle = {
        padding: "10px",
        borderRadius: "20px",
        border: "1px solid #D3C8A5",
        backgroundColor: "#F5E9C9",
        color: "#000",
        outline: "none",
        boxShadow: "none",
    };

    const selectStyle = {
        padding: "10px",
        paddingRight: "30px", // extra space for arrow
        width: "150px",
        borderRadius: "20px",
        border: "1px solid #D3C8A5",
        backgroundColor: "#F5E9C9",
        color: "#000",
        outline: "none",
        appearance: "none",         // for most browsers
        WebkitAppearance: "none",   // for Safari
        MozAppearance: "none",      // for Firefox
        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "16px",
    };


    const inputStyle = {
        ...sharedInputStyle,
        width: "200px",
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = async () => {
        try {
            const searchParams = {
                name: search,
                breed: filter.loai,
                gender: filter.gioiTinh === "Male" ? "male" : filter.gioiTinh === "Female" ? "female" : "",
                color: filter.mauSac,
                address: filter.viTri,
                age: filter.doTuoi,
                status: filter.tinhTrang
            };

            // Nếu chọn đúng 'Chó' hoặc 'Mèo' thì fetch riêng, nếu không thì fetch tất cả
            if (filter.loai === "Chó" || filter.loai === "Mèo") {
                searchParams.breed = filter.loai;
            } else {
                searchParams.breed = "";
            }

            // Xử lý độ tuổi
            if (filter.doTuoi) {
                switch (filter.doTuoi) {
                    case "Dưới 1 tuổi":
                        searchParams.age = "Dưới 1 tuổi";
                        break;
                    case "1-3 tuổi":
                        searchParams.age = "1-3 tuổi";
                        break;
                    case "3-5 tuổi":
                        searchParams.age = "3-5 tuổi";
                        break;
                    case "Trên 5 tuổi":
                        searchParams.age = "Trên 5 tuổi";
                        break;
                    default:
                        searchParams.age = "";
                }
            }

            // Xử lý giới tính
            if (filter.gioiTinh) {
                searchParams.gender = filter.gioiTinh === "Male" ? "male" : "female";
            }

            const response = await searchPets(searchParams);
            if (response.data.success) {
                onSearchResults(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        }
    };

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line
    }, [search, filter]);

    return (
        <div>
            {/* Ô tìm kiếm */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={inputStyle}
                />
            </div>

            {/* Bộ lọc dropdown */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                <select
                    value={filter.loai || ""}
                    onChange={(e) => setFilter({ ...filter, loai: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả loài</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                </select>

                <select
                    value={filter.gioiTinh || ""}
                    onChange={(e) => setFilter({ ...filter, gioiTinh: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả giới tính</option>
                    <option value="Male">Đực</option>
                    <option value="Female">Cái</option>
                </select>


                <select
                    value={filter.tinhTrang || ""}
                    onChange={(e) => setFilter({ ...filter, tinhTrang: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả tình trạng</option>
                    <option value="Khỏe mạnh">Khỏe mạnh</option>
                    <option value="Đã tiêm phòng">Đã tiêm phòng</option>
                    <option value="Đã triệt sản">Đã triệt sản</option>
                    <option value="Khuyết tật">Khuyết tật</option>
                </select>

                <select
                    value={filter.mauSac || ""}
                    onChange={(e) => setFilter({ ...filter, mauSac: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả màu lông</option>
                    <option value="Đen">Đen</option>
                    <option value="Trắng">Trắng</option>
                    <option value="Nâu">Nâu</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Xám">Xám</option>
                    <option value="Đốm">Đốm</option>
                </select>

                <select
                    value={filter.viTri || ""}
                    onChange={(e) => setFilter({ ...filter, viTri: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả vị trí</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Quận 4">Quận 4</option>
                    <option value="Quận 5">Quận 5</option>
                    <option value="Quận 6">Quận 6</option>
                    <option value="Quận 7">Quận 7</option>
                    <option value="Quận 8">Quận 8</option>
                    <option value="Quận 9">Quận 9</option>
                    <option value="Quận 10">Quận 10</option>
                    <option value="Quận 11">Quận 11</option>
                    <option value="Quận 12">Quận 12</option>
                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                    <option value="Quận Gò Vấp">Quận Gò Vấp</option>
                    <option value="Quận Phú Nhuận">Quận Phú Nhuận</option>
                    <option value="Quận Tân Bình">Quận Tân Bình</option>
                    <option value="Quận Tân Phú">Quận Tân Phú</option>
                    <option value="Quận Thủ Đức">Quận Thủ Đức</option>
                </select>

                <select
                    value={filter.doTuoi || ""}
                    onChange={(e) => setFilter({ ...filter, doTuoi: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tất cả độ tuổi</option>
                    <option value="Dưới 1 tuổi">Dưới 1 tuổi</option>
                    <option value="1-3 tuổi">1-3 tuổi</option>
                    <option value="3-5 tuổi">3-5 tuổi</option>
                    <option value="Trên 5 tuổi">Trên 5 tuổi</option>
                </select>
            </div>
        </div>
    );
}
