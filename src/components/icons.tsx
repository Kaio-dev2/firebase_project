import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 13 12 16.5 19.5 13 12 9.5zm0 7.5L4.5 20.5 12 24l7.5-3.5L12 17z"></path>
  </svg>
);
