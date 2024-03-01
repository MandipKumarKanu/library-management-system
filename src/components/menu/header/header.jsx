import React from 'react'
import './header.css'
import Clock from '../../clock'

function Header() {
  return (
    <>
    <section id="header">
        <div className="header">
            <header className="h-left">GyanSagar</header>
            <header className="h-right"><Clock/></header>
        </div>
    </section>
    </>
  )
}

export default Header