import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);

  const {loading, error:errorMessage} = useSelector((state) => state.user)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (event) => {
    //console.log(event.target.value);
    setFormData({ ...formData, [event.target.id]: event.target.value });
    //console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if( !formData.email  || !formData.password) {
      //return setErrorMessage("Please enter all fields data")
      return dispatch(signInFailure("Please enter all fields data"))
    }
    //console.log(formData);

    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart())
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        //setLoading(false);
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard?tab=profile");
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
      // setLoading(false);
      // setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row">
        {/* left part */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold  dark:text-white"
          >
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              M Ali Blog
            </span>
          </Link>
          <p className="mt-5">
            This is a 1st demo project. You can signin with email and password
            or using with Google account
          </p>
        </div>
        {/* right part */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
           

            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="email"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" outline type="submit" disabled={loading}>
            {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}

            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have not an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure" >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
