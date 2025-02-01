import React from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBDropdownLink, MDBContainer } from 'mdb-react-ui-kit';

export default function Basic() {
  return (
    <MDBContainer className="d-flex justify-content-center mt-5 basic">
      <MDBDropdown>
        <MDBDropdownToggle>Dropdown button</MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Action</MDBDropdownLink>
          </MDBDropdownItem>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Another action</MDBDropdownLink>
          </MDBDropdownItem>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Submenu &raquo;</MDBDropdownLink>
            <ul className="dropdown-menu dropdown-submenu">
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Submenu item 1</MDBDropdownLink>
              </MDBDropdownItem>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Submenu item 2</MDBDropdownLink>
              </MDBDropdownItem>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Submenu item 3 &raquo;</MDBDropdownLink>
                <ul className="dropdown-menu dropdown-submenu">
                  <MDBDropdownItem>
                    <MDBDropdownLink href="#">Multi level 1</MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink href="#">Multi level 2</MDBDropdownLink>
                  </MDBDropdownItem>
                </ul>
              </MDBDropdownItem>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Submenu item 4</MDBDropdownLink>
              </MDBDropdownItem>
              <MDBDropdownItem>
                <MDBDropdownLink href="#">Submenu item 5</MDBDropdownLink>
              </MDBDropdownItem>
            </ul>
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </MDBContainer>
  );
}
function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addItem = () => {
    const newItem = { name: 'New Name', uname: 'New Uname'};
    axios.post('http://localhost:5000/api/items', newItem)
      .then(response => setItems([...items, response.data]))
      .catch(error => console.error('Error adding item:', error));
  };

  return (
    <div>
      <h1>Items from MongoDB</h1>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item._id}>{item.name}: {item.uname}</li>
        ))}
      </ul>
    </div>
  );
}