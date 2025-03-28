import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { CartItem } from '../types/CartItem';

function BuyPage() {
  const navigate = useNavigate();
  const { title, price, bookId } = useParams(); // Capturing title, price, and bookId from route params
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1); // State for setting the quantity, default is 1

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId), // Converting bookId to a number
      title: title || 'No Title Found',
      quantity, // Adding quantity to the cart item
      price: Number(price), // Adding price to the cart item
    };
    addToCart(newItem);
    navigate('/cart'); // Redirecting to the cart page
  };

  return (
    <div className="container mt-4">
      <div className="card mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body text-center">
          <h2 className="card-title">Buy: <u><strong>{title}</strong></u></h2>
          <h3 className="text-success">${price}</h3>
          <form className="mt-4">
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(x) => setQuantity(Number(x.target.value))} // Setting quantity based on user input
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </form>
          <button
            className="btn btn-link mt-3"
            onClick={() => navigate('/books')}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyPage;
