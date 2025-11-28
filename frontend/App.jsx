function FakeCart() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <span style={{ margin: "0 10px" }}>{count}</span>
      <button onClick={() => count > 0 && setCount(count - 1)}>-</button>
      <br/>
      <button onClick={() => alert("Item bought (fake) 😭")}>Buy</button>
    </div>
  );
}

function App() {
  const [logged, setLogged] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [image, setImage] = React.useState("");

  const [list, setList] = React.useState([]);

  const load = async () => {
    let res = await fetch("http://localhost:5000/msg");
    setList(await res.json());
  };

  React.useEffect(() => { load(); }, []);

  const login = () => {
    if (username === "user" && password === "pass") {
      setLogged(true);
    } else alert("Wrong login");
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const save = async () => {
    await fetch("http://localhost:5000/msg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text: desc, photo: image })
    });

    setTitle("");
    setDesc("");
    setImage("");
    load();
  };

  const remove = async (id) => {
    await fetch(`http://localhost:5000/msg/${id}`, { method: "DELETE" });
    load();
  };

  if (!logged) {
    return (
      <div>
        <h2>Login</h2>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} /><br/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><br/>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Flipkart App</h2>
      <h3>Add Product (Admin)</h3>

      <input 
        placeholder="Title" 
        value={title} 
        onChange={(e)=>setTitle(e.target.value)} 
      /><br/>

      <input 
        placeholder="Description" 
        value={desc} 
        onChange={(e)=>setDesc(e.target.value)} 
      /><br/>

      <input type="file" accept="image/*" onChange={uploadImage} /><br/>

      <button onClick={save}>Save</button>

      <hr/>
      <h3>Products Table</h3>

      <table border="1" cellpadding="10">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Cart</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {list.map(item => (
            <tr key={item._id}>
              <td>
                {item.photo ? (
                  <img src={item.photo} width="100" />
                ) : (
                  "No Image"
                )}
              </td>

              <td>{item.title}</td>
              <td>{item.text}</td>

              <td>
                <FakeCart />
              </td>

              <td>
                <button onClick={() => remove(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
