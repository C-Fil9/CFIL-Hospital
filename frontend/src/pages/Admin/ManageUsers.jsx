import { useEffect, useState } from "react";
import "../../styles/mnuser.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

function ManagePatients() {

  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [editingId, setEditingId] = useState(null);

  const API = `${API_BASE_DEFAULT}/users`;

  const fetchUsers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  const addUser = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phone })
    });

    clearForm();
    fetchUsers();
  };

  const updateUser = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phone })
    });

    setEditingId(null);
    clearForm();
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const editUser = (user) => {
    setEditingId(user._id);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setPhone(user.phone);
  };

  return (
    <>
      <div className="manage-page">

        <h1 className="page-title">Manage Patients</h1>

        <div className="card">

          <h2 style={{ color: "white" }}>Add Patient</h2>

          <div className="form-grid">

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

          </div>

          <button
            onClick={editingId ? updateUser : addUser}
            className={`btn ${editingId ? "btn-update" : "btn-add"}`}
          >
            {editingId ? "Update Patient" : "Add Patient"}
          </button>

        </div>

        <div className="table-card">

          <table>

            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user._id}>

                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.phone}</td>

                  <td>

                    <div className="action-btns">

                      <button
                        onClick={() => editUser(user)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default ManagePatients;