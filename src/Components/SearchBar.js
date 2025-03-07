import { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

export default function SearchBar({ onResults, searchQuery, setSearchQuery }) {
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    setQuery(searchQuery); // ✅ Sync input with parent
  }, [searchQuery]);

  const handleSearch = async (e) => {
    const searchText = e.target.value;
    setQuery(searchText);
    setSearchQuery(searchText);

    if (searchText.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/products/search?query=${searchText}`
        );
        onResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      onResults([]);
    }
  };

  return (
    <TextField
      placeholder="Search for products..."
      variant="outlined"
      fullWidth
      value={query}
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
