import React from 'react'
import { _404_IMG } from '@constants';
import { useHistory } from 'react-router';

function NotFoundPage () {
    const history = useHistory();
    const onClick = () => history.push('/')

    return (
        <div className='w-full h-screen flex justify-center' >
            <div className='max-w-md w-full py-20 px-4 flex flex-col items-center' >
                {/* 언젠가 이미지 키우고 만다 ㅡ.ㅡ */}
                <img 
                    onClick={onClick}
                    src={_404_IMG} alt='404_img' 
                    className='mb-6 cursor-pointer' 
                />
                <h1 className='text-3xl font-semibold'> Nothing to Eat Here... </h1>
                <h3 className='mt-3' > Let’s discover something delicious. </h3>
                <button 
                    onClick={onClick}
                    className='mt-6 bg-black text-white w-full py-3 font-semibold text-lg hover:opacity-80' 
                > 
                    Find Food 
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage;