import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();
  
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate total price
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  
    return (
      <div>
        <h2><u><strong>Your Cart</strong></u></h2>
        <br />
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item: CartItem) => (
                <li key={item.bookId}>
                  {item.title}, Price: ${item.price}, Quantity: {item.quantity}, Subtotal: ${item.price * item.quantity}
                  <button onClick={() => removeFromCart(item.bookId)}>remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h3>{totalQuantity} items | Total: ${totalPrice.toFixed(2)}</h3>
        <br />
        <button>Checkout</button>
        <button onClick={() => navigate('/books')}>Continue Shopping</button>
      </div>
    );
  }

export default CartPage;
