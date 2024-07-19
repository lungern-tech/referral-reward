import Wrapper from './Wrapper'

export const metadata = {
  title: 'Campaign Detail',
}

export default function ({ params: { id } }: { params: { id: string } }) {
  return <Wrapper id={id} />
}
