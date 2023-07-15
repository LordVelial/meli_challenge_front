import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    typeid: 0,
    description: "",
    countryid: 0
  });
  const SERVICE_URL = "http://localhost:8000";
  const pageSizes = [3, 5, 10, 25, 50, 100];

  const fetchEvents = (page) => {
    let url = `${SERVICE_URL}/events?page=${page}&pageSize=${pageSize}`;

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
    fetch(SERVICE_URL+"/event-types")
      .then((response) => response.json())
      .then((data) => {
        setEventTypes(data);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };

  const fetchCountries = () => {
    fetch(SERVICE_URL+"/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };

  const updateTableData = () => {
    fetchEvents(currentPage);
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

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetModalData();
    updateTableData();
  };

  const resetModalData = () => {
    setModalData({
      typeid: 0,
      description: "",
      countryid: 0
    });
  };

  const handleModalSave = () => {
    const parsedCountryId = parseInt(modalData.countryid);
    const parsedTypeId = parseInt(modalData.typeid);
    const eventData = {
        typeid: parsedTypeId,
        description: modalData.description,
        countryid: parsedCountryId,
      };
    fetch(SERVICE_URL+"/events", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    })
    //.then((response) => response.json())
    .then((data) => {
        if (data) {
            console.log("Event saved successfully:", data);
          } else {
            console.log("Event saved successfully.");
          }     
        handleModalClose();
    })
    .catch((error) => {
        console.error("Error saving event:", error);
    });
  };

  const handleModalInputChange = (event) => {
    const { name, value } = event.target;
    setModalData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
          <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
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
        <div className="col">
          <Button onClick={handleModalOpen}>Guardar</Button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ingresar evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Tipo de evento:</label>
          <select
            name="typeid"
            className="form-control"
            value={modalData.typeid}
            onChange={handleModalInputChange}
          >
            <option value="">Seleccione un tipo de evento</option>
            {eventTypes.map((eventType) => (
              <option key={eventType.id} value={eventType.id}>
                {eventType.description}
              </option>
            ))}
          </select>
          <br />
          <label>Descripción:</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={modalData.description}
            onChange={handleModalInputChange}
          />
          <br />
          <label>País:</label>
          <select
            name="countryid"
            className="form-control"
            value={modalData.countryid}
            onChange={handleModalInputChange}
          >
            <option value="">Seleccione un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.description}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablePagination;
