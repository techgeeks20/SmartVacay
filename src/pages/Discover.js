import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import Post from "../components/Post";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar";

const Discover = ({
  currentUser,
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  date,
  id,
  posts,
  setPosts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImage(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setImage(null);
      setFileName("");
    }
  };

  const storageRef = ref(storage, `images/${id}`);
  const toggleOpen = () => {
    if (currentUser === null) {
      setIsModalOpen(true);
    } else {
      setOpen(!open);
    }
  };

  const postHandler = async (e) => {
    const uploadTask = uploadBytesResumable(storageRef, image);
    if (title === "" || description === "" || image === null) {
      alert("Please fill everything out");
    } else {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            addDoc(collection(db, "posts"), {
              title: title,
              description: description,
              image: downloadURL,
              date: date,
              id: id,
              email: currentUser.email,
            });
            setOpen(false);
            setTitle("");
            setDescription("");
            setProgress(0);
            setImage(null);
          });
        }
      );
    }
  };
  const deletePostHandler = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };
  return (
    <>
      <Navbar currentUser={currentUser} />
      <div>
        <h1 className="mr-auto text-center mt-5 mb-7 text-xl text-[#33ACFF] font-bold leading-none tracking-tight md:text-5xl lg:text-3xl">
          Discover
        </h1>
        {isModalOpen && (
          <>
            <p className="p-4 bg-red-500 text-white">Please login to post.</p>
          </>
        )}
        {open ? (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="text-center font-bold text-2xl text-gray-800 mb-8">
              New Post
            </div>
            <form className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
              <div className="px-4 py-3">
                <input
                  className="bg-gray-100 rounded-md px-4 py-2 w-full mb-4 text-gray-800 font-semibold border focus:outline-none focus:border-[#33ACFF]"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="bg-gray-100 rounded-md p-4 w-full mb-4 text-gray-800 font-semibold border h-64 focus:outline-none focus:border-[#33ACFF]"
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Upload file
                </label>
                <div className="flex items-center mb-4">
                  <label
                    htmlFor="file_input"
                    className="cursor-pointer bg-[#33ACFF] hover:bg-[#33ACFF] text-white py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                  >
                    Choose a file
                  </label>
                  <span class="ml-4 text-sm text-gray-600">
                    {file ? file.name : "No file selected"}
                  </span>
                  <input
                    className="hidden"
                    type="file"
                    id="file_input"
                    onChange={handleFileChange}
                  />

                  {progress > 0 && (
                    <h2 className="text-gray-700 ml-4">
                      Uploading is {progress}% complete
                    </h2>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 mr-2 rounded-md border focus:outline-none focus:border-[#33ACFF] transition-colors duration-300 ease-in-out"
                    onClick={toggleOpen}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-[#33ACFF] hover:bg-[#33ACFF] text-white font-semibold py-2 px-4 rounded-md border focus:outline-none focus:border-[#33ACFF] transition-colors duration-300 ease-in-out"
                    onClick={postHandler}
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div class="">
            <button
              onClick={toggleOpen}
              className="fixed inline-block rounded-full bg-[#33ACFF] text-white leading-normal uppercase shadow-md hover:bg-[#33ACFF] hover:shadow-lg focus:bg- focus:shadow-lg focus:outline-none focus:ring-0 active:bg- active:shadow-lg transition duration-150 ease-in-out w-12 h-12 bottom-10 right-20"
            >
              +
            </button>
          </div>
        )}
      </div>
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            deletePostHandler={deletePostHandler}
            currentUser={currentUser}
            message={post.message}
            image={post.image}
            description={post.description}
            date={post.date}
            email={post.email}
            id={post.id}
          />
        ))}
      </div>
    </>
  );
};

export default Discover;
