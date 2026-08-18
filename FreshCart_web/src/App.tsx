import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Body from "./pages/Body";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
