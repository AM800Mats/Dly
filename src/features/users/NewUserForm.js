import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [usernameNewUser, setUsernameNewUser] = useState('')
    const [validusernameNewUser, setValidusernameNewUser] = useState(false)
    const [passwordNewUser, setPasswordNewUser] = useState('')
    const [validpasswordNewUser, setValidpasswordNewUser] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    useEffect(() => {
        setValidusernameNewUser(USER_REGEX.test(usernameNewUser))
    }, [usernameNewUser])

    useEffect(() => {
        setValidpasswordNewUser(PWD_REGEX.test(passwordNewUser))
    }, [passwordNewUser])

    useEffect(() => {
        if (isSuccess) {
            setUsernameNewUser('')
            setPasswordNewUser('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameNewUserChanged = e => setUsernameNewUser(e.target.value)
    const onPasswordNewUserChanged = e => setPasswordNewUser(e.target.value)


    const canSave = [roles.length, validusernameNewUser, validpasswordNewUser].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ usernameNewUser, passwordNewUser, roles })
        }
    }



    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validusernameNewUser ? 'form__input--incomplete' : ''
    const validPwdClass = !validpasswordNewUser ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <button className="form__submit-button">Sign In</button>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={usernameNewUser}
                    onChange={onUsernameNewUserChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={passwordNewUser}
                    onChange={onPasswordNewUserChanged}
                />
            </form>
        </>
    )

    return content
}
export default NewUserForm