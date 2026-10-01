type ToastProps = {
  message: string | null
  messageId: number
}

/** Keep the live region mounted so each new message is announced. */
export function Toast({ message, messageId }: ToastProps) {
  return (
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true" lang="de">
      {message && <p className="toast" key={messageId}>{message}</p>}
    </div>
  )
}
