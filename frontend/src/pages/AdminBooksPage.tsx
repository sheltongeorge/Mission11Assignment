// frontend/src/pages/AdminBooksPage.tsx

import { useEffect, useState } from 'react';
import { Book } from '../types/Book';

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const fetchBooks = async () => {
    const res = await fetch(
      'https://localhost:5000/Books/AllBooks?pageSize=1000',
      {
        credentials: 'include',
      }
    );
    const data = await res.json();
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Book
  ) => {
    if (editingBook) {
      setEditingBook({ ...editingBook, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    await fetch(
      `https://localhost:5000/Books/UpdateBook/${editingBook?.bookId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBook),
      }
    );
    setEditingBook(null);
    fetchBooks();
  };

  const handleDelete = async (bookId: number) => {
    await fetch(`https://localhost:5000/Books/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });
    fetchBooks();
  };

  const handleAddBook = async () => {
    await fetch('https://localhost:5000/Books/AddBook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    setNewBook({
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      classification: '',
      category: '',
      pageCount: 0,
      price: 0,
    });
    fetchBooks();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin: Manage Books</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingBook?.bookId === book.bookId ? (
              <tr key={book.bookId}>
                {(
                  [
                    'title',
                    'author',
                    'publisher',
                    'isbn',
                    'classification',
                    'category',
                  ] as const
                ).map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      className="form-control"
                      value={(editingBook as any)[field]}
                      onChange={(e) => handleInputChange(e, field)}
                    />
                  </td>
                ))}
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={editingBook.pageCount}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        pageCount: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={editingBook.price}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingBook(null)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setEditingBook(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.bookId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
          <tr>
            {(
              [
                'title',
                'author',
                'publisher',
                'isbn',
                'classification',
                'category',
              ] as const
            ).map((field) => (
              <td key={field}>
                <input
                  type="text"
                  className="form-control"
                  value={(newBook as any)[field] || ''}
                  onChange={(e) =>
                    setNewBook({ ...newBook, [field]: e.target.value })
                  }
                />
              </td>
            ))}
            <td>
              <input
                type="number"
                className="form-control"
                value={newBook.pageCount}
                onChange={(e) =>
                  setNewBook({ ...newBook, pageCount: Number(e.target.value) })
                }
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: Number(e.target.value) })
                }
              />
            </td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddBook}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooksPage;
