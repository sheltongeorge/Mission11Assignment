import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate total price
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center"><u><strong>Your Cart</strong></u></h2>
      <div className="table-responsive">
        {cart.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item: CartItem) => (   // for loop getting info from the cart items
                <tr key={item.bookId}>
                  <td>{item.title}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="text-end mt-4">
        <h3>
          <span className="me-2">{totalQuantity} items</span>|
          <span className="ms-2">Total: ${totalPrice.toFixed(2)}</span>
        </h3>
      </div>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-success">Checkout</button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/books')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default CartPage;
