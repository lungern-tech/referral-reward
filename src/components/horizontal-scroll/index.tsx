export default function ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-4 gap-x-8">
      {
        children
      }
    </div>
  )
}