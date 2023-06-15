import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'
type THeadProps = {
  title: string
  description: string
  maxInputLength: number
}

export const Head = ({ title = '', description = '', maxInputLength = 150 }: Partial<THeadProps>) => {
  return (
    <Helmet title={title} defaultTitle='Shoppe Corporation'>
      <meta
        name='description'
        content={convert(description, {
          limits: {
            maxInputLength
          }
        })}
      />
    </Helmet>
  )
}
