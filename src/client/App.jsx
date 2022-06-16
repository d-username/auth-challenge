import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({
    username: "",
    userId: "",
  });

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then((res) => res.json())
      .then((res) => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const user = { username: username, password: password };
    fetch("http://localhost:4000/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  const handleLogin = async ({ username, password }) => {
    const user = { username: username, password: password };
    fetch("http://localhost:4000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((userData) => {
        localStorage.setItem("token", `${userData.data.token}`);
        setLoggedInUser({ username: username, userId: userData.data.userId });
      });
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const movie = {
      title: title,
      description: description,
      runtimeMins: runtimeMins,
      userId: loggedInUser,
    };

    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movie),
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies([...movies, data.data]);
      });
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <h3>The user logged in is {loggedInUser.username}</h3>
      <ul>
        {movies.map((movie) => {
          if (movie.userId === loggedInUser.userId) {
            return (
              <li key={movie.id}>
                <h3>{movie.title}</h3>
                <p>Description: {movie.description}</p>
                <p>Runtime: {movie.runtimeMins}</p>
                <p>User ID: {movie.userId}</p>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default App;
