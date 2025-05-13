import { Outlet } from 'react-router-dom';
import NavBar from './components/navbar';

function BasicLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default BasicLayout;
