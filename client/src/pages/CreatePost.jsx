import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DashSidebar from "../components/DashSidebar";
export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },

        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
//console.log(formData)
const handleSubmit = async(e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
      setPublishError(data.message)
      return;
    }
    if (res.ok) {
      setPublishError(null)
      navigate(`/post/${data._id}`)

    }
    
  } catch (error) {
    setPublishError("Failed to publish post");
    console.log(error);
    
  }

}
  return (
    <div className="min-h-screen max-w-xl mx-auto my-5 px-5">
      <h1 className="text-center text-3xl font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          placeholder="Title"
          id="title"
          type="text"
          required
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Select onChange={(e)=>setFormData({...formData, category: e.target.value})}>
          <option value="uncategorized">Select Category</option>
          <option value="javascript">Javascript</option>
          <option value="react">React</option>
          <option value="nextjs">NextJS</option>
        </Select>
        <div className="flex justify-between items-center border-4 border-teal-500 p-3 gap-4 rounded-lg">
          <FileInput
            accept="image/*"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
                <span className="text-gray-500">Uploading Image</span>
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded Image"
            className="w-full h-64 object-cover"
          />
        )}
        <ReactQuill theme="snow" className="h-72 mb-12"  onChange={(e)=>setFormData({...formData, content:e})} />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
