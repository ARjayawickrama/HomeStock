import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Login/SignUp ";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Anju from "./pages/Login/Anju";
function App() {
  return (
    <Router>
      
        <Routes>
        <Route path="/Login" element={<Login />} />
     
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/" element={<Anju />} />
        
        
        </Routes>
   
    </Router>
  );
}

export default App;
