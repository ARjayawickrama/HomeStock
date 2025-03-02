import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Login/SignUp ";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Admin/Dashboard";
// import LedControl from './pages/Admin/IOT/Iot';
function App() {
  return (
    <Router>
      
        <Routes>
        <Route path="/" element={<Login />} />
     
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
   
    </Router>
  );
}

export default App;
