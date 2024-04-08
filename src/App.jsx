/*import React, { useState } from 'react';
import { Login, ForgotPassword, Register } from './LoginPage.jsx';
import { HomePage, AboutPage, Contact } from './Home.jsx';
import {Header, Footer} from './HAF.jsx';



function App() {
  const [currentForm, setCurrentForm] = useState('Home');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">
      {(currentForm!== 'Login' && currentForm !== 'Register' && currentForm !=='ForgotPassword')
       &&<Header onFormSwitch={toggleForm}/>}
      {currentForm === 'Home' ? (
        <HomePage onFormSwitch={toggleForm} />
      ) : currentForm === 'About' ? (
        <AboutPage onFormSwitch={toggleForm} />
      ) : currentForm === 'Contact' ? (
        <Contact onFormSwitch={toggleForm} />
      ) : currentForm === 'Login' ? (
        <Login onFormSwitch={toggleForm} />
      ) : currentForm === 'ForgotPassword' ? (
        <ForgotPassword onFormSwitch={toggleForm} />
      ) : currentForm === 'Register' ? (
        <Register onFormSwitch={toggleForm} />
      ) : null}
    </div>
  );
}

export default App;
*/
import React, { useState } from 'react';
import Cart from './cart.jsx';
import Menu from './Menu2.jsx';
function App() {
  const [currentForm, setCurrentForm] = useState('Menu');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return(<div className="menuPage">
    <Menu onFormSwitch = {toggleForm}/>
  </div>
  );
};
export default App;
