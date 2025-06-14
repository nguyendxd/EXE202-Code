export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
    const getDisplayedPages = () => {
        const pages = [];
        const maxVisiblePages = 5; // Max number of page buttons (including ellipsis)
        const sidePages = 2; // Number of pages to show before and after current page

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than or equal to maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Add first page
            pages.push(1);
            let start = Math.max(2, currentPage - sidePages);
            let end = Math.min(totalPages - 1, currentPage + sidePages);

            // Adjust if near the start or end
            if (currentPage - sidePages <= 2) {
                end = Math.min(4, totalPages - 1);
            }
            if (currentPage + sidePages >= totalPages - 1) {
                start = Math.max(2, totalPages - 3);
            }

            // Add ellipsis if needed
            if (start > 2) {
                pages.push("…");
            }

            // Add pages around current page
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push("…");
            }

            // Add last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", padding: "10px 0", background: 'transparent' }}>
            <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                style={{
                    ...buttonStyle,
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {"<"}
            </button>
            {getDisplayedPages().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    style={{
                        ...buttonStyle,
                        borderRadius: page === "…" ? "15px" : "50%",
                        width: page === "…" ? "40px" : "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: currentPage === page ? "#F5A623" : "#FFF",
                        color: currentPage === page ? "#FFF" : "#5C4033",
                        cursor: typeof page === "number" ? "pointer" : "default",
                    }}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                style={{
                    ...buttonStyle,
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {">"}
            </button>
        </div>
    );
}

const buttonStyle = {
    margin: "0 5px",
    backgroundColor: "#FFF",
    border: "1px solid #D3C8A5",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
};