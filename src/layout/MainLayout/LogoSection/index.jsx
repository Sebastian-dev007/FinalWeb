import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';
import Icono from '@mui/icons-material/School';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <Link >
      <Icono />
    </Link>
  );
}
