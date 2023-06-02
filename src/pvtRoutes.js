import Signup from "views/Signup.jsx";
import SignIn from "views/SignIn.jsx";

var pvtRoutes = [

  {
    path: "/signIn",
    name: "SignIn",
    component: SignIn,
    layout: "/login"
  },

  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    layout: "/login"
  }
];
export default pvtRoutes;
