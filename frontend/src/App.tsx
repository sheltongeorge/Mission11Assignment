import './App.css';
// import CookieConsent from 'react-cookie-consent';
// import Fingerprint from './Fingerprint';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BuyPage from './pages/BuyPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route
                path="/buy/:title/:price/:bookId"
                element={<BuyPage />}
              />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>

      {/* <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <Fingerprint /> */}
    </>
  );
}

export default App;
