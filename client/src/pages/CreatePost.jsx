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
import { useNavigate } from "react-router-dom";
export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()


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
    e.preventDefault()

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }
      
    } catch (error) {
      setPublishError("Failed to publish post")
      console.log(error)
      
    }

  }

  return (
    <div className="min-h-screen mx-auto max-w-3xl">
      <h1 className="text-center font-bold my-7">Create a POST</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextInput type="text" placeholder="Title" required id="title" onChange={(e)=>setFormData({...formData, title : e.target.value})}/>

        <Select onChange={(e)=>setFormData({...formData, category : e.target.value})}>
          <option value="uncategorized">Select a Category</option>
          <option value="javascript">Javascript</option>
          <option value="react">React</option>
          <option value="Nodejs">NodeJS</option>
        </Select>

        <div className="flex justify-between items-center border-4 rounded border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && 
        <Alert color='failure'>
          {imageUploadError}
        </Alert>
        
        }

        {formData.image && 
          <img src={formData.image} alt="uploaded-image" className="object-contain"/>
        }         

        <ReactQuill theme="snow" className="h-52 mb-12" onChange={(value)=>setFormData({...formData, content : value})}/>
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}
