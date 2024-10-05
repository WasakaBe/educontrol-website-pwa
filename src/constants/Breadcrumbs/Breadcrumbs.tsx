import React from 'react'
import './Bread.css'

interface BreadcrumbProps {
  path: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  return (
    <ol className="breadcrumb">
      <li className="breadcrumb-item">
        <a href="/" className="breadcrumb-link">
          <svg
            className="breadcrumb-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </a>
        <svg
          className="breadcrumb-divider"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li className="breadcrumb-item">
        <a href="/#" className="breadcrumb-link">
          <svg
            className="breadcrumb-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
          </svg>
        </a>
        <svg
          className="breadcrumb-divider"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li className="breadcrumb-current">{path}</li>
    </ol>
  )
}

export default Breadcrumb
