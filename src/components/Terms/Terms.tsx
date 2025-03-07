import React from 'react'
import { Link } from 'react-router-dom'
import "./terms.scss"

type Props = {}

const Terms: React.FC  = (props: Props) => {
  return (
    <article className='terms'>
        <ul className='terms__list' >
            <li className='terms__list__item' >
        <Link to="/">
        Integritetspolicy
        </Link>
        </li>
            <li className='terms__list__item' >
        <Link to="/" >
        Användarvillkor
        </Link>
        </li>
        </ul>
    </article>
  )
}

export default Terms