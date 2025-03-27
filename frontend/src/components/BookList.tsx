import { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategory=${encodeURIComponent(cat)}`)
        .join('&');
      // This iterates through selected categories to build the query string for filtering.

      const response = await fetch(
        `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${
          selectedCategories.length ? `&${categoryParams}` : ''
        }`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();
      setBooks(data.books); // The books returned by the server API
      setTotalItems(data.totalNumBooks); // Total number of books from API response
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculate total pages
    };

    fetchBooks();
  }, [pageSize, pageNum, selectedCategories]); // Dependencies trigger re-fetch when changed

  return (
    <>
      {books.map((b) => (
        <div id="bookCard" className="card" key={b.bookId}>
          <h3>{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author: </strong>
                {b.author}
              </li>
              <li>
                <strong>Publisher: </strong>
                {b.publisher}
              </li>
              <li>
                <strong>ISBN: </strong>
                {b.isbn}
              </li>
              <li>
                <strong>Category: </strong>
                {b.category}
              </li>
              <li>
                <strong>Page Count: </strong>
                {b.pageCount}
              </li>
              <li>
                <strong>Price: </strong>${b.price}
              </li>
            </ul>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/buy/${b.title}/${b.price}/${b.bookId}`)} // Navigation to buy page
            >
              Buy
            </button>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setPageNum(i + 1)}
          disabled={pageNum === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageNum(1); // Reset to first page on page size change
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
