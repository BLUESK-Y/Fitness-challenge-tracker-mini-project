import React from 'react'
import "./heroSection.css";
import {joinChallengeIcon} from "../../assets"
import {usersIcon} from "../../assets"
import {landingPageImage} from "../../assets"
const heroSection = () => {
  return (
    <div className='heroSection'>
        <div className='hsContainer'>
            <div className='hstextContent'>
                <div className='hstcLive'>
                    <div className='hstclDot'></div>
                    <div className='hstclText'>
                        <p>LIVE CHALLENGES NOW ACTIVE</p>
                    </div>
                </div>
                <h1 className='hstcTagLine'>Push Your Limits.Track Your Progress.</h1>
                <div className='hstctlBody'>
                    <p className='hstclbText'>Join thousands of athletes in global fitness challenges. Track
                       every rep, run, and ride with precision. Elevate your performance
                       today.
                    </p>
                </div>
                <div className='hstcButtons'>
                    <button className='hstcbJCBtn'>Join Challenge <img src={joinChallengeIcon} alt="" className='hstcbjcbtnSvg'/></button>
                    <button className='hstcbECBtn'>Explore Community</button>
                </div>
                <div className='hstcJoinedBy'>
                    <img src={usersIcon} alt="" className='hstcjbSvg'/>
                    <p className='hstcjsText'>Joined by 20,000+ athletes worldwide</p>
                </div>
            </div>
            <div className='hsVisualSide'>
                <div className='hsvsImageContainer'>
                    <img src={landingPageImage} alt="" className='hsvsImage' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default heroSection