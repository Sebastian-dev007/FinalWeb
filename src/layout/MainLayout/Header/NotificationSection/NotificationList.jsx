import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: alpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
  const containerSX = { pl: 7 };

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">Hace 2 minutos</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="John Doe" src={User1} />
          </ListItemAvatar>
          <ListItemText primary="Coordinador" />
        </ListItem>
        <Stack spacing={2} sx={containerSX}>
          <Typography variant="subtitle2">Se ha agregado un nuevo proyecto </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip label="Unread" color="error" size="small" sx={{ width: 'min-content' }} />
            <Chip label="New" color="warning" size="small" sx={{ width: 'min-content' }} />
          </Stack>
        </Stack>
      </ListItemWrapper>
      
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">Hace 1 hora</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'primary.dark',
                bgcolor: 'primary.light'
              }}
            >
              <IconMailbox stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Estudiante</Typography>} />
        </ListItem>
        <Stack spacing={2} sx={containerSX}>
          <Typography variant="subtitle2">Se ha enviado nuevas actualizaciones de proyectos</Typography>
          <Button variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
            Email
          </Button>
        </Stack>
      </ListItemWrapper>

      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="John Doe" src={User1} />
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Docente</Typography>} />
        </ListItem>
        <Stack spacing={2} sx={containerSX}>
          <Typography component="span" variant="subtitle2">
            Imagen cargada &nbsp;
            <Typography component="span" variant="h6">
              20 Mayo 2025
            </Typography>
          </Typography>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <Stack direction="row" spacing={2} sx={{ p: 2.5 }}>
              <IconPhoto stroke={1.5} size="20px" />
              <Typography variant="subtitle1">demo.jpg</Typography>
            </Stack>
          </Card>
        </Stack>
      </ListItemWrapper>
      
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
