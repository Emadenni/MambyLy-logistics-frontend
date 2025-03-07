import React from 'react'



const Footer_menu = (props: Props) => {
 return (
     <nav className="navbar">
       <ul className="navbar__list">
 
         <li className="navbar__list__item">
           <Link to="/" className="navbar_link" activeClassName="navbar_link--active">
             HEM
           </Link>
           </li>
 
           <li className="navbar__list__item">
           <Link to="/services" className="navbar_link" activeClassName="navbar_link--active">
             TJÄNSTER
           </Link>
           </li>
 
           <li className="navbar__list__item">
           <Link to="/contactUs" className="navbar_link" activeClassName="navbar_link--active">
             KONTAKTA OSS
           </Link>
           </li>
 
           <li className="navbar__list__item">
           <Link to="/workWithUs" className="navbar_link" activeClassName="navbar_link--active">
             JOBBA MED OSS
           </Link>
           </li>
           <li className="navbar__list__item">
           <Link to="/aboutUs" className="navbar_link" activeClassName="navbar_link--active">
             OM OSS
           </Link>
            </li>
        
       </ul>
     </nav>
   );
 };

export default Footer_menu