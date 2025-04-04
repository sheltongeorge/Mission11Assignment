import { useState, useEffect } from 'react';
import { Book } from '../types/Book'; // Importing the type definition for Book, which defines the structure of book data
import { useNavigate } from 'react-router-dom'; // Importing the navigation hook from React Router to handle page redirects

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // State variables to hold book data, pagination details, and user settings
  const [books, setBooks] = useState<Book[]>([]); // Stores the list of books fetched from the API
  const [pageSize, setPageSize] = useState<number>(10); // Determines the number of books displayed per page
  const [pageNum, setPageNum] = useState<number>(1); // Tracks the current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Holds the total number of books retrieved from the API
  const [totalPages, setTotalPages] = useState<number>(0); // Calculates the total pages based on the number of items and page size
  const navigate = useNavigate(); // React Router hook for navigation to other pages

  useEffect(() => {
    // Fetch books whenever page size, page number, or selected categories change
    const fetchBooks = async () => {
      // Dynamically generate query parameters for selected categories
      const categoryParams = selectedCategories
        .map((cat) => `bookCategory=${encodeURIComponent(cat)}`)
        .join('&');

      // Build the API URL with pagination and filtering parameters
      const response = await fetch(
        `https://bookproject-shelton-backend-fjfyhnbsffhtd2cw.eastus-01.azurewebsites.net/books/allbooks?pageSize=${pageSize}&pageNum=${pageNum}${
          selectedCategories.length ? `&${categoryParams}` : ''
        }`,
        {
          credentials: 'include', // Ensures cookies are included in the request for authentication
        }
      );

      // Parse the JSON response and update state variables
      const data = await response.json();
      setBooks(data.books); // Update the list of books with the API response
      setTotalItems(data.totalNumBooks); // Update the total number of books available
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculate the total pages required for pagination
    };

    fetchBooks(); // Invoke the API call
  }, [pageSize, pageNum, selectedCategories]); // Dependencies: Re-fetch data whenever these values change

  return (
    <div>
      {/* Main grid layout for displaying books */}
      <div
        className={`row ${books.length === 1 || books.length === 2 ? 'justify-content-center' : 'g-4'}`}
      >
        {books.map((b) => (
          // Responsive grid layout for books with conditional column sizes
          <div
            className={`${
              books.length === 1 ? 'col-md-8' : books.length === 2 ? 'col-md-6' : 'col-md-4'
            }`}
            key={b.bookId} // Ensure each item has a unique key for efficient rendering
          >
            {/* Individual book card */}
            <div className="card h-100">
              <div className="card-body">
                {/* Book title and subtitle */}
                <h5 className="card-title">{b.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Author: {b.author}
                </h6>
                {/* List of book details */}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Publisher: </strong>
                    {b.publisher}
                  </li>
                  <li className="list-group-item">
                    <strong>ISBN: </strong>
                    {b.isbn}
                  </li>
                  <li className="list-group-item">
                    <strong>Category: </strong>
                    {b.category}
                  </li>
                  <li className="list-group-item">
                    <strong>Page Count: </strong>
                    {b.pageCount}
                  </li>
                  <li className="list-group-item">
                    <strong>Price: </strong>${b.price}
                  </li>
                </ul>
                {/* Button for navigating to the Buy page */}
                <div className="mt-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/buy/${b.title}/${b.price}/${b.bookId}`)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>
              Previous
            </button>
          </li>
          {/* Dynamically render page numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <li className={`page-item ${pageNum === i + 1 ? 'active' : ''}`} key={i + 1}>
              <button className="page-link" onClick={() => setPageNum(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Dropdown for changing results per page */}
      <div className="mt-4 text-center">
        <label>
          Results per page:
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value)); // Update page size
              setPageNum(1); // Reset to the first page
            }}
            className="form-select d-inline-block w-auto ms-2" // Bootstrap styles for compact dropdown
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default BookList;
