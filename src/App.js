import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import Select from "react-select";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;

  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterComponent = ({ filterText, onFilter, onClear, searchColumn }) => (
  <>
    <TextField
      id="search"
      type="text"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      placeholder={searchColumn}
      style={{
        borderColor: "black",
      }}
    />
  </>
);

function App() {
  const columns = [
    {
      name: "Исполнитель",
      selector: (row) => row.artist,
      sortable: true,
    },
    {
      name: "Песня",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Жанр",
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: "Год",
      selector: (row) => row.year,
      sortable: true,
    },
  ];

  const [selectedOption, setSelectedOption] = useState({
    value: "",
    label: "",
  });

  const [tracks, setTracks] = useState([]);
  const [genre, setGenre] = useState([]);
  useEffect(() => {
    const fetchAllTracks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/tracks");
        let uniqueArray = res.data.filter((item, index) => {
          return (
            res.data.map((mapItem) => mapItem.genre).indexOf(item.genre) ===
            index
          );
        });
        setGenre(uniqueArray);

        setTracks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllTracks();
  }, []);

  const [filterTextArtist, setFilterTextArtist] = useState("");
  const [filterTextName, setFilterTextName] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = tracks.filter((item) => {
    if (selectedOption.label !== "" && selectedOption.value !== "") {
      if (
        item.artist &&
        item.artist.toLowerCase().includes(filterTextArtist.toLowerCase()) &&
        item.name &&
        item.name.toLowerCase().includes(filterTextName.toLowerCase()) &&
        item.genre &&
        item.genre === selectedOption.label
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        item.artist &&
        item.artist.toLowerCase().includes(filterTextArtist.toLowerCase()) &&
        item.name &&
        item.name.toLowerCase().includes(filterTextName.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  const onChange = (event) => {
    if (event !== null) {
      setSelectedOption({ value: event.value, label: event.label });
      return;
    }
    setSelectedOption({ value: "", label: "" });
  };
  const handleClearName = () => {
    if (filterTextName) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterTextName("");
    }
  };

  const handleClearArtist = () => {
    if (filterTextArtist) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterTextArtist("");
    }
  };
  const options = genre.map((item) => ({
    value: item.genre,
    label: item.genre,
  }));

  return (
    <div
      className="App"
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: "1000px",
        }}
      >
        <DataTable
          title="Contact List"
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
        />
      </div>
      <div
        style={{
          display: "block",
        }}
      >
        <div
          style={{
            margin: "10px 20px 10px 50px",
          }}
        >
          <FilterComponent
            onFilter={(e) => setFilterTextArtist(e.target.value)}
            onClear={handleClearArtist}
            filterText={filterTextArtist}
            searchColumn="Search by Artist"
          />
        </div>
        <div
          style={{
            margin: "10px 20px 10px 50px",
          }}
        >
          <FilterComponent
            onFilter={(e) => setFilterTextName(e.target.value)}
            onClear={handleClearName}
            filterText={filterTextName}
            searchColumn="Search by Music"
          />
        </div>
        <div
          style={{
            borderColor: "black",
            width: "250px",
            margin: "10px 20px 10px 50px",
          }}
        >
          <Select
            isClearable={true}
            name="color"
            options={options}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
