import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations'; 
import Auth from '../utils/auth';
 

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Define the LOGIN_USER mutation
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Define the form variable by accessing event.currentTarget
    const form = event.currentTarget;
  
    if (!form.checkValidity()) {
      // If the form is invalid, return without submitting
      return;
    }
  
    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });
  
      Auth.login(data.login.token);
  
      // Clear validation state and error message on successful login
      setValidated(false);
      setShowAlert(false);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  
    setUserFormData({ email: '', password: '' });
    setValidated(true);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong with your login credentials!
        </Alert>
        
        {/* Display error message if error exists */}
        {error && <Alert variant="danger">{error.message}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
