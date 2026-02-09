'use client';
import Image from "next/image";
import posthog from 'posthog-js'

function handlePurchase() {
        posthog.capture('purchase_completed', { amount: 99 })
    }


const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={()=> {handlePurchase}}>
        <a href="#events">Explore
            <Image src="/icons/arrow-down.svg" alt="arrow down" width={24} height={24}/>
        </a>
    </button> 
  )
}

export default ExploreBtn