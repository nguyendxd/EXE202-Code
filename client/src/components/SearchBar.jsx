import "../styles/index.css";

export default function SearchBar({ search, setSearch, filter, setFilter }) {
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
                    value={filter.loai}
                    onChange={(e) => setFilter({ ...filter, loai: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Loài thú nuôi</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                </select>

                <select
                    value={filter.gioiTinh}
                    onChange={(e) => setFilter({ ...filter, gioiTinh: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Giới tính</option>
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                </select>

                <select
                    value={filter.mauSac}
                    onChange={(e) => setFilter({ ...filter, mauSac: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Màu sắc</option>
                    <option value="Nâu">Nâu</option>
                    <option value="Đen">Đen</option>
                    <option value="Trắng">Trắng</option>
                </select>

                <select
                    value={filter.tinhTrang}
                    onChange={(e) => setFilter({ ...filter, tinhTrang: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Tình trạng</option>
                    <option value="Khỏe mạnh">Khỏe mạnh</option>
                    <option value="Đã tiêm phòng">Đã tiêm phòng</option>
                    <option value="Đã triệt sản">Đã triệt sản</option>
                    <option value="Khuyết tật">Khuyết tật</option>
                </select>

                <select
                    value={filter.viTri}
                    onChange={(e) => setFilter({ ...filter, viTri: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Vị trí</option>
                    <option value="Quận Thủ Đức">Quận Thủ Đức</option>
                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                    <option value="Quận Gò Vấp">Quận Gò Vấp</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="Quận 3">Quận 3</option>
                </select>

                <select
                    value={filter.doTuoi}
                    onChange={(e) => setFilter({ ...filter, doTuoi: e.target.value })}
                    style={selectStyle}
                >
                    <option value="">Độ tuổi</option>
                    <option value="Dưới 6 tháng">Dưới 6 tháng</option>
                    <option value="Trên 6 tháng">Trên 6 tháng</option>
                </select>
            </div>
        </div>
    );
}
