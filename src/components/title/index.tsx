export default function (props: { title: string }) {
  return (
    <div>
      <h1 className="mt-8 font-bold text-2xl">
        {props.title}
      </h1>
    </div>
  )
}