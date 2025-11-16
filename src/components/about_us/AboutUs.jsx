import "./about_us.css"

function AboutUs(){
    return (
        <>
            
                <section className="about_us">
                    <div className="container">
                    <h2 className="about_us_title">About Us</h2>
                    </div>
                </section>
                
                <section className="welcome_section"> 
                    <div className="container">
                        <div className="welcome_section_">
                            <div className="text_title">
                                <p>WELCOME TO OUR TO-DO APP!</p>
                            </div>
                            <div className="about_us_text">
                                <p className="about_us_text_"> 
                                    We’re excited to have you here.
                                    This is the place where your goals turn into action and your plans become progress.
                                    Whether you’re organizing your day, managing projects, or simply keeping track of your ideas — we’re here to help you stay focused and productive.
                                    Start adding your tasks, stay motivated, and make every day count.
                                    Let’s get things done — together!
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </section>
                
                <section className="mission_section">
                    <div className="container">
                        <div className="welcome_section_">
                            <div className="text_title">
                                <p>OUR MISSION</p>
                            </div>
                            <div className="about_us_text">
                                <p className="about_us_text_">We’re on a mission to empower people to take control of their time, reduce stress, and bring structure to their daily lives.</p>
                            </div> 
                        </div>
                    </div>
                </section>

                <section className="values_section">
                    <div className="container">
                        <div className="welcome_section_">
                            <div className="text_title_2">  
                                <p >OUR VALUES</p>
                            </div>
                            <div className="about_us_text">
                                <p className="about_us_text_">
                                    Simplicity — We believe productivity should be clear and effortless. <br />
                                    Consistency — Small steps every day lead to big results. <br />
                                    Growth — Every task completed brings you closer to your goals. <br /> 
                                    Community — We grow stronger together, supporting each other’s progress. <br />
                                    Integrity — We stay honest, transparent, and user-focused in everything we do.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </section>
            
        </>
    )
}

export default AboutUs;