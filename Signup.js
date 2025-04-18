import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.username) newErrors.username = 'Required';

    if (!formData.contact) {
      newErrors.contact = 'Required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Invalid contact number';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid Email';
    }

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and include letters, numbers, and special characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setMessage('User registered successfully');
          navigate('/login'); // Navigate to the login page using React Router
        } else {
          setMessage('Error registering user');
        }
      } catch (error) {
        setMessage('Error registering user');
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>
          <div className="full-width-input">
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="full-width-input">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="full-width-input">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <div className="submit-container">
            <input type="submit" value="Submit" />
          </div>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="signup-footer">
          <p>Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span></p> {/* Use navigate for login */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
