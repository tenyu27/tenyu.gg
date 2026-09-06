import { LinkButton } from './components/LinkButton';
import { featuredLinks, profile } from './links';

export function App() {
  return (
    <main className="page">
      <header className="profile">
        <img
          className="profile__avatar"
          src={profile.avatar}
          alt={profile.name}
          width={112}
          height={112}
        />
        <h1 className="profile__name">{profile.name}</h1>
        {profile.handle ? <p className="profile__handle">{profile.handle}</p> : null}
        {profile.tagline ? <p className="profile__tagline">{profile.tagline}</p> : null}
      </header>

      <nav className="stack" aria-label="Links">
        {featuredLinks.map((link) => (
          <LinkButton key={link.slug} link={link} />
        ))}
      </nav>

      <footer className="footer">tenyu.gg</footer>
    </main>
  );
}
