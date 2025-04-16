import * as React from 'react';
import { useParams, Link } from 'react-router-dom';

function Navbar() { // Top bar to be rendered in any page
  const { handle } = useParams();
  return (
      <nav className="nav-h font-mono text-sm md:text-base lg:text-lg text-center w-3/5 select-none gap-12 lg:gap-16 xl:gap-20">
        
        <Link to="/" 
          className="w-1/4 text-muted-foreground hover:text-accent-foreground hover:underline underline-offset-8"
        >
          Home
        </Link>

        <Link to={`/bio${handle ? `/${handle}` : ''}`}
          className="w-1/4 text-muted-foreground hover:text-accent-foreground hover:underline underline-offset-8"
        >
          Bio
        </Link>

        <Link to="/feed" 
          className="w-1/4 text-muted-foreground hover:text-accent-foreground hover:underline underline-offset-8"
        >
          Feed
        </Link>

      </nav>
  );
}

export default Navbar;