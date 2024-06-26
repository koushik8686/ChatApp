"use client";

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter()
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [style, setStyle] = useState({ display: "none", color: "green" });
  const [content, setContent] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/check-login', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // Check if response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.id) {
          router.push(`/user/${data.id.value}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error condition if needed
      }
    };

    fetchData();
  }, []);

  const handleRegisterClick = () => {
    setIsLoginActive(false);
  };

  const handleLoginClick = () => {
    setIsLoginActive(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: signupName, email: signupEmail, password: signupPassword })
    });
    const data = await response.json();
    console.log(data);
    if (data.message === 'User created successfully') {
      setUsernameChecked(false);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setStyle({ display: "block", color: "green" });
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      credentials: 'include'
    });
    const data = await response.json();
    console.log(data);
    if (data.message === 'Success') {
      // Assuming `data.userID` contains the user ID you want to redirect to
      return router.push(`/user/${data.userID}`); // Change to absolute URL if necessary
    } else {
      setContent(data.message);
    }
  };

  const handleUsernameChange = async (e) => {
    const username = e.target.value;
    setSignupName(username);
    setUsernameChecked(true);
  
    if (username.length > 0) {
      const response = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      console.log(data);
      setUsernameAvailable(data.available);
    } else {
      setUsernameAvailable(true);
    }
  };
  

  return (
    <div className={styles.body}>
    <div className={`${styles.container} ${isLoginActive ? '' : styles.active}`} id="container">
      <div className={`${styles['form-container']} ${styles['sign-up']}`}>
        <form className={`${styles.form}`}  onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Username"
            value={signupName}
            onChange={handleUsernameChange}
          />
          {usernameChecked && (
            <span style={{ color: usernameAvailable ? 'green' : 'red' }}>
              {usernameAvailable ? 'Username is available' : 'Username is taken'}
            </span>
          )}
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <p style={style}>Account Created Successfully</p>
          <button type="submit" disabled={!usernameAvailable}>Sign Up</button>
        </form>
      </div>
      <div className={`${styles['form-container']} ${styles['sign-in']}`}>
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <p style={{ color: "red" }}>{content}</p>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className={styles['toggle-container']}>
        <div className={styles.toggle}>
          <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className={styles.hidden} id="login" onClick={handleLoginClick}>Sign In</button>
          </div>
          <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className={styles.hidden} id="register" onClick={handleRegisterClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
