import * as React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#424954',
        paddingTop: '1rem',
        paddingBottom: '1rem',
      }}
      className="footer"
    >
      <Container maxWidth="lg">
        <Grid
          container
          direction="column"
          alignItems="center"
          textAlign="center"
        >
          <Grid item xs={12}>
            <Typography variant="h5" paddingBottom="10px">
              Created by <a href="https://www.evanjones.space">Evan Jones</a>
            </Typography>
            <Typography>
              Questions? Need to report a bug? Open an issue in the{' '}
              <a href="https://github.com/evanjones125/road-trip-dashboard">
                GitHub repo
              </a>{' '}
            </Typography>
            <Typography paddingBottom="10px">
              or <a href="mailto:me@evanjones.space">send me an email</a>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {`${new Date().getFullYear()} | React | Material UI | Sass | Django`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
