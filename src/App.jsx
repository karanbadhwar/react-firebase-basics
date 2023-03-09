import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/auth";
import {
  auth,
  db,
  storage,
} from "./config/firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  // console.log(db);

  const [movieList, setMovieList] = useState([]);

  const [movieTitle, setMovieTitle] = useState("");
  const [ReleaseDate, setReleaseDate] = useState(0);
  const [recievedAnOscar, setRecievedAnOscar] =
    useState(false);

  const [updateMovieTitle, setUpdateMovieTitle] =
    useState("");

  // File Upload State

  const [fileUpload, setFileUpload] = useState();
  console.log(fileUpload);
  const moviesCollectionRef = collection(db, "movies");
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filterData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: movieTitle,
        releaseDate: ReleaseDate,
        recievedAnOscar: recievedAnOscar,
        userId: auth?.currentUser?.uid,
      });
      alert("Movie Added to the List");

      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movie = doc(db, "movies", id);
    await deleteDoc(movie);
    getMovieList();
  };

  const updateTitle = async (id) => {
    const movie = doc(db, "movies", id);
    await updateDoc(movie, { title: updateMovieTitle });
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) {
      return;
    }
    const filesFolderRef = ref(
      storage,
      `projectFiles/${fileUpload.name}`
    );
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      alert("File Uploaded");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="App">
      <Auth />
      <div>
        <input
          type="text"
          placeholder="Movie Title..."
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Realease Date..."
          min="1947"
          max="2023"
          // value={ReleaseDate}
          onChange={(e) =>
            setReleaseDate(Number(e.target.value))
          }
        />

        <input
          type="checkbox"
          id="oscar"
          checked={recievedAnOscar}
          onChange={(e) =>
            setRecievedAnOscar(e.target.checked)
          }
        />
        <label htmlFor="oscar">Recived An Oscar</label>
        <button onClick={onSubmitMovie}>
          Submit Movie
        </button>
      </div>
      <div>
        {movieList.map((movie) => {
          return (
            <div key={movie.id}>
              <h1
                style={{
                  color: movie.recievedAnOscar
                    ? "green"
                    : "red",
                }}
              >
                {movie.title}
              </h1>
              <p>Date: {movie.releaseDate}</p>
              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                type="text"
                placeholder="Update Title"
                onChange={(e) =>
                  setUpdateMovieTitle(e.target.value)
                }
              />
              <button onClick={() => updateTitle(movie.id)}>
                Update Title
              </button>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <button onClick={uploadFile}> Upload File </button>
      </div>
    </div>
  );
}

export default App;
