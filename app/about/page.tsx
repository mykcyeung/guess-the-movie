import { backend, contact, frontend } from '@/utils/techImage'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const About = () => {
  const getYear = new Date().getFullYear()
  return (
    <div className='p-6 max-w-[80%] md:max-w-[50%]  mx-auto text-center space-y-6 font-gabarito min-h-screen my-12'>
      <h1 className='text-4xl sm:text-5xl lg:text-7xl font-medium text-[#c8a116] font-monoton'>About this game</h1>

      {/* STACK SECTION */}
      <div>

        {/* FRONTEND */}
        <div className='mt-12 flex flex-col justify-center gap-5 bg-[#383838b3] px-8 py-8 rounded-4xl shadow-[0_0_20px_6px_rgba(255,255,255,0.1)]'>
  <div className='text-2xl md:text-4xl font-bold flex justify-center'>Frontend Stacks</div>

  {/* Centered grid wrapper */}
  <div className="flex justify-center">
    <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-4'>
      {frontend.map(({ name, icon }) => (
        <div key={name} className="flex justify-center items-center">
          <Image
            src={`/${icon}`}
            alt={name}
            width={90}
            height={90}
            className='object-cover rounded-2xl'
          />
        </div>
      ))}
    </div>
  </div>

  <div className='mt-4 text-left'>
    Built using JavaScript with React and Next.js for seamless UI development and efficient API handling. The application fetches movie data from the OMDB API and manages routing and rendering using Next.js features.
  </div> 
</div>


        {/* BACKEND */}
        <div className='mt-12 flex flex-col justify-center gap-5 bg-[#383838b3] px-8 py-8 rounded-4xl shadow-[0_0_20px_6px_rgba(255,255,255,0.1)]'>
        <div className='text-2xl md:text-4xl font-bold flex justify-center'>Backend Stacks</div>

        {/* Wrapper to center the grid */}
        <div className="flex justify-center">
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-4'>
            {backend.map(({ name, icon }) => (
              <div key={name} className="flex justify-center items-center">
                <Image
                  src={`/${icon}`}
                  alt={name}
                  width={90}
                  height={90}
                  className='object-cover rounded-2xl'
                />
              </div>
            ))}
          </div>
        </div>

        <div className='mt-4 text-left '>
          The frontend communicates with AWS API Gateway, which triggers a Lambda function. This function processes requests and integrates with Amazon Rekognition to analyze image data. The entire backend is deployed using AWS Amplify, with automatic integration into CloudFront for optimized content delivery.
        </div>
      </div>


        <div>
          <Link href="/game">
            <button className='font-monoton text-2xl sm:text-3xl text-[#c8a116] hover:scale-105 duration-500 mt-16'>Back to the Game</button>
          </Link>
        </div>

        {/* FOOTER */}
        <div className='mt-16'>
          <div className='flex justify-center gap-14'>
            {contact.map(({ name, icon, link }) => (
              <Link key={name} href={link} target='_blank'>
                <Image
                  src={icon}
                  alt={name}
                  width={25}
                  height={25}
                />
              </Link>
            ))}
          </div>
          <div>
            <p className="text-[10px] lg:text-[14px] mt-4">
              © {getYear} Guess the Movie. All rights reserved.
            </p>
          </div>
        </div>

        

      </div>
    </div>
  )
}

export default About