export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) { return <div className="loading-state"><span className="spinner dark" />{label}</div> }
