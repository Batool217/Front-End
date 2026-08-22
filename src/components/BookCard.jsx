import "../styles/css/card.css";

function BookCard({ id, title, image, tag, onClick }) {
    return (
        <div className="book-card" onClick={() => onClick(id)}>
            <div className="book-image-wrapper">
                {tag && <span className="book-tag">{tag}</span>}

                <img
                    src={image}
                    alt={title}
                    className="book-image"
                />
            </div>

            <div className="book-info">
                <h3 className="book-title">{title}</h3>
            </div>
        </div>
    );
}

export default BookCard;