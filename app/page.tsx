import Link from 'next/link'
import React from 'react'

const page = () => {
  return (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
  <div className="bg-[#c8a116] text-white p-8 rounded-2xl w-full text-center max-w-[80%] sm:max-w-lg shadow-[0_0_20px_6px_rgba(255,255,0,0.3)] flex flex-col items-center">
    
    <h2 className="font-monoton text-3xl sm:text-6xl text-blue-900">Welcome!</h2>
    
    <p className="sm:text-2xl text-lg mt-12 underline">Here’s how scoring works:</p>
    <p className="sm:text-lg text-md mt-4">You will only have <span className='font-bold text-4xl'>20</span> seconds for each guess</p>

    <div className="text-lg sm:text-2xl mt-4 font-bold space-y-2 ">
      <p>Starting Score: <span className="text-4xl">10</span> points</p>
      <p>Correct Answer: <span className="text-4xl">+10</span></p>
      <p>Partially Correct: <span className="text-4xl">+5</span></p>
      <p>Time’s Up: <span className="text-4xl">−10</span></p>
    </div>

    <p className="sm:text-lg text-md mt-4 ">
      Hit <span className="font-bold text-xl">Enter</span> guess it or skip it!
    </p>

    <Link href="/game">
      <button className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 mt-10 hover:scale-105 duration-500 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.2)] text-xl hover:font-bold">
        Start
      </button>
    </Link>
  </div>
</div>



  )
}

export default page