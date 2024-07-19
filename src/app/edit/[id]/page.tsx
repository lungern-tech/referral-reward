import Wrapper from './Wrapper'

export const metadata = {
  title: 'Edit Campaign',
}

export default function ({ params: { id } }: { params: { id: string } }) {
  return <Wrapper id={id} />
}
