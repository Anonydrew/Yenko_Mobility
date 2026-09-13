import { useEffect } from 'react';
import { site } from '@/config/site';

/** Sets the browser tab title and the meta description for the current page. */
export function useDocumentTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : `${site.name} | Campus e-bikes`;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description ?? site.description);
  }, [title, description]);
}
