export default function ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid pb-8 grid-cols-1 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {
        children
      }
    </div>
  )
}