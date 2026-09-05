import data from '../data/links.json' with { type: 'json' };

export type Link = {
  slug: string;
  label: string;
  url: string;
  icon?: string;
  accent?: string;
  featured?: boolean;
};

export type Profile = {
  name: string;
  handle?: string;
  tagline?: string;
  avatar: string;
};

export const profile: Profile = data.profile;

/** Only `featured` entries get a button; the rest exist purely as redirects. */
export const featuredLinks: Link[] = (data.links as Link[]).filter((link) => link.featured);
