import 
{ BsFillPersonCheckFill, BsFillChatFill, BsPeopleFill, BsFillBellFill, BsFillCapslockFill }
 from 'react-icons/bs'


 const Sidebar = () => {
    return (
    <div className='main-container'>
        <div className='main-title'>
            <h3>Analytics</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Total Registrants</h3>

                    <BsFillPersonCheckFill className='card_icon'/>
                </div>
                <h1>340</h1>
                <h4>this month</h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Average Visit Time</h3>
                    <BsFillChatFill className='card_icon'/>
                </div>
                <h1>4m 5s</h1>
                <h4>higher than yesterday <BsFillCapslockFill className='card_icon'/> </h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Window Analysis</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>Window 6</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Service Comments</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1>25</h1>
                <h4>higher than yesterday <BsFillCapslockFill className='card_icon'/> </h4>
            </div>
        </div>


    );
};

export default Sidebar;