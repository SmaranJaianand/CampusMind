import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M176 128c0 22.09-17.91 40-40 40-19.05 0-35.3-13.43-39.14-31.55C86.99 133.58 80 120.34 80 104c0-22.09 17.91-40 40-40s40 17.91 40 40"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M96.86 136.45A40 40 0 0 1 128 96h.5a39.5 39.5 0 0 1 39.5 39.5 39.5 39.5 0 0 1-39.5 39.5H128a40 40 0 0 1-39.14-31.55"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M160 64a40 40 0 0 1-80 0"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M128 176v48m-24-24h48"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M152 168c16 0 24-8 24-24s-8-24-24-24"
      />
    </svg>
  );
}
