import { mockBooks } from '../data/mockBooks';
import BookCard from './BookCard';
import '../styles/css/listings.css';

function RecentListings() {
    return (
        <section className="recent-listings">
            <div className="listings-header">
                <div className="listings-title">
                    <h2>Recent Listings</h2>
                    <span className="results-badge">8 results</span>
                </div>

                <a href="#" className="view-all">
                    View all →
                </a>
            </div>

            <div className="listings-grid">
                {mockBooks.map((book) => (
                    <BookCard key={book.id} {...book} />
                ))}
            </div>
        </section>
    );
}

export default RecentListings;