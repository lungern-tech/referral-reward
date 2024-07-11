export default function ({ children, errorMessage }: { children: React.ReactNode, errorMessage: string }) {
  return (
    <div>
      {
        children
      }
      <div className="text-red-600">{errorMessage}</div>
    </div>
  )
}