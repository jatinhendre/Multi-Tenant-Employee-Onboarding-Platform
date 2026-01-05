import React from 'react'
import DashboardLayout from './DashboardLayout'

function layout({children}:{children:React.ReactNode}) {
  return (
    <DashboardLayout>

    <div>{children}</div>
    </DashboardLayout>
  )
}

export default layout