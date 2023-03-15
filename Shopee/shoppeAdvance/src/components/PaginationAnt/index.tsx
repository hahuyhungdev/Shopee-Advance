import { Pagination, PaginationProps } from 'antd'
import clsx from 'clsx'

type PageType = PaginationProps
export function Page({ className, pageSize = 10, current, total, onChange, ...rest }: PageType) {
  const _onChange = (page: number, pageSize: number) => {
    onChange?.(page, pageSize)
  }
  return (
    <div className={className}>
      <Pagination pageSize={pageSize} current={current} total={total} onChange={_onChange} {...rest} />
    </div>
  )
}

export default Page
