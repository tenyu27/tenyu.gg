import { LinkButton } from './components/LinkButton';
import { featuredLinks, profile } from './links';

export function App() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob aurora__blob--a" />
        <span className="aurora__blob aurora__blob--b" />
        <span className="aurora__blob aurora__blob--c" />
      </div>

      <main className="page">
        <header className="profile">
          <div className="profile__avatar">
            <img src={profile.avatar} alt={profile.name} width={128} height={128} />
          </div>
          <h1 className="profile__name">{profile.name}</h1>
          {profile.handle ? <p className="profile__handle">{profile.handle}</p> : null}
          {profile.tagline ? <p className="profile__tagline">{profile.tagline}</p> : null}
        </header>

        <nav className="stack" aria-label="Links">
          {featuredLinks.map((link, index) => (
            <LinkButton key={link.slug} link={link} index={index} />
          ))}
        </nav>

        <footer className="footer">
          <span>tenyu.gg</span>
        </footer>
      </main>
    </>
  );
}
