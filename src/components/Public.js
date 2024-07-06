import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { useAddNewUserMutation } from '../features/users/usersApiSlice';
import usePersist from '../hooks/usePersist';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const Public = () => {
  const userRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();
  const [roles, setRoles] = useState(['Employee']);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? 'errmsg' : 'offscreen';


  // Create new user section
  const [addNewUser, { isLoadingNewUser, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const [usernameNewUser, setUsernameNewUser] = useState('');
  const [validUsernameNewUser, setValidUsernameNewUser] = useState(false);
  const [passwordNewUser, setPasswordNewUser] = useState('');
  const [validPasswordNewUser, setValidPasswordNewUser] = useState(false);
  useEffect(() => {
    setValidUsernameNewUser(USER_REGEX.test(usernameNewUser));
  }, [usernameNewUser]);

  useEffect(() => {
    setValidPasswordNewUser(PWD_REGEX.test(passwordNewUser));
  }, [passwordNewUser]);



  const onUsernameNewUserChanged = (e) => setUsernameNewUser(e.target.value);
  const onPasswordNewUserChanged = (e) => setPasswordNewUser(e.target.value);

  const canSave =
    [roles.length, validUsernameNewUser, validPasswordNewUser].every(Boolean) &&
    !isLoadingNewUser;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username: usernameNewUser, password: passwordNewUser, roles })
      handleSubmitNewUser(e)
    }
  };

  const handleSubmitNewUser = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ usernameNewUser, passwordNewUser }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const validUserClass = !validUsernameNewUser ? 'form__input--incomplete' : '';
  const validPwdClass = !validPasswordNewUser ? 'form__input--incomplete' : '';

  const content = (
    <section className="public">
      <header>
        <h1 className='public-header'>Dailyle</h1>
      </header>
      <main className="public__main">
        <div className="public__image"></div>
        <div className="public__forms">
          <div className="login">
            <h2>Log In</h2>
            <p className={errClass} aria-live="assertive">{errMsg}</p>
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                className="form__input"
                type="text"
                id="username"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="off"
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                className="form__input"
                type="password"
                id="password"
                onChange={handlePwdInput}
                value={password}
                required
              />
              <button className="form__submit-button">Sign In</button>

              <label htmlFor="persist" className="form__persist">
                <input
                  type="checkbox"
                  className="form__checkbox"
                  id="persist"
                  onChange={handleToggle}
                  checked={persist}
                />
                Trust This Device
              </label>
            </form>
          </div>
          <p>or</p>
          <div className="signup">
            <h2>Sign Up</h2>
            <p className={errClass}>{error?.data?.message}</p>
            <form className="form" onSubmit={onSaveUserClicked}>
              <label className="form__label" htmlFor="username-new">
                Username: <span className="nowrap">[3-20 letters]</span>
              </label>
              <input
                className={`form__input ${validUserClass}`}
                id="username-new"
                name="username"
                type="text"
                autoComplete="off"
                value={usernameNewUser}
                onChange={onUsernameNewUserChanged}
              />

              <label className="form__label" htmlFor="password-new">
                Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
              </label>
              <input
                className={`form__input ${validPwdClass}`}
                id="password-new"
                name="password"
                type="password"
                autoComplete="off"
                value={passwordNewUser}
                onChange={onPasswordNewUserChanged}
              />
              <button className="form__submit-button" disabled={!canSave}>Sign Up</button>
            </form>
          </div>
        </div>
      </main>
    </section>
  );

  return content;
};


export default Public;
