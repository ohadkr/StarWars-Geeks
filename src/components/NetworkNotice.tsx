interface NetworkNoticeProps {
  message: string
  onRetry: () => void
  savedData?: boolean
}

function NetworkNotice({
  message,
  onRetry,
  savedData = false,
}: NetworkNoticeProps) {
  return (
    <div className="network-notice" role={savedData ? 'status' : 'alert'}>
      <p>{savedData ? `Showing saved data. ${message}` : message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default NetworkNotice
