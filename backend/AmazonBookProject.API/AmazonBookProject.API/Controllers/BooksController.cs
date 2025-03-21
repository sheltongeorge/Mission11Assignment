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
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, bool sortByTitle = false) // the three values being passed into by the request
        {
            string? favProjType = Request.Cookies["FavoriteProjectType"];  // creating a cookie
            Console.WriteLine("~~~~~COOKIE~~~~~\n" + favProjType);

            HttpContext.Response.Cookies.Append("FavoriteProjectType", "Borehole Well and Hand Pump", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(1),
            }); //configuring the cookie

            var query = _booksContext.Books.AsQueryable();

            if (sortByTitle) // this is the order by statement that we will apply if sorByTital is True
            {
                query = query.OrderBy(b => b.Title);
            }

            var books = query // setting up the pagination logic
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _booksContext.Books.Count(); 

            var response = new // We are returning 2 fields in the json, this is how it is configured
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }
    }
}
