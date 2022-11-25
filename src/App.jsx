import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const uploadfiles = async (file) => {
  if (!file) throw new Error("No hay archivos");

  const cloudUrl = "https://api.cloudinary.com/v1_1/ddsb37kfa/upload";
  const formData = new FormData();
  formData.append("upload_preset", "todoapp");
  formData.append("file", file);

  try {
    const resp = await fetch(cloudUrl, {
      method: "POST",
      body: formData,
    });
    const cloudinaryResp = await resp.json();
    return cloudinaryResp.secure_url;
  } catch (error) {
    console.log(error);
  }
};

//Funcion recoge los links (arreglo) que envíe cloudinary y los devuelve al realizar el submit;
//por cada archivo que se agregue.
const onUploadfiles = async (files = []) => {
  const filesUploadPromises = [];
  for (const file of files) {
    filesUploadPromises.push(uploadfiles(file));
  }

  const photourls = await Promise.all(filesUploadPromises);
  return photourls;
};
function App() {
  const [filevalue, setfilevalue] = useState([]);
  const onChange = (event) => {
    setfilevalue(event.target.files);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const photos = await onUploadfiles(filevalue);
    console.log(photos);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" multiple onChange={onChange} />
      <button>Submit</button>
    </form>
  );
}

export default App;
