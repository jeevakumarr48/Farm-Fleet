import { Link } from 'react-router-dom'
export function NotFoundPage() { return <div className="not-found"><span className="eyebrow">404 / OFF THE ROUTE</span><h1>This page is not on the run sheet.</h1><p>The route you asked for does not exist.</p><Link to="/" className="button button-primary">Return to overview</Link></div> }
