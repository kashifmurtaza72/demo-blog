import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useState, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signoutFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from 'react-router-dom'
export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  //console.log(currentUser);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        // error sect
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...FormData, profilePicture: downloadURL });
          setImageFileUploading(null);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserSuccess(null);
    setUpdateUserFailure(null);
    if (imageFileUploading) {
      setUpdateUserFailure("Please wait, An image is uploading...");
      return;
    }

    if (Object.keys(formData).length === 0) {
      setUpdateUserFailure("No changes were made");
      return;
    }

    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(updateFailure(data.message));
    } else {
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User updated successfully");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }

    } catch (error) {
      dispatch(deleteUserFailure("Failed to delete user. Please try again later."))

    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST"
      })
      const data = await res.json();

      if (!res.ok) {
        dispatch(signoutFailure(data.message))
      } else {
        dispatch(signoutSuccess(data))
      }

    } catch (error) {
      dispatch(signoutFailure("Failed to sign out. Please try again later."))

    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center text-3xl my-7 font-semibold">
        User Profile Detail
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                    })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            className="rounded-full w-full border-8 border-[lightgray]"
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="Emial"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="**************"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" disabled={loading || imageFileUploading} outline>{loading ? 'Loading' : 'Update'}
        </Button>

      </form>
      {currentUser.isAdmin && (
        <Link to={"/create-post"}>
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            className="w-full mt-3"
          >
            Create a Post
          </Button>
        </Link>
      )}

      <div className="flex justify-between text-red-700 mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>Sign Out</span>
      </div>
      {updateUserFailure && (
        <Alert color="failure" className="mt-5">
          {updateUserFailure}
        </Alert>
      )}

      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <h3>Are you sure, You want to delete your account</h3>
              <div className="flex justify-center gap-4 mt-5">
                <Button onClick={handleDeleteUser}>Yes, I am Sure</Button>
                <Button onClick={() => setShowModal(false)}>No, Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </div>
  );
}
