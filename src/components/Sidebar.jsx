export default function Sidebar({ onClear }) {
  return (
    <div className="sidebar">
      <button onClick={onClear} className="clear-button">
        Clear Model
      </button>
    </div>
  )
}
