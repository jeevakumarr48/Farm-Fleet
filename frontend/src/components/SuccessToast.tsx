import { Check, X } from 'lucide-react'
export function SuccessToast({ message, onClose }: { message: string; onClose?: () => void }) { return <div className="toast success"><span><Check size={14} /></span><strong>{message}</strong>{onClose && <button onClick={onClose} aria-label="Close"><X size={14} /></button>}</div> }
