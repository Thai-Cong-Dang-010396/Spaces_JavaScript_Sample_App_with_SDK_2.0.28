import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

function StorageDashboard() {
  const [localStorageCopy, setLocalStorageCopy] = useState({});
  const [sessionStorageCopy, setSessionStorageCopy] = useState({});

  const handleStorageClear = (type) => {
    if (type === 'session') {
      setSessionStorageCopy({});
      sessionStorage.clear();
    }
    if (type === 'local') {
      setLocalStorageCopy({});
      localStorage.clear();
    }
  };

  useEffect(() => {
    localStorage.length && setLocalStorageCopy(localStorage);
    sessionStorage.length && setSessionStorageCopy(sessionStorage);
  }, [localStorageCopy, sessionStorageCopy]);

  return (
    <div
      style={{
        display: 'flex',
        fontSize: 'small'
      }}
    >
      {localStorageCopy !== null && (
        <Table striped bordered hover variant="dark" className="col-2">
          <thead>
            <tr>
              <th colSpan="2">
                localStorage <Button onClick={() => handleStorageClear('local')}>Clear</Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(localStorageCopy).map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {sessionStorageCopy !== null && (
        <Table striped bordered hover variant="dark" className="col-2">
          <thead>
            <tr>
              <th colSpan="2">
                sessionStorage <Button onClick={() => handleStorageClear('session')}>Clear</Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sessionStorageCopy).map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className="col-4" />
    </div>
  );
}

export default StorageDashboard;
