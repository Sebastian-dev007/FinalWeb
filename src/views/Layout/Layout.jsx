import React, { useState } from 'react'
import { Container } from '@mui/material'
import Header from './Header'
import MainMenu from './MainMenu'
import Footer from './Footer'
import '../css/Layout.css' 

const Layout = ({ children }) => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Header setOpen={setOpen} />
			<MainMenu open={open} setOpen={setOpen} />
			<Container maxWidth="lg" className="layout-container">
				{children}
			</Container>
			<Footer />
		</>
	)
}

export default Layout
