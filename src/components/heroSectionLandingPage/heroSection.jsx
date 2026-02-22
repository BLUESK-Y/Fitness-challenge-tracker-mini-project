import React from "react";
import { joinChallengeIcon, usersIcon, landingPageImage } from "../../assets";
import "./heroSection.css"

const HeroSection = () => {
  return (
    <section className="pt-5 pb-0 my-0 heroSection">
        <div className="container mt-5 mb-0 pb-0">
            
            <div className="row align-items-center">
                {/* LEFT SIDE */}
                <div className="col-lg-6 mb-5 mb-lg-0">
                    {/* Live Badge */}
                    <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill text-white mb-4 live">
                        <span className="rounded-circle me-2 liveDot" style={{ width: "8px", height: "8px" }}></span>
                        <small className="text-uppercase fw-bold liveText">
                            Live Challenges Now Active
                        </small>
                    </div>

                    {/* Heading */}
                    <h1 className="display-1 fw-bold mb-4 tagLine">
                        Push Your <small className="colorChange">Limits.</small> Track Your Progress.
                    </h1>

                    {/* Paragraph */}
                    <p className="lead fw-normal my-5 me-5 TgBody">
                        Join thousands of athletes in global fitness challenges.
                        Track every rep, run, and ride with precision.
                        Elevate your performance today.
                    </p>

                    {/* Buttons */}
                    <div className="d-flex gap-3 mb-5 flex-wrap">
                        <button className="btn  btn-lg d-flex align-items-center gap-2 joinchallengeBtn">
                            <small className="fw-bold jcBtnText">Join Challenge</small>
                            <img src={joinChallengeIcon} alt="" width="20" />
                        </button>

                        <button className="btn btn-outline-dark btn-lg exploreCommunitybtn">
                            <small className="fw-bold ecBtnText">Explore Community</small>
                        </button>
                    </div>

                    {/* Joined By */}
                    <div className="d-flex align-items-center gap-3">
                        <img src={usersIcon} alt="" height="40" />
                        <small className="fw-bold joinedTxt">
                            Joined by 20,000+ athletes worldwide
                        </small>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="col-lg-6 text-center">
                    <div className="p-4 rounded-4 imageContainer">
                        <img src={landingPageImage} alt="Landing" className="img-fluid rounded-3 my-3"/>
                    </div>
                </div>
          
            </div>
        </div>
    </section>
  );
};

export default HeroSection;