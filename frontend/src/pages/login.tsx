import React from "react";

function Login () {
    return (
        <div className='h-screen flex justify-center items-center  bg-gray-800' > { /* 배경 */ }
            <div className='bg-white w-full max-w-lg py-10 rounded-lg flex flex-col items-center' > {/* 로그인 배경 */}
                <h1 className='text-2xl text-gray-800 mb-5 select-none' > Login Page </h1>
                <form className='flex flex-col w-full px-8' >
                    <input 
                        placeholder='email' 
                        className='bg-gray-200 mb-3 py-3 px-4 rounded-lg shadow-inner border-2 border-white focus:outline-none focus:border-blue-500 focus:border-opacity-30'
                    />
                    <input 
                        placeholder='password' 
                        className='bg-gray-200 mb-3 py-3 px-4 rounded-lg shadow-inner border-2 border-white focus:outline-none focus:border-blue-500 focus:border-opacity-30'
                    />
                    <button className='mb-3 py-3 px-4 rounded-lg bg-gray-800 text-white text-lg focus:outline-none hover:bg-opacity-90' >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;