import {
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  XIcon,
} from '../../constants/icons';

const Socials = () => (
  <div>
    <a href="https://twitch.tv/athenaus" target="_blank" rel="noreferrer">
      <TwitchIcon />
    </a>
    <a href="https://x.com/athenaus" target="_blank" rel="noreferrer">
      <XIcon />
    </a>
    <a href="https://github.com/devthena" target="_blank" rel="noreferrer">
      <GithubIcon />
    </a>
    <a
      href="https://instagram.com/theathenaus"
      target="_blank"
      rel="noreferrer">
      <InstagramIcon />
    </a>
  </div>
);

export default Socials;
