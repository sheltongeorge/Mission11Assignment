using AmazonBookProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AmazonBookProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {

        private BooksDbContext _booksContext;
        public BooksController(BooksDbContext temp)
        {
            _booksContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(
            int pageSize = 10,
            int pageNum = 1,
            bool sortByTitle = false,
            [FromQuery] string[] bookCategory = null // Accept categories as query parameters
        )
        {
            var query = _booksContext.Books.AsQueryable();

            // Apply category filtering if categories are provided
            if (bookCategory != null && bookCategory.Length > 0)
            {
                query = query.Where(b => bookCategory.Contains(b.Category));
            }

            // Apply sorting by title if requested
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            // Apply pagination logic
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = query.Count(); // Use filtered query for accurate count

            var response = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _booksContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book book)
        {
            _booksContext.Books.Add(book);
            _booksContext.SaveChanges();
            return Ok(book);
        }

        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            var book = _booksContext.Books.FirstOrDefault(b => b.BookId == id);
            if (book == null) return NotFound();

            // Update each field
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Publisher = updatedBook.Publisher;
            book.ISBN = updatedBook.ISBN;
            book.Classification = updatedBook.Classification;
            book.Category = updatedBook.Category;
            book.PageCount = updatedBook.PageCount;
            book.Price = updatedBook.Price;

            _booksContext.SaveChanges();
            return Ok(book);
        }

        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _booksContext.Books.FirstOrDefault(b => b.BookId == id);
            if (book == null) return NotFound();

            _booksContext.Books.Remove(book);
            _booksContext.SaveChanges();
            return Ok();
        }
        
    }
}
