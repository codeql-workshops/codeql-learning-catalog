import {useEffect} from 'react'
import {GetStaticProps} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

export interface Props {}

const Home: Props = ({}) => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/overview')
  })

  return 'Redirecting...'
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  return {
    props: {}
  }
}

export default Home
