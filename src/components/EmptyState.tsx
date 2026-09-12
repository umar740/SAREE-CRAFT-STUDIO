export default function EmptyState({ icon = '🧵', message }: { icon?: string; message: string }) {
  return (
    <div className="text-center py-14 px-5 border border-dashed border-line rounded-xl2 bg-ivorydeep text-inksoft">
      <div className="text-3xl mb-2">{icon}</div>
      <p>{message}</p>
    </div>
  )
}
