import React from 'react'

const After = ({after}:{after?:string}) => {
  return (
    after ? <p className="text-md font-medium">{after}</p> : <></>
  )
}

export default After