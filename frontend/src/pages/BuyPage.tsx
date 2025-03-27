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
      <>
        <h2>Buy: <u><strong>{title}</strong></u></h2>
        <br/>
        <h3>${price}</h3>
        <br/>
        <div>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(x) => setQuantity(Number(x.target.value))} // Setting quantity based on user input
            />
          </label>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
        <br/>
        <button onClick={() => navigate('/books')}>Go Back</button>
      </>
    );
  }
  
  export default BuyPage;
  
