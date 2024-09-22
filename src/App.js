import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";

const FilterForm = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredData, setFilteredData] = useState({});

  // Options for the multi-select dropdown
  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase", label: "Highest lowercase alphabet" },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post the data to the backend API
      const response = await axios.post(
        "http://localhost:3000/bfhl",
        JSON.parse(jsonInput)
      );
      setResponseData(response.data);
      console.log(response);
    } catch (error) {
      console.error("Invalid JSON or API error", error);
    }
  };

  // Handle multi-select filter change
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions);

    // Apply the filter logic based on selected filters
    if (responseData) {
      const filtered = {};
      selectedOptions.forEach((option) => {
        if (option.value === "numbers") {
          filtered.numbers = responseData.numbers;
        } else if (option.value === "alphabets") {
          filtered.alphabets = responseData.alphabets;
        } else if (option.value === "highest_lowercase") {
          filtered.highest_lowercase_alphabet =
            responseData.highest_lowercase_alphabet;
        }
      });
      setFilteredData(filtered);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <div>
        <h3>Input</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"data": ["M","1","334","4","B"]}'
            style={{ width: "400px", padding: "10px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#3f51b5",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {responseData && (
        <>
          <h3>Multi Filter</h3>
          <Select
            isMulti
            options={filterOptions}
            onChange={handleFilterChange}
            placeholder="Select Filters"
          />

          <h3>Filtered Response</h3>
          {filteredData.numbers && (
            <p>Numbers: {filteredData.numbers.join(", ")}</p>
          )}
          {filteredData.alphabets && (
            <p>Alphabets: {filteredData.alphabets.join(", ")}</p>
          )}
          {filteredData.highest_lowercase_alphabet && (
            <p>
              Highest Lowercase Alphabet:{" "}
              {filteredData.highest_lowercase_alphabet.join(", ")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FilterForm;
