import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
    <Link href={"/user/login"}> User </Link> 
    <Link href={"/expert/login"}> Expert </Link> 
    </div>
  )
}
