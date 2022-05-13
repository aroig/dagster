import React from "react";

import { useNavigation } from "util/useNavigation";
import MDXComponents, {
  SearchIndexContext,
} from "components/mdx/MDXComponents";
import Pagination from "components/Pagination";
import Icons from "components/Icons";
import VersionDropdown from "components/VersionDropdown";

import { useVersion } from "util/useVersion";

import Link from "components/Link";
import { MdxRemote } from "next-mdx-remote/types";
import { NextSeo } from "next-seo";
import SidebarNavigation from "components/mdx/SidebarNavigation";
import hydrate from "next-mdx-remote/hydrate";
import { useRouter } from "next/router";
import GitHubButton from "react-github-btn";
const components: MdxRemote.Components = MDXComponents;

export type MDXData = {
  mdxSource: MdxRemote.Source;
  frontMatter: {
    title: string;
    description: string;
  };
  searchIndex: any;
  tableOfContents: any;
  githubLink: string;
};

export const VersionNotice = () => {
  const { asPath, version, defaultVersion } = useVersion();

  if (version == defaultVersion) {
    return null;
  }

  return (
    <div className="bg-yellow-100 mb-10 mt-6 mx-4 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {version === "master"
            ? "You are viewing an unreleased version of the documentation."
            : "You are viewing an outdated version of the documentation."}
        </h3>
        <div className="mt-2 text-sm text-gray-500">
          {version === "master" ? (
            <p>
              This documentation is for an unreleased version ({version}) of
              Dagster. The content here is not guaranteed to be correct or
              stable. You can view the version of this page from our latest
              release below.
            </p>
          ) : (
            <p>
              This documentation is for an older version ({version}) of Dagster.
              You can view the version of this page from our latest release
              below.
            </p>
          )}
        </div>
        <div className="mt-3 text-sm">
          <Link href={asPath} version={defaultVersion}>
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              {" "}
              View Latest Documentation <span aria-hidden="true">→</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const BreadcrumbNav = () => {
  const { asPathWithoutAnchor } = useVersion();

  let navigation = useNavigation();

  function traverse(currNode, path, stack) {
    if (currNode.path === path) {
      return [...stack, currNode];
    }
    if (currNode.children === undefined) {
      return;
    }

    let childrenNodes = currNode.children;
    for (let i = 0; i < childrenNodes.length; i++) {
      let match = traverse(childrenNodes[i], path, [...stack, currNode]);
      if (match) {
        return match;
      }
    }
  }

  let breadcrumbItems = [];

  for (let i = 0; i < navigation.length; i++) {
    let matchedStack = traverse(navigation[i], asPathWithoutAnchor, []);
    if (matchedStack) {
      breadcrumbItems = matchedStack;
      break;
    }
  }

  return (
    breadcrumbItems.length > 1 && (
      <nav className="flex flex-nowrap lg:px-4 py-3" aria-label="Breadcrumb">
        <ol className="md:inline-flex space-x-1 lg:space-x-3">
          {breadcrumbItems.map((item, index) => {
            return (
              <li key={item.path || item.title}>
                <div className="flex flex-nowrap items-center">
                  {index > 0 && (
                    <svg
                      className="w-3 h-3 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {Icons["ChevronRight"]}
                    </svg>
                  )}
                  <a
                    href={item.path}
                    className="ml-1 lg:ml-2 text-xs lg:text-sm lg:font-medium text-gray-700 hover:text-gray-900 truncate"
                  >
                    {item.title}
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    )
  );
};

export const VersionedContentLayout = ({ children }) => {
  return (
    <div
      className="flex-1 w-full min-w-0 relative z-0 focus:outline-none"
      tabIndex={0}
    >
      <div className="flex flex-col lg:mt-5">
        <div className="flex justify-between px-4 mb-5">
          <div className="flex justify-start flex-col lg:flex-row lg:px-4 w-full">
            <div className="flex">
              <VersionDropdown />
            </div>
            <div className="flex">
              <BreadcrumbNav />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {/* Start main area*/}

          <VersionNotice />
          <div className="py-4 px-4 sm:px-6 lg:px-8 w-full">
            {children}
            <Pagination />
          </div>
          {/* End main area */}
        </div>
      </div>
    </div>
  );
};

export function UnversionedMDXRenderer({
  data,
  toggleFeedback,
}: {
  data: MDXData;
  toggleFeedback: any;
}) {
  const { query } = useRouter();
  const { editMode } = query;

  const { mdxSource, frontMatter, searchIndex, tableOfContents, githubLink } =
    data;

  const content = hydrate(mdxSource, {
    components,
    provider: {
      component: SearchIndexContext.Provider,
      props: { value: searchIndex },
    },
  });
  const navigationItems = tableOfContents.items.filter((item) => item?.items);

  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          title: frontMatter.title,
          description: frontMatter.description,
        }}
      />
      <div
        className="flex-1 min-w-0 relative z-0 focus:outline-none pt-4"
        tabIndex={0}
      >
        <div className="flex flex-row pb-8">
          {/* Start main area*/}

          <div className="py-4 px-4 sm:px-6 lg:px-8 w-full">
            <div className="DocSearch-content prose dark:prose-dark max-w-none">
              {content}
            </div>
          </div>
          {/* End main area */}
        </div>
      </div>

      {!editMode && (
        <aside className="hidden relative xl:block flex-none w-80 flex shrink-0 border-l border-gray-200">
          {/* Start secondary column (hidden on smaller screens) */}
          <div className="flex flex-col justify-between sticky top-24 py-6 px-4">
            <div
              className="mb-8 px-4 pt-2 pb-10 relative overflow-y-scroll border-b border-gray-200"
              style={{ maxHeight: "calc(100vh - 300px)" }}
            >
              <div className="font-semibold text-gable-green">On This Page</div>
              <div className="mt-6">
                {navigationItems && (
                  <SidebarNavigation items={navigationItems} />
                )}
              </div>
            </div>
            <div className="py-2 px-4 flex items-center group">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition transform group-hover:scale-105 group-hover:rotate-6"
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <a
                className="text-sm ml-2 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100"
                href={githubLink}
              >
                Edit Page on GitHub
              </a>
            </div>

            <div className="py-2 px-4 flex items-center group">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition transform group-hover:scale-105 group-hover:rotate-6"
                role="img"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <button
                className="text-sm ml-2 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100"
                onClick={toggleFeedback}
              >
                Share Feedback
              </button>
            </div>
            <div className="py-2 px-4 flex items-center group">
              <GitHubButton
                href="https://github.com/dagster-io/dagster"
                data-icon="octicon-star"
                data-show-count="true"
                aria-label="Star dagster-io/dagster on GitHub"
              >
                Star
              </GitHubButton>
            </div>
          </div>
          {/* End secondary column */}
        </aside>
      )}
    </>
  );
}

function VersionedMDXRenderer({
  data,
  toggleFeedback,
}: {
  data: MDXData;
  toggleFeedback: any;
}) {
  const { query } = useRouter();
  const { editMode } = query;

  const { mdxSource, frontMatter, searchIndex, tableOfContents, githubLink } =
    data;

  const content = hydrate(mdxSource, {
    components,
    provider: {
      component: SearchIndexContext.Provider,
      props: { value: searchIndex },
    },
  });
  const navigationItems = tableOfContents.items.filter((item) => item?.items);

  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          title: frontMatter.title,
          description: frontMatter.description,
        }}
      />

      <VersionedContentLayout>
        <div className="DocSearch-content prose dark:prose-dark max-w-none">
          {content}
        </div>
      </VersionedContentLayout>

      {!editMode && (
        <aside className="hidden relative xl:block flex-none w-80 flex shrink-0 border-l border-gray-200">
          {/* Start secondary column (hidden on smaller screens) */}
          <div className="flex flex-col justify-between sticky top-24 py-6 px-4">
            <div
              className="mb-8 px-4 pt-2 pb-10 relative overflow-y-scroll border-b border-gray-200"
              style={{ maxHeight: "calc(100vh - 300px)" }}
            >
              <div className="font-semibold text-gable-green">On This Page</div>
              <div className="mt-6">
                {navigationItems && (
                  <SidebarNavigation items={navigationItems} />
                )}
              </div>
            </div>
            <div className="py-2 px-4 flex items-center group">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition transform group-hover:scale-105 group-hover:rotate-6"
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <a
                className="text-sm ml-2 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100"
                href={githubLink}
              >
                Edit Page on GitHub
              </a>
            </div>
            <div className="py-2 px-4 flex items-center group">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition transform group-hover:scale-105 group-hover:rotate-6"
                role="img"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <button
                className="text-sm ml-2 text-gray-500 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100"
                onClick={toggleFeedback}
              >
                Share Feedback
              </button>
            </div>
            <div className="py-2 px-4 flex items-center group">
              <GitHubButton
                href="https://github.com/dagster-io/dagster"
                data-icon="octicon-star"
                data-show-count="true"
                aria-label="Star dagster-io/dagster on GitHub"
              >
                Star
              </GitHubButton>
            </div>
          </div>
          {/* End secondary column */}
        </aside>
      )}
    </>
  );
}

export default VersionedMDXRenderer;
