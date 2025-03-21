import './App.css'
import CookieConsent from 'react-cookie-consent';
import BookList from './BookList'
import Fingerprint from './Fingerprint';

function App() {

  return (
    <>
      <BookList/>
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent> 
      <Fingerprint/>
    </>
  )
}

export default App
