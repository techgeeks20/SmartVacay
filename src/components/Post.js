import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import DeleteAlert from "./DeleteAlert";

const Post = ({
  id,
  email,
  currentUser,
  title,
  image,
  description,
  date,
  deletePostHandler,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const onDelete = () => {
    deletePostHandler(id);
  };

  const onCancel = () => {
    setShowDeleteAlert(false);
  };

  return (
    <div className="mx-auto w-[30%]">
      <a class="break-words block mb-4 rounded-lg shadow-lg shadow-indigo-100">
        <img src={image} class="h-[40%] w-full rounded-lg object-cover" />

        <div class="mt-2 p-4">
          <dl>
            <div>
              <dd class="font-medium text-2xl">{title}</dd>
              <p className="text-gray-600 text-sm mt-2 ">{description}</p>
            </div>
          </dl>

          <div class="mt-6 flex items-center gap-8 text-xs">
            <div class="sm:inline-flex sm:shrink-0 sm:items-center">
              <img
                className="h-6"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Calendar_font_awesome.svg/1024px-Calendar_font_awesome.svg.png"
              />

              <div class="mt-1.5 sm:ml-3 sm:mt-0">
                <p class="text-gray-500">Date</p>

                <p class="font-medium">{date}</p>
              </div>
            </div>

            <div class="sm:inline-flex sm:shrink-0 sm:items-center">
              <img
                className="h-6"
                src="https://freesvg.org/img/abstract-user-flat-4.png"
              ></img>

              <div class="mt-1.5 sm:ml-3 sm:mt-0">
                <p class="text-gray-500">User</p>

                <p class="font-medium">{email}</p>
              </div>
            </div>
            <div class="sm:inline-flex sm:shrink-0 sm:items-center">
              {currentUser.email === email && (
                <>
                  <img
                    onClick={() => setShowDeleteAlert(true)}
                    className="h-6 cursor-pointer"
                    src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-coloricon-1/21/51-512.png"
                  ></img>
                  {showDeleteAlert && (
                    <DeleteAlert
                      onDelete={onDelete}
                      onCancel={onCancel}
                      showDeleteAlert={showDeleteAlert}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Post;
