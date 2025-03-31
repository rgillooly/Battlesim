import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Submission = () => {
  const [inputValue, setInputValue] = useState({
    projectName: "",
    projectDescription: "",
    projectLink: "",
  });
  const { projectName, projectDescription, projectLink } = inputValue;

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  // Function for handling errors (using react-toastify)
  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://rgillooly-portfolio-b3a90409f6d8.herokuapp.com/api/submission/`,
        {
          projectName,
          projectDescription,
          projectLink,
        }
      );
      console.log("Signup successful:", response.data);
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h2>Submission Form:</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            name="projectName"
            placeholder="Enter Project Name"
            onChange={handleOnChange}
          ></input>
        </div>
        <div>
          <label>Project Description:</label>
          <input
            name="projectDescription"
            placeholder="Enter Project Description"
            onChange={handleOnChange}
          ></input>
        </div>
        <div>
          <label>Project Link:</label>
          <input
            name="projectLink"
            placeholder="Enter Project Link"
            onChange={handleOnChange}
          ></input>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Submission;
