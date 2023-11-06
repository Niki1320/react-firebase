import "./App.css";
import { useEffect, useState } from 'react';
import { Auth } from './components/auth';
import { db,auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage'

function App() {
  const [movieList, setMovieList]=useState([]); //state to keep track of movies

  //new movie states
  const [newMovieTitle, setNewMovieTitle]=useState("");
  const [newReleaseDate, setNewReleaseDate]=useState(0);
  const [isNewMovieOScar, setIsNewMovieOscar]=useState(false);

  //update title states
  const [updatedTitle, setUpdatedTitle]=useState("");

  //file upload states
  const [fileUpload, setFileUpload] = useState(null); 

  const getMovieList= async () => {
    //read data  
    try {
      const data=await getDocs(moviesCollectionRef);
      const filteredData= data.docs.map((doc)=> ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    }
    catch (err) { console.error(err) }
  };

  const deleteMovie=async (id) => {
    const moviedoc=doc(db, "movies", id);
    await deleteDoc(moviedoc);
  }

  const updateMovieTitle= async (id) => {
    const moviedoc=doc(db, "movies", id);
    await updateDoc(moviedoc, {title: updatedTitle});
  }

  const moviesCollectionRef = collection(db, "movies");
  useEffect(()=> {   //runs as soon as app is rendered 
    
    getMovieList();
  },[]);

  const onSubmitMovie = async() => {
    try{
    await addDoc(moviesCollectionRef, {
      title: newMovieTitle,
      releasedate: newReleaseDate,
      receivedAnOscar: isNewMovieOScar,
      userId: auth?.currentUser?.uid,
    });
    getMovieList();
  } catch (err) {
    console.error(err);
  }
  }

  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef=ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    }
    catch (err) { console.error(err) }
  }

  return (
    <div className="App"><Auth/>
    <div>
      <input type="text" placeholder="Movie title" 
      onChange={(e)=> setNewMovieTitle(e.target.value)}/>
      <input type="number" placeholder="Release Date"
      onChange={(e)=> setNewReleaseDate(Number(e.target.value))}/>
      <input type="checkbox" 
      checked={isNewMovieOScar}
      onChange={(e)=> setIsNewMovieOscar(e.target.checked)}/>
      <label>Received an Oscar</label>
      <button onClick={onSubmitMovie}>Submit Movie</button>
    </div>
    <div>{movieList.map((movie)=> (
      <div>
        <h1 style={{color: movie.receivedAnOscar? "green":"red"}}> 
        {" "}
        {movie.title}{" "} </h1>
        <p> Date: {movie.releasedate}</p>
        <button onClick={()=> deleteMovie(movie.id)}>Delete Movie</button>
        <input placeholder="New Title" onChange={(e)=> setUpdatedTitle(e.target.value)}/>
        <button onClick={()=> updateMovieTitle(movie.id)}>Update Title</button>
      </div>
    ))}</div>
    <div>
      <input type="file" onChange={(e)=>setFileUpload(e.target.files[0])}/>
      <button onClick={uploadFile}>Upload File</button>
    </div>
    </div>
  )
}
export default App;