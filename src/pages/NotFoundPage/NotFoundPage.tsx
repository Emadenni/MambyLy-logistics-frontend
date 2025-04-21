import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type Props = {}

const NotFoundPage: React.FC<Props> = () => {
  const navigate = useNavigate() // Usa useNavigate al posto di useHistory

  const handleGoHome = () => {
    navigate('/')  // Redirige alla home
  }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: '#fff',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', color: '#1976d2' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 4, color: 'gray' }}>
          The page you are looking for might have been moved or deleted.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  )
}

export default NotFoundPage
