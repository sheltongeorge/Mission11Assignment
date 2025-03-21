import { useState, useEffect } from 'react';
import { Book } from './types/Book';

function BookList() {
  // State variables to store books, pagination, and sorting options
  const [books, setBooks] = useState<Book[]>([]); // List of books
  const [pageSize, setPageSize] = useState<number>(10); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books
  const [totalPages, setTotalPages] = useState<number>(0); // Total pages based on available books
  const [sortByTitle, setSortByTitle] = useState<boolean>(false); // Sorting toggle for book titles

  // Fetch books when component mounts or when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortByTitle=${sortByTitle}`,
        {
          credentials: 'include', // Include cookies for authentication
        }
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortByTitle]); // Dependencies trigger re-fetch when changed

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Book Collection</h1>

      {/* Sorting Toggle */}
      <div className="mb-3">
        <label className="form-label me-2">Sort by Title:</label>
        <input
          type="checkbox"
          checked={sortByTitle}
          onChange={() => {
            setSortByTitle(!sortByTitle);
            setPageNum(1); // Reset to first page when sorting changes
          }}
          className="form-check-input"
        />
      </div>

      {/* Books List (Vertical Layout) */}
      <div className="row">
        {books.map((b) => (
          <div className="col-12 mb-4" key={b.bookId}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">by {b.author}</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Publisher:</strong> {b.publisher}
                  </li>
                  <li className="list-group-item">
                    <strong>ISBN:</strong> {b.isbn}
                  </li>
                  <li className="list-group-item">
                    <strong>Classification:</strong> {b.classification}
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong> {b.category}
                  </li>
                  <li className="list-group-item">
                    <strong>Page Count:</strong> {b.pageCount}
                  </li>
                  <li className="list-group-item">
                    <strong>Price:</strong> ${b.price}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center my-4">
        {/* Previous Page Button */}
        <button
          className="btn btn-primary me-2"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`btn ${pageNum === i + 1 ? 'btn-secondary' : 'btn-outline-primary'} mx-1`}
            onClick={() => setPageNum(i + 1)}
            disabled={pageNum === i + 1}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          className="btn btn-primary ms-2"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      {/* Page Size Selection */}
      <div className="text-center">
        <label className="me-2">Results per page:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageNum(1); // Reset to first page when changing page size
          }}
          className="form-select w-auto d-inline-block"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
