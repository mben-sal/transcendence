import Notification from "../component/profile/Notification";

const Navbar = () => {
	  return (
	<nav className="w-full bg-[#CBDCEB] flex flex-col h-full">
	  <div className="container">
		<a className="navbar-brand" href="#">
		  <Notification />
		</a>
	  </div>
	</nav>
  );
};

export default Navbar;