import React from 'react'

const Before = ({before}:{before?:string}) => {
  return (
    before ? <p className="text-2xl font-medium mb-2">{before}</p> : <></>
  )
}

export default Before