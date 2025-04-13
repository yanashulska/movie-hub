import './Footer.css'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import youtube_icon from '../../assets/youtube_icon.png'


const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-icons'>
                <img src={instagram_icon} alt="" />
                <img src={facebook_icon} alt="" />
                <img src={twitter_icon} alt="" />
                <img src={youtube_icon} alt="" />
            </div>
            <p>Contact Us</p>
            <ul>
                <li>FAQ</li>
                <li>Media Center</li>
                <li>Ways to Watch</li>
                <li>Cookie Preferences</li>
                <li>Speed Test</li>
                <li>Help center</li>
                <li>Investor Relations</li>
                <li>Terms of Use</li>
                <li>Corporate Information</li>
                <li>Legal Notices</li>
                <li>Account</li>
                <li>Job</li>
                <li>Privacy</li>
                <li>Contact Us</li>
                <li>Other</li>
            </ul>
        </div>
    )
}

export default Footer