import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from './firbase.init';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
const auth = getAuth(app)
function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [validated, setValidated] = useState(false);
  const [registerd, setRegisterd] = useState(false);
  const [error, setError] = useState('');

  const handleUserName = (event) => {
    setUserName(event.target.value)
  }
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }
  const handlePassBlur = (event) => {
    setPassword(event.target.value);
  }
  const handleRegister = (event) => {
    setRegisterd(event.target.checked)
    // console.log(event);
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();

      return;
    }
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)) {
      setError('Please valid password')
      return;
    }
    setValidated(true);
    setError('')
    if (registerd) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .then(error => {
          console.error(error.message);
          setError(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setEmail('')
          setPassword('')
          verifyEmail()
          UpdateUserName()
          console.log(user);
        })
        .catch(error => {
          console.error(error)
          setError(error.message)
        })
    }


    event.preventDefault();
  }
  const UpdateUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: userName
    })
      .then(() => {
        console.log('name update');
      })
      .error(error => {
        setError(error.message)
      })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email sent');
      })

  }
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('sent request')
      })
  }
  return (
    <div >
      <div className="resigter">
        <Form noValidate validated={validated} onSubmit={handleFormSubmit} className="w-50 mt-3 mx-auto">
          <h2 className="text-primary">Please {registerd ? 'Login' : 'Register'}</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleUserName} type="text" placeholder="Enter Your Name" required />
            <Form.Text className="text-muted">
              Enter Your full name.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePassBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegister} type="checkbox" label="Already Registered" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={resetPassword} variant="link">Reset Password</Button><br />
          <Button variant="primary" type="submit">
            {registerd ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>

      {/* <form onSubmit={handleFormSubmit}>
        <input onBlur={handleEmailBlur} type="email" name="" id="" /> <br />

        <input onBlur={handlePassBlur} type="password" name="" id="" /><br />
        <input type="submit" value="Submit" />
      </form> */}

    </div>
  );
}

export default App;
