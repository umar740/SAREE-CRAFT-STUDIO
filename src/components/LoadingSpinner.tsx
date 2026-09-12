export default function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-inksoft">
      <div className="w-9 h-9 rounded-full border-4 border-line border-t-wine animate-spin" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}
