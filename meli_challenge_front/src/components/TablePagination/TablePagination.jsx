import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import "./TablePagination.css";

const TablePagination = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [eventTypes, setEventTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const pageSizes = [3, 5, 10, 25, 50, 100];

  const fetchEvents = (page) => {
    let url = `http://localhost:8000/events?page=${page}&pageSize=${pageSize}`;

    if (searchPerformed) {
      if (searchText) {
        url += `&description=${searchText}`;
      }
      if (selectedCountry) {
        url += `&country=${selectedCountry}`;
      }
      if (selectedEventType) {
        url += `&type=${selectedEventType}`;
      }
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setCurrentPage(page);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };

  const fetchEventTypes = () => {
    fetch("http://localhost:8000/event-types")
      .then((response) => response.json())
      .then((data) => {
        setEventTypes(data);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };

  const fetchCountries = () => {
    fetch("http://localhost:8000/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };

  useEffect(() => {
    fetchEvents(currentPage);
    fetchEventTypes();
    fetchCountries();
  }, [pageSize]);

  const handlePageChange = (page) => {
    fetchEvents(page);
  };

  const handlePageSizeChange = (event) => {
    const selectedPageSize = parseInt(event.target.value);
    setPageSize(selectedPageSize);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    fetchEvents(1);
  };

  return (
    <div className="table-pagination-container">
      <div className="row justify-content-start">
        <div className="col">
          <label className="table-pagination-label">Tipo:</label>
          <select
            className="table-pagination-select"
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
          >
            <option value="">Seleccione un tipo de evento</option>
            {eventTypes.map((eventType) => (
              <option key={eventType.id} value={eventType.description}>
                {eventType.description}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="table-pagination-label">País:</label>
          <select
            className="table-pagination-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Seleccione un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.description}>
                {country.description}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="table-pagination-label">Descripción:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchPerformed(false);
            }}
            placeholder="Buscar eventos..."
          />
        </div>
        <div className="col">
          <button onClick={handleSearch}>Buscar</button>
        </div>
      </div>
      <br /><br />
      {events !== null && events.length === 0 ? (
        <p className="table-pagination-message">No hay eventos disponibles.</p>
      ) : (
        <Table striped bordered hover className="table-pagination-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Created at</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.created_at}</td>
                <td>{item.country}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className="row justify-content-start">
        <div className="col">
          <label className="table-pagination-label">Items por página:</label>
          <select
            className="table-pagination-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={events === null || events.length < pageSize}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
