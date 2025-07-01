import Link from 'next/link'
import React from 'react'

const page = () => {
  return (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 ">
          <div className="bg-[#c8a116] text-white p-8 rounded-2xl max-w-md text-center sm:space-y-8 sm:space-x-8 shadow-[0_0_20px_6px_rgba(255,255,0,0.3)]">
            <h2 className=" font-monoton text-5xl">Welcome!</h2>
            <p className="text-lg mt-4">Let's see how to get the score.</p>

            <div className="text-2xl  mt-4">
              <p>Start: <span className="font-bold text-4xl">10 </span>scores</p>
            <p>Fully Correct: <span className="font-bold text-4xl">+10</span></p>
              <p>Partially Correct: <span className="font-bold text-4xl">+5</span></p>
              <p>Time's up: <span className="font-bold text-4xl">-5</span></p>
            </div>
            

            <Link href="/game">
              <button
                className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 mt-6 hover:scale-105 duration-500 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.2)] text-xl hover:font-bold"
              >
                Start
              </button>
            </Link>
          </div>
        </div>

  )
}

export default page